from chacha20poly1305 import ChaCha20Poly1305

MAC_SIZE = 16

def encrypt(key, plaintext):
    cipher = ChaCha20Poly1305(key)
    nonce = cipher.nonce
    associated_data = b""
    ciphertext, tag = cipher.encrypt_and_digest(plaintext, associated_data)
    return nonce + ciphertext + tag

def decrypt(key, ciphertext):
    nonce = ciphertext[:8]
    ciphertext = ciphertext[8:-MAC_SIZE]
    tag = ciphertext[-MAC_SIZE:]
    ciphertext = ciphertext[:-MAC_SIZE]
    cipher = ChaCha20Poly1305(key, nonce)
    associated_data = b""
    plaintext = cipher.decrypt_and_verify(ciphertext, tag, associated_data)
    return plaintext

# Testando a encriptação e descriptação
key = ChaCha20Poly1305.generate_key()
plaintext = b"This is a test message."

encrypted_text = encrypt(key, plaintext)
decrypted_plaintext = decrypt(key, encrypted_text)

print(f"Texto original: {plaintext.decode()}")
print(f"Texto descriptografado: {decrypted_plaintext.decode()}")

# Define a constante HEX_CHARS
HEX_CHARS = "0123456789abcdef"

# Função para ler um elemento do campo escalar de bytes
def read_scalar(reader):
    fr_repr = reader.read(32)
    return int(fr_repr.hex(), 16)

# Função para ler um ponto de bytes
def read_point(reader):
    point_repr = reader.read(32)
    return point_repr.hex()

# Função para converter bytes para uma string hexadecimal
def bytes_to_hex(bytes):
    return bytes.hex()

# Função para converter uma string hexadecimal para bytes
def hex_to_bytes(hex_string):
    return bytes.fromhex(hex_string)

# Testando as funções hexadecimais
hex_string = "68656c6c6f20776f726c6420616e64207374756666"
byte_length = len(hex_string) // 2

bytes_result = hex_to_bytes(hex_string)
hex_result = bytes_to_hex(bytes_result)

print(f"String hexadecimal original: {hex_string}")
print(f"Bytes convertidos: {bytes_result}")
print(f"String hexadecimal convertida: {hex_result}")
