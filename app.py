from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='.', template_folder='.')


@app.route('/')
def home():
    return send_from_directory('frontend', 'login.html')



@app.route('/<path:filename>')
def serve_any_file(filename):
    return send_from_directory('.', filename)



@app.route('/feed')
def feed():
    return send_from_directory('feed', 'index.html')



@app.route('/registro')
def registro():
    return send_from_directory('registro', 'registro.html')


if __name__ == '__main__':
    print("UNYX corriendo en http://127.0.0.1:5500/")
    app.run(host='127.0.0.1', port=5500, debug=True)
