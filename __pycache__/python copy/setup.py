from http.server import SimpleHTTPRequestHandler, HTTPServer

# Configuração do servidor
port = 8080
handler = SimpleHTTPRequestHandler
httpd = HTTPServer(('localhost', port), handler)

print(f'Servidor rodando na porta {port}')

# Iniciar o servidor
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print('Servidor encerrado')
    httpd.server_close()
