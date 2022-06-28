const crypto = require('crypto');
const express = require("express")
const MerkleTree = require("merkletreejs")

const {
    COIN, 
    sha256,
    checkIfSumLess,
    generateTarget,
    hexify,
    Hashes,
    addAndHash
} = require("./crypto.js")

const {
    BlockChain
} = require('./blockchain.js');

const{
    Transaction
} = require("./transaction.js")

const{
    Wallet
} = require('./wallet.js')





class Block{
    constructor(previousBlock){ 
        this.previousBlock = previousBlock;
        //check if genesis:
        if (previousBlock === undefined){
            this.previousProof = "0"
            this.height = 0

            //how fast my computer hashes in 2 minutes about
            //block time is 2 minutes;
            this.difficulty = Hashes.KILOHASH * 100
        }
        else{
            this.previousProof = this.previousBlock.proof;
            this.height = this.previousBlock.height+1;
            this.difficulty = this.calculateDifficulty()
        }
        
        //generics to be completed at complete()
        this.header = "0"
        this.proof = "0"
        this.nonce = 0
        this.merkleRoot = "0"
        this.transactions = []
    }

    //add transaction object to transactions list
    addTransaction(transaction){
        this.transactions.push(transaction)
    }

    calculateDifficulty(){
        if(this.height % 144 == 0){
            //retrieve last 144 blocks
            //test to see if difficulty needs to be increased
            //for now:
            return this.previousBlock.difficulty
        }
        else{
            return this.previousBlock.difficulty
        }
    }

    calculateReward(){
        //decreases every 2 years: 525600 blocks every 2 years
        //reward starts at 100 coins

        return 100*COIN*Math.pow(1/2, Math.floor(this.height/525600))
    }

    static calculateReward(height){
        return 100*COIN*Math.pow(1/2, Math.floor(height/525600))
    }

    //complete block and mine for it:
    //miner must pass the wallet object in order to sign the coinbase transaction
    complete(wallet){
        this.miner = wallet.public
        this.merkleRoot = (new MerkleTree.MerkleTree((this.transactions.map(x=>sha256(x))), sha256)).getRoot().toString('hex')
        this.timeStamp = Date.now()
        this.header = sha256(JSON.stringify(this))
        this.addTransaction(wallet.signTransaction(Transaction.createCoinBaseTransaction(this.miner, this.calculateReward())))
    }

    manualMine(){
        [this.nonce, this.proof] = mineBlock(this)
    }
}

const mineBlock = (block) =>{
    var target = generateTarget(block.difficulty)
    for (let i = 0; i < Infinity; i++){
        if(checkIfSumLess(i.toString(16), block.header, target))
        {
            return [i,addAndHash(i.toString(16), block.header)]
        }
    }

    return block
}

module.exports = {Block, mineBlock}

