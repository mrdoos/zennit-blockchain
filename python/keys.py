import hashlib
import json
import secp256k1
from flask import Flask

app = Flask(__name__)

class EphemeralKeyPair:
    def __init__(self):
        self.secret = secp256k1.PrivateKey()
        self.public = self.secret.pubkey

def shared_secret(secret_key, transmission_key, public_key):
    ecdh = secp256k1.ecdh(public_key, secret_key)
    ecdh_hash = hashlib.sha256(ecdh).digest()
    shared_secret = hashlib.sha256(ecdh_hash + transmission_key).digest()
    return shared_secret

@app.route('/')
def index():
    # Exemplo de uso:
    ephemeral_key_pair = EphemeralKeyPair()
    secret = ephemeral_key_pair.secret.secret
    public_key = ephemeral_key_pair.public.serialize()

    # Testes
    test_key_generation_and_construction()
    test_diffie_hellman_shared_key()

    return f'Ephemeral Key Pair Secret: {secret}\nEphemeral Key Pair Public: {public_key.hex()}'

def test_key_generation_and_construction():
    key = secp256k1.PrivateKey()
    key2 = secp256k1.PrivateKey(secret=key.private_key)
    assert key2.private_key == key.private_key

def test_diffie_hellman_shared_key():
    key1 = secp256k1.PrivateKey()
    public_key = key1.pubkey.serialize()

    key_pair = EphemeralKeyPair()
    secret_key = key_pair.secret.secret
    shared_secret1 = shared_secret(secret_key, public_key, public_key)

    shared_secret2 = shared_secret(key1.pubkey.serialize(), public_key, public_key)

    assert shared_secret1 == shared_secret2

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4567)
