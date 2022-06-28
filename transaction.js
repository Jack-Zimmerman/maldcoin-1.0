const crypto = require('crypto');
const express = require("express")
const MerkleTree = require("merkletreejs")
const elliptic = require("elliptic")

const {
    COIN, 
    sha256,
    checkIfSumLess,
    generateTarget,
    hexify
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
        this.nonce = nonce
        this.timeStamp = Date.now()
    }

    //give in coin value--NO DECIMAL    
    addOutput(recieverAddress, amountToGive){
        this.outputs.push({reciever: recieverAddress, amount: amountToGive})
    }


    //verify external transaction given the object or hashmap
    static verifyTransaction(transaction){
        let hashMessage = sha256(JSON.stringify(transaction.outputs) + transaction.timestamp + transaction.nonce + transaction.sender)
        let key = (new elliptic.ec('secp256k1')).keyFromPublic(transaction.sender, 'hex')
        return key.verify(hashMessage, transaction.signature)
    }
    

    static createCoinBaseTransaction(address, amount){
        let coinbase = "0".repeat(64)
        let transac = new Transaction(coinbase, 0)
        transac.addOutput(address, amount)
        return transac
    }
}

module.exports = {Transaction}