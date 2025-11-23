from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2 import errors
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
app.secret_key = "UNYX_SECRET_2025"

# ---------------------------------------------------
# 🔗 CONFIGURACIÓN DE POSTGRES
# ---------------------------------------------------
DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "dbname": "unyx_db",
    "user": "postgres",
    "password": "1308",  # asegurate que todos usen lo mismo
}


def get_connection():
    return psycopg2.connect(
        host=DB_CONFIG["host"],
        port=DB_CONFIG["port"],
        dbname=DB_CONFIG["dbname"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        cursor_factory=RealDictCursor,
    )


# ---------------------------------------------------
# 🔧 FUNCIONES AUXILIARES PARA CONSULTAS
# ---------------------------------------------------
def get_user_profile(user_id):
    """Obtiene datos combinados de users y profiles para un usuario."""
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # Consulta combinada de users y profiles
        cur.execute("""
            SELECT 
                u.id, u.nombre, u.apellido, u.email,
                p.display_name, p.username, p.bio, 
                p.avatar_url, p.header_image_url
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            WHERE u.id = %s;
        """, (user_id,))
        
        user_data = cur.fetchone()
        cur.close()
        conn.close()
        
        if user_data:
            # Si no tiene display_name, usar nombre + apellido
            if not user_data.get('display_name'):
                user_data['display_name'] = f"{user_data['nombre']} {user_data['apellido']}"
            
            # Agregar contadores (por ahora en 0, se pueden calcular después)
            user_data['followers_count'] = 0
            user_data['following_count'] = 0
            user_data['posts_count'] = 0
            
        return user_data
    except Exception as e:
        print(f"ERROR get_user_profile: {repr(e)}")
        return None


def get_user_posts(user_id):
    """Obtiene las publicaciones de un usuario."""
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, content_text, image_url, created_at
            FROM posts
            WHERE user_id = %s
            ORDER BY created_at DESC;
        """, (user_id,))
        
        posts = cur.fetchall()
        cur.close()
        conn.close()
        
        return posts
    except Exception as e:
        print(f"ERROR get_user_posts: {repr(e)}")
        return []


def get_suggested_users(current_user_id, limit=5):
    """Obtiene usuarios sugeridos (excluyendo al usuario actual)."""
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT 
                u.id, u.nombre, u.apellido,
                p.display_name, p.username, p.avatar_url
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            WHERE u.id != %s
            ORDER BY u.fecha_registro DESC
            LIMIT %s;
        """, (current_user_id, limit))
        
        users = cur.fetchall()
        cur.close()
        conn.close()
        
        # Asegurar que cada usuario tenga display_name
        for user in users:
            if not user.get('display_name'):
                user['display_name'] = f"{user['nombre']} {user['apellido']}"
        
        return users
    except Exception as e:
        print(f"ERROR get_suggested_users: {repr(e)}")
        return []


def create_default_profile(user_id):
    """Crea un perfil por defecto para un usuario que no tiene."""
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # Obtener datos del usuario
        cur.execute("SELECT nombre, apellido, email FROM users WHERE id = %s;", (user_id,))
        user = cur.fetchone()
        
        if not user:
            cur.close()
            conn.close()
            return False
        
        # Generar username único basado en email
        email_prefix = user['email'].split('@')[0].lower()
        username = email_prefix
        
        # Verificar si el username ya existe y agregar número si es necesario
        counter = 1
        while True:
            cur.execute("SELECT id FROM profiles WHERE username = %s;", (username,))
            if not cur.fetchone():
                break
            username = f"{email_prefix}{counter}"
            counter += 1
        
        # Crear perfil
        display_name = f"{user['nombre']} {user['apellido']}"
        
        cur.execute("""
            INSERT INTO profiles (user_id, display_name, username, bio)
            VALUES (%s, %s, %s, %s);
        """, (user_id, display_name, username, "Nuevo en UNYX"))
        
        conn.commit()
        cur.close()
        conn.close()
        
        print(f"[OK] Perfil creado para user_id={user_id}, username={username}")
        return True
        
    except Exception as e:
        print(f"ERROR create_default_profile: {repr(e)}")
        if conn:
            conn.rollback()
        return False


# ===================================================
# 🟢 RUTAS PRINCIPALES DEL FRONTEND
# ===================================================
@app.route("/")
def home():
    return render_template("auth/login.html")


@app.route("/registro")
def registro():
    return render_template("auth/registro.html")


@app.route("/feed")
def feed():
    # Verificar que el usuario esté logueado
    user_id = session.get("user_id")
    if not user_id:
        return redirect(url_for("home"))
    
    # Obtener datos del usuario actual para el mini-profile
    current_user = get_user_profile(user_id)
    if not current_user:
        return redirect(url_for("home"))
    
    # Obtener usuarios sugeridos
    suggested_users = get_suggested_users(user_id, limit=5)
    
    return render_template(
        "feed/index.html",
        current_user=current_user,
        suggested_users=suggested_users
    )


@app.route("/explore")
def explore():
    return render_template("explore/index.html")


