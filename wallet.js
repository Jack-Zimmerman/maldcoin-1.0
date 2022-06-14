const crypto = require('crypto');
const express = require("express")
const MerkleTree = require("merkletreejs")
const elliptic = require("elliptic")
const fileStream = require('fs');



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
const { Signature } = require('starkbank-ecdsa');

class Wallet{
    constructor(name){
        this.name = name;
    }
    
    checkIfExists(){
        if (fileStream.existsSync(`wallets/${this.name}.dat`)){
            return true
        }
        else{
            return false
        }
    }

    //getOldWallet if exists
    grab(){
        if(this.checkIfExists()){
            const wallet = JSON.parse(fileStream.readFileSync(`wallets/${this.name}.dat`))
            this.created = wallet.created
            this.private = wallet.private
            this.public = wallet.public
            this.nonce = wallet.nonce
        }
    }

    createNewWallet(){
        this.created = Date.now()
        this.nonce = 0;
        //create Private and Public key
        let curve = new elliptic.ec("secp256k1");
        let tempPair = curve.genKeyPair()
        this.private = tempPair.getPrivate("hex")
        this.public = tempPair.getPublic().encodeCompressed("hex")

        //writing to file
        if(fileStream.existsSync(`wallets/${this.name}.dat`)){
            return false;
        }
        else{
            fileStream.openSync(`wallets/${this.name}.dat`, 'w')
            fileStream.writeFileSync(`wallets/${this.name}.dat`, JSON.stringify(this))
        }
    }

    signTransaction(transaction){
       let hash = sha256(JSON.stringify(transaction.outputs) + transaction.timestamp + transaction.nonce + transaction.sender)
       this.nonce++;
       transaction.signature = (new elliptic.ec("secp256k1")).sign(hash, this.private, "hex")
       return transaction.signature
    }

    
}

module.exports = {Wallet}