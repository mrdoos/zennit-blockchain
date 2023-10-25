
var me = module.exports

me.VERSION = require('../package.json').version

var Crypto = {
  sha256: require('sha256'),
  ripemd160: require('ripemd160')
}

me.Address = require('btc-address')
me.Key = require('eckey')
me.ECDSA = require('ecdsa')
me.BigInteger = require('bigi')
me.Crypto = Crypto
me.base58 = require('bs58')
me.convertHex = require('convert-hex')
me.secureRandom = require('secure-random')