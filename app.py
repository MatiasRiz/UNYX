from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('auth/login.html')


@app.route('/registro')
def registro():
    return render_template('auth/registro.html')


@app.route('/feed')
def feed():
    return render_template('feed/index.html')


@app.route('/explore')
def explore():
    return render_template('explore/index.html')


@app.route('/profile')
def profile():
    return render_template('profile/profile.html')


@app.route('/logout')
def logout():
    # Aquí iría la lógica de cerrar sesión (session.clear())
    return render_template('auth/login.html')





if __name__ == '__main__':
    print("UNYX corriendo en http://127.0.0.1:5500/")
    app.run(host='127.0.0.1', port=5500, debug=True)
