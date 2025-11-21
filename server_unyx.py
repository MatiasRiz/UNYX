import http.server
import socketserver
import os

# Puerto donde va a levantar UNYX
PORT = 5500

# Cambiamos el directorio de trabajo a la carpeta donde está este script
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(PROJECT_DIR)

class Handler(http.server.SimpleHTTPRequestHandler):
    # No hace falta modificar nada, sirve archivos estáticos tal cual
    pass

with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    print(f"Servidor UNYX corriendo en http://127.0.0.1:{PORT}")
    httpd.serve_forever()