@app.route("/profile")
def profile():
    # Verificar que el usuario esté logueado
    user_id = session.get("user_id")
    if not user_id:
        return redirect(url_for("home"))
    
    # Obtener datos del perfil del usuario
    user_profile = get_user_profile(user_id)
    if not user_profile:
        return redirect(url_for("home"))
    
    # Obtener publicaciones del usuario
    user_posts = get_user_posts(user_id)
    
    # Actualizar contador de posts
    user_profile['posts_count'] = len(user_posts)
    
    # Obtener usuarios sugeridos
    suggested_users = get_suggested_users(user_id, limit=5)
    
    return render_template(
        "profile/profile.html",
        user_profile=user_profile,
        user_posts=user_posts,
        suggested_users=suggested_users
    )


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("home"))


# ===================================================
# 🔍 ENDPOINT SIMPLE PARA PROBAR LA DB
# ===================================================
@app.route("/api/users")
def api_users():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, nombre, apellido, email, dni FROM users ORDER BY id;")
        users = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(users)
    except Exception as e:
        print("ERROR /api/users:", repr(e))
        return jsonify({"ok": False, "error": str(e)}), 500


# ===================================================
# 🟢 API → REGISTRAR USUARIO
# ===================================================
@app.route("/api/register", methods=["POST"])
def api_register():
    data = request.json or {}

    nombre = data.get("nombre")
    apellido = data.get("apellido")
    email = data.get("email")
    password = data.get("password")
    fecha_nacimiento = data.get("fecha_nacimiento")
    dni = data.get("dni")

    if not all([nombre, apellido, email, password, fecha_nacimiento, dni]):
        return jsonify({"ok": False, "error": "Datos incompletos"}), 400

    # Normalizar fecha a AAAA-MM-DD
    try:
        fecha_nac_date = datetime.strptime(fecha_nacimiento, "%Y-%m-%d").date()
    except Exception:
        return jsonify(
            {"ok": False, "error": "Formato de fecha inválido (usa AAAA-MM-DD)"}
        ), 400

    password_hash = generate_password_hash(password)

    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        # 1) Verificar si ya existe email o DNI
        cur.execute(
            "SELECT id FROM users WHERE email = %s OR dni = %s;",
            (email, dni),
        )
        existing = cur.fetchone()
        if existing:
            cur.close()
            conn.close()
            return jsonify(
                {"ok": False, "error": "El email o el DNI ya están registrados."}
            ), 409

        # 2) Insertar usuario
        cur.execute(
            """
            INSERT INTO users (nombre, apellido, email, password_hash, fecha_nacimiento, dni)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id;
            """,
            (nombre, apellido, email, password_hash, fecha_nac_date, dni),
        )

        new_id = cur.fetchone()["id"]
        conn.commit()
        
        # 3) Crear perfil automáticamente
        # Generar username único basado en email
        email_prefix = email.split('@')[0].lower()
        username = email_prefix
        
        # Verificar si el username ya existe y agregar número si es necesario
        counter = 1
        while True:
            cur.execute("SELECT id FROM profiles WHERE username = %s;", (username,))
            if not cur.fetchone():
                break
            username = f"{email_prefix}{counter}"
            counter += 1
        
        # Crear perfil
        display_name = f"{nombre} {apellido}"
        
        cur.execute("""
            INSERT INTO profiles (user_id, display_name, username, bio)
            VALUES (%s, %s, %s, %s);
        """, (new_id, display_name, username, "Nuevo en UNYX"))
        
        conn.commit()
        
        cur.close()
        conn.close()

        return jsonify({"ok": True, "user_id": new_id})

    except errors.UniqueViolation as e:
        if conn:
            conn.rollback()
        print("ERROR REGISTRO (duplicado):", repr(e))
        return (
            jsonify(
                {"ok": False, "error": "El email o el DNI ya están registrados."}
            ),
            409,
        )

    except Exception as e:
        if conn:
            conn.rollback()
        print("ERROR REGISTRO:", repr(e))
        return jsonify({"ok": False, "error": "Error interno en el registro"}), 500


# ===================================================
# 🔵 API → LOGIN
# ===================================================
@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.json or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"ok": False, "error": "Datos incompletos"}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM users WHERE email = %s;", (email,))
        user = cur.fetchone()

        if not user:
            cur.close()
            conn.close()
            return jsonify({"ok": False, "error": "Email no encontrado"}), 404

        if not check_password_hash(user["password_hash"], password):
            cur.close()
            conn.close()
            return jsonify({"ok": False, "error": "Contraseña incorrecta"}), 401

        # Verificar si el usuario tiene perfil, si no, crearlo
        cur.execute("SELECT id FROM profiles WHERE user_id = %s;", (user["id"],))
        profile_exists = cur.fetchone()
        
        cur.close()
        conn.close()
        
        if not profile_exists:
            print(f"[AVISO] Usuario {user['id']} sin perfil, creando...")
            create_default_profile(user["id"])

        # Guardar user_id en sesión
        session["user_id"] = user["id"]
        session["email"] = user["email"]
        
        return jsonify({"ok": True, "redirect": "/feed"})

    except Exception as e:
        print("ERROR LOGIN:", repr(e))
        return jsonify({"ok": False, "error": "Error interno"}), 500


# ===================================================
# 🚀 EJECUTAR APP
# ===================================================
if __name__ == "__main__":
    print("UNYX corriendo en http://127.0.0.1:5500/")
    app.run(host="127.0.0.1", port=5500, debug=True)
