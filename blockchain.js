const crypto = require('crypto');
const express = require("express")
const MerkleTree = require("merkletreejs")
const mongo = require('mongodb');
const fileStream = require('fs');

//#DEFINE - port for database
    //Port for mongoDB is 27017
//#END-DEFINE 


const {
    COIN, 
    sha256,
    checkIfSumLess,
    generateTarget,
    hexify,
    generateTarget
} = require("./crypto.js");

const{
    Transaction
} = require("./transaction.js")

const{
    Wallet
} = require('./wallet.js')

const{
    Block
} = require("./block.js")




//#DEFINE - names
    //BlockChain.blocks is for storing blocks within a collection
    //BlockChain.data is for storing information about the blockchain and the balance of users
//#END-DEFINE



class BlockChain{
    constructor(){
        this.MongoClient = mongo.MongoClient;
        this.name = "blockchain"
        this.url = `mongodb://localhost:27017/${this.name}`;
        this.client = new this.MongoClient(this.url)

        console.log(`Starting DB at ${this.url}`)

        this.client.connect(function(err) {
            if (err){
                throw err;
            }

            console.log(`Connected to database`);
        });

        //create block list
        this.db = this.client.db("blockchain")
        
        //create block list and data
        
        if (this.db.collection("blocks") == undefined){
            this.db.createCollection("blocks", function(err,res){
                if(err){
                    throw err;
                }
            })
        }

        if (this.db.collection("data") == undefined){
            this.db.createCollection("data", function(err, res){
                if (err){
                    throw err;
                }

                //assign base values for data segment:
                res.insertOne({
                    chainHeight : -1,
                    use : "data",
                    createdDate: Date.now()
                })
            })
        }


        this.data = this.db.collection("data")
        this.blocks = this.db.collection("blocks")
    }

    async addBlock(block){
        //REMEMBER TO ADD INCREMENT TO USER NONCE FOR EACH TRANSACTION
        return new Promise(resolve =>{
            delete block.previousBlock
            this.blocks.insertOne(block).then(async result=>{
                let currentHeight = await this.getCurrentHeight()
                await this.data.updateOne({use : "data"}, {$set: {chainHeight : currentHeight+1}})
                resolve(true)
            })
        })
    }


    async getBlock(blockHeight){
        return new Promise(resolve =>{
            this.data.findOne({use : "data"}).then(result=>{
                if (result.chainHeight <= blockHeight  && result.chainHeight != -1){
                    this.blocks.findOne({height : blockHeight}).then(async result =>{
                        resolve(result)
                    })
                }
                else{
                    resolve(undefined)
                }
            })
        })  
    }

    async verifyAndInterpretTransaction(transaction){
        return new Promise(async resolve =>{
            if (Object.keys(transaction) != Object.keys(new Transaction("test", 1))){
                resolve(false)
            }
            else{
                //START INTERPRET SENDER
                const addressData = await this.data.findOne({address : transaction.sender})

                //if address is unknown then reject transaction
                //if node is up to date all accounts would have been registered
                if (addressData == undefined){
                    resolve(false)
                }
                else if (addressData.nonce >= transaction.nonce){ //check to see that sender used higher nonce than before
                    resolve(false)
                }
                else if (addressData.balance < this.getTransactionAmount(transaction) && this.getTransactionAmount(transaction) != 0){ //generate sum of all outputs and check for total amount
                    resolve(false)
                }
                else if (transaction.outputs.map(x => x.sender).indexOf(transaction.sender) != -1){ //check to see if any transactions were made to self
                    resolve(false)
                }
                else if (transactions.outputs.map(x => Math.abs(x)) != transaction.outputs){//check to see if negative transactions were attempted
                    resolve(false)
                }
                else{
                    //change nonce and remove coins from sending account:
                    await this.data.updateOne({address : transaction.sender}, 
                        {$set : {
                            balance : addressData.balnce - this.getTransactionAmount(transaction),
                            nonce : transaction.nonce
                        }}
                    )

                    //if transaction is valid 
                    for (const output of transaction.outputs){
                        let reciever = await this.data.findOne({address : output.reciever})
                        if (reciever == undefined){
                            //add address to balance list if not included
                            this.data.insertOne({
                                address : output.reciever,
                                balance : output.amount,
                                nonce : 0
                            })
                        }
                        else{
                            //add incoming coins to address
                            await this.data.updateOne({address : output.reciever}, 
                                {$set : {balance : reciever.balance + output.amount}}
                            )
                        }
                    }

                    //add fee to end of transaction
                    transaction.fee = this.calculateTransactionFee(transaction)

                    //return finalized transaction
                    resolve(transaction)
                }
            }
        })   
    }

    //verifies block:
        //coinbase transaction
        //transactions are correct
    
    async verifyBlock(block){
        return new Promise(async resolve =>{
            const coinbase = "0".repeat(64);
            const correctReward = Block.calculateReward(block.height);
            const compiledProof = sha256(hexify(BigInt(block.nonce) + BigInt(hexify(block.header))));

            //check to see if POW is correct for block:
            if (compiledProof != block.proof){//nonce + header is truthfull
                resolve(false)
            }
            else if (BigInt(hexify(compiledProof)) > BigInt(hexify(generateTarget(block.difficulty)))){//check to see if proof demonstrates sufficient difficulty
                resolve(false)
            }

            //work in progress 

            for (var transaction of block.transactions){
                if (transac.sender == coinbase){

                }
                else{
                    this.verifyAndInterpretTransaction(transaction)
                }
            }
        })
    }

    //get sum of all outputs in a transaction
    static getTransactionAmount(transaction){
        return transaction.outputs.reduce((sum, x) => sum + x.amount, 0) + this.calculateTransactionFee(transaction)
    }

    static calculateTransactionFee(transaction){
        //baseFee is 100000ths of a coin
        const baseFee = 1000

        //square amount of outputs in order to discourage overuse of multiple outputs
        var outputFee = Math.pow(transaction.outputs.length, 2) * 100

        //examples:
        //1 output -> 100
        //5 outputs -> 2500
        //10 outputs -> 10000
        return baseFee + outputFee
    }


    async grabMainData(){
        return new Promise(async resolve=>{
            resolve(
                await this.data.findOne({use : "data"})
            )
        })
    }


    async getCurrentHeight(){
        return new Promise(async resolve=>{
            resolve(
                (await this.grabMainData()).chainHeight
            )
        })
    }


    async wipeBlocks(){
        return new Promise(resolve =>{
            this.blocks.deleteMany({}).then(res =>{
                resolve(true)
            })
        })
    }

    async wipeData(){
        return new Promise(async resolve=>{
            await this.data.deleteMany({})
            await this.data.insertOne({
                chainHeight : -1,
                use : "data",
                createdDate: Date.now()
            })

            resolve(true)
        })
    }

    

    async chainToJson(destinationFile){
        await this.blocks.find({}).toArray().then(result => {
           let file = fileStream.openSync(destinationFile, 'w');
           fileStream.writeSync(file, JSON.stringify(result, null, 4))
        })
    }

    async dataToJson(destinationFile){
        await this.data.find({}).toArray().then(result => {
            let file = fileStream.openSync(destinationFile, 'w');
            fileStream.writeSync(file, JSON.stringify(result, null, 4))
         })
    }

    //creates folder if does not exist and places ordered mongodb data
    async writeMongoContent(destinationFolder){
        if (!fileStream.existsSync(destinationFolder)){
            fileStream.mkdirSync(destinationFolder)
        }
        console.log("Writing to files...")
        await this.chainToJson(`${destinationFolder}/blockchain`)
        await this.dataToJson(`${destinationFolder}/data`)

        console.log("data has been written to -> " + destinationFolder)
    }
}

module.exports = {BlockChain}