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

const{
    Block,
    mineBlock
} = require('./block.js')



async function main(){
    let chain = new BlockChain()
    await chain.wipeBlocks()
    await chain.wipeData()

    let minerWallet = new Wallet("test")
    minerWallet.grab()
    
    for (let i = 0; i < 10; i++){
        let a = new Block(await chain.getBlock(i-1))
        a.complete(minerWallet)
        a.manualMine()
        await chain.addBlock(a)
    } 

    console.log("\tCOMPLETED")
}

main()






//What I did on june 30:
    //fixed block difficulty error (it was hex to decimal conversion error)
    //made sure that the code on the block verification was correct
    
    //fixed block header hashing

    //now when interpreting blocks the account data will be stored in the data collection in the mongo
        //made exception for coinbase transactions
        //coinbase : "0".repeat(64) is now defined in crypto.js as the const COINBASE
