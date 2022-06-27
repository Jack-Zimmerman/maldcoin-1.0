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

    for (let i = 0; i < 100; i++){
        
        let a = new Block(await chain.getBlock(i-1))
        await a.complete()
        a.manualMine()
        await chain.addBlock(a)
        console.log(a)
    } 

    await chain.writeMongoContent("database")
}

main()




