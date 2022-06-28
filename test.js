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

    for (let i = 0; i < 100; i++){
        let a = new Block(await chain.getBlock(i-1))
        a.complete(minerWallet)
        a.manualMine()
        await chain.addBlock(a)
        console.log(i)
    } 

    var sumNonces = 0;
    for (let k = 0; k < 99; k++){
        console.log(k)
        let block = await chain.getBlock(k)
        sumNonces += block.nonce
    }
    
    console.log(sumNonces / 100);
}

main()




