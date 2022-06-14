const crypto = require('crypto');
const express = require("express")
const MerkleTree = require("merkletreejs")

const {
    COIN, 
    sha256,
    checkIfSumLess,
    generateTarget,
    hexify
} = require("./generics.js")

const {
    BlockChain
} = require('./blockchain.js');


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
}

module.exports = {Transaction}