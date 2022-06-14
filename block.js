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
            this.difficulty = 10000
        }
        else{
            this.previousProof = previousBlock.proof;
            this.height = previousBlock.height+1;
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
        this.transactions.push(transactions)
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

    //complete block and mine for it:
    complete(){
        this.merkleRoot = (new MerkleTree.MerkleTree((this.transactions.map(x=>sha256(x))), sha256)).getRoot().toString('hex')
        this.timeStamp = Date.now()
        this.header = sha256(JSON.stringify(this))
    }

    manualMine(){
        [this.nonce, this.proof] = mineBlock(this)
    }
}

const mineBlock = (block) =>{
    for (let i = 0; i < Infinity; i++){
        if(checkIfSumLess(i.toString(16), block.header, generateTarget(block.difficulty)))
        {
            return [i,sha256((BigInt(i) + BigInt(hexify(block.header))).toString(16))]
        }
    }

    return block
}


let wallet = new Wallet("test")
console.log("create wallet: " + wallet.createNewWallet())
wallet.grab()
let transac = new Transaction(wallet.public, wallet.nonce)
transac.addOutput("eruehguehguehge", 10)
console.log(JSON.stringify(transac))
console.log(wallet.signTransaction(transac))

