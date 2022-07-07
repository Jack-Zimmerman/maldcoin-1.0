const crypto = require('crypto');
const express = require("express")
const MerkleTree = require("merkletreejs")
const elliptic = require("elliptic")

const {
    COIN, 
    sha256,
    checkIfSumLess,
    generateTarget,
    hexify,
    COINBASE
} = require("./crypto.js")




class Transaction{
    //requires:
        //sender
        //outputs -> [{reciever, amount}, {reciever, amount}]
            //remains base until output is added in extra functions
    constructor(senderAddress, nonce){
        this.sender = senderAddress
        this.outputs = []
        this.signature = ""

        //hash will be given once transaction is signed by wallet
        this.hash = ""

        this.nonce = nonce
        this.timestamp = Date.now()
    }

    //give in coin value--NO DECIMAL    
    addOutput(recieverAddress, amountToGive){
        this.outputs.push({reciever: recieverAddress, amount: amountToGive})
    }


    //verify external transaction given the object or hashmap
    static verifySignature(transaction){
        let hashMessage = sha256(JSON.stringify(transaction.outputs) + transaction.timestamp + transaction.nonce + transaction.sender)
        let key = (new elliptic.ec('secp256k1')).keyFromPublic(transaction.sender, 'hex')
        return key.verify(hashMessage, transaction.signature)
    }
    

    static createCoinBaseTransaction(address, amount){
        let transac = new Transaction(COINBASE, 0)
        transac.addOutput(address, amount)
        return transac
    }
}

module.exports = {Transaction}