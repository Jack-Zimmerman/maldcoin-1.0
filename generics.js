const crypto = require("crypto")
const COIN = 100000000

const sha256 = (string) => {
    let hash = crypto.createHash('sha256');
    return hash.update(string).digest('hex')
}

//adds required header for BigInt constructor to recognize
const hexify = (hexString) =>{
    return "0x" + hexString
}

//takes hex1, hex2, target
//converts hex into BigInts and then calculates
const checkIfSumLess =(h1, h2, target)=>{
    return BigInt(hexify(sha256((BigInt(hexify(h1)) + BigInt(hexify(h2))).toLocaleString()))) <= BigInt(hexify(target))
}

//returns BigInt converted to hex string
const generateTarget = (difficulty)=>{
    return ((BigInt(2) ** BigInt(256)) / BigInt(hexify(difficulty))).toString(16)
}

module.exports = {COIN, sha256, checkIfSumLess,generateTarget, hexify}

