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
    Block
} = require('./block.js')

async function test(){
    const chain = new BlockChain()
    await chain.wipeBlocks()
    await chain.wipeData()
    for (let i = 0; i < 10000; i++){
        let tempBlock = new Block(await chain.readBlock(i-1));
        tempBlock.complete()
        tempBlock.manualMine()
        await chain.addBlock(tempBlock)
    }

    let start = Date.now()
    for (let a = 0; a < 10000; a++){
        await chain.readBlock(a)
    }
    console.log((Date.now()-start)/1000000)


}

test()