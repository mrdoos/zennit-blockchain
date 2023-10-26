import hashlib
import json
from time import time
from uuid import uuid4
from flask import Flask, jsonify, request

app = Flask(__name__)

class Blockchain:
    def __init__(self):
        self.chain = []
        self.pending_transactions = []
        self.nodes = set()
        self.create_block(0, '0')

    def create_block(self, nonce, previous_hash):
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time(),
            'transactions': self.pending_transactions,
            'nonce': nonce,
            'previous_hash': previous_hash,
        }
        self.pending_transactions = []
        self.chain.append(block)
        return block

    def get_previous_block(self):
        return self.chain[-1]

    def proof_of_work(self, previous_nonce):
        nonce = 0
        while self.valid_proof(nonce, previous_nonce) is False:
            nonce += 1
        return nonce

    def valid_proof(self, nonce, previous_nonce):
        guess = f'{nonce}{previous_nonce}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == '0000'

    def add_transaction(self, sender, receiver, amount):
        self.pending_transactions.append({
            'sender': sender,
            'receiver': receiver,
            'amount': amount,
        })
        return self.get_previous_block()['index'] + 1

    def add_node(self, address):
        self.nodes.add(address)

    def replace_chain(self):
        network = self.nodes
        longest_chain = None
        max_length = len(self.chain)

        for node in network:
            response = requests.get(f'http://{node}/chain')
            if response.status_code == 200:
                length = response.json()['length']
                chain = response.json()['chain']

                if length > max_length and self.is_valid_chain(chain):
                    max_length = length
                    longest_chain = chain

        if longest_chain:
            self.chain = longest_chain
            return True

        return False

    def is_valid_chain(self, chain):
        previous_block = chain[0]
        current_index = 1

        while current_index < len(chain):
            block = chain[current_index]

            if block['previous_hash'] != self.hash(previous_block):
                return False

            previous_nonce = previous_block['nonce']
            if not self.valid_proof(block['nonce'], previous_nonce):
                return False

            previous_block = block
            current_index += 1

        return True

    @staticmethod
    def hash(block):
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

# Inicializa a blockchain
blockchain = Blockchain()

# Endpoint para minerar um novo bloco
@app.route('/mine', methods=['GET'])
def mine():
    previous_block = blockchain.get_previous_block()
    previous_nonce = previous_block['nonce']
    nonce = blockchain.proof_of_work(previous_nonce)
    previous_hash = blockchain.hash(previous_block)
    block = blockchain.create_block(nonce, previous_hash)
    response = {
        'message': 'Novo bloco minerado com sucesso!',
        'index': block['index'],
        'timestamp': block['timestamp'],
        'transactions': block['transactions'],
        'nonce': block['nonce'],
        'previous_hash': block['previous_hash'],
    }
    return jsonify(response), 200

# Endpoint para adicionar uma nova transação
@app.route('/transactions/new', methods=['POST'])
def new_transaction():
    data = request.get_json()
    required_fields = ['sender', 'receiver', 'amount']
    if not all(field in data for field in required_fields):
        return 'Campos obrigatórios estão faltando', 400
    index = blockchain.add_transaction(data['sender'], data['receiver'], data['amount'])
    response = {'message': f'A transação será adicionada ao bloco {index}'}
    return jsonify(response), 201

# Endpoint para obter a blockchain completa
@app.route('/chain', methods=['GET'])
def full_chain():
    response = {
        'chain': blockchain.chain,
        'length': len(blockchain.chain),
    }
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
