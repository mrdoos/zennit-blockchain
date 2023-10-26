from flask import Flask, request, jsonify
import json
import timeit

app = Flask(__name__)

# Defina a função que deseja benchmark
def generate_key():
    key = SaplingKey.generate_key()
    return key

# Configurações para o benchmark
n = 1000

@app.route('/generate_key', methods=['GET'])
def generate_key_route():
    keys = []
    for _ in range(n):
        key = generate_key()
        keys.append(key)
    return jsonify(keys)

if __name__ == '__main__':
    app.run(debug=True)
