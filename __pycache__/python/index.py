import subprocess
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    # Execute o arquivo Ruby (.rb)
    resultado = subprocess.run(['ruby', 'seu_arquivo_ruby.rb'], capture_output=True, text=True)

    # Verifique se a execução foi bem-sucedida
    if resultado.returncode == 0:
        return f"Solicitação bem-sucedida\nSaída do Ruby:\n{resultado.stdout}"
    else:
        return f"Erro na solicitação\nErro do Ruby:\n{resultado.stderr}"

if __name__ == '__main__':
    app.run(port=8080)
