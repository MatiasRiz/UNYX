from flask import Flask, render_template, request, jsonify, redirect, url_for
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
    return render_template("feed/index.html")


@app.route("/explore")
def explore():
    return render_template("explore/index.html")


@app.route("/profile")
def profile():
    return render_template("profile/profile.html")


@app.route("/logout")
def logout():
    # más adelante: session.clear()
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

        cur.close()
        conn.close()

        if not user:
            return jsonify({"ok": False, "error": "Email no encontrado"}), 404

        if not check_password_hash(user["password_hash"], password):
            return jsonify({"ok": False, "error": "Contraseña incorrecta"}), 401

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
