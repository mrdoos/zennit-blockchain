class FpRepr:
    def as_mut(self):
        return self.bytes

    def from_bytes(self, bytes):
        self.bytes = bytes


class Fp:
    class Repr(FpRepr):
        pass


class G1:
    class Repr:
        def as_mut(self):
            return self.bytes

        def from_bytes(self, bytes):
            self.bytes = bytes


def read_scalar(reader):
    bytes = reader.read(32)
    fr_repr = FpRepr()
    fr_repr.from_bytes(bytes)

    return Fp(Fp.Repr(fr_repr))


def read_point(reader):
    bytes = reader.read(32)
    point_repr = G1.Repr()
    point_repr.from_bytes(bytes)

    return G1(G1.Repr(point_repr))


def bytes_to_hex(bytes):
    hex_chars = '0123456789abcdef'
    hex_string = ''
    for b in bytes:
        hex_string += hex_chars[(b >> 4) & 0x0F] + hex_chars[b & 0x0F]
    return hex_string


def hex_to_bytes(hex_string, size):
    if len(hex_string) != size * 2:
        raise ValueError('Invalid hex size')

    bytes = [0] * size
    for i in range(size):
        bytes[i] = (int(hex_string[i * 2], 16) << 4) | int(hex_string[i * 2 + 1], 16)
    return bytes


# Test the functions
hex_string = '0123456789abcdef0123456789abcdef'
reader = hex_string
scalar = read_scalar(reader)
print("Scalar:", scalar)

point_reader = hex_string
point = read_point(point_reader)
print("Point:", point)

bytes = [1, 2, 3, 4, 5, 6]
hex_string = bytes_to_hex(bytes)
print("Bytes to Hex:", hex_string)

hex_string = '0102030405'
bytes = hex_to_bytes(hex_string, 6)
print("Hex to Bytes:", bytes)
