const crypto = require('crypto');
const express = require("express")
const MerkleTree = require("merkletreejs")
const mongo = require('mongodb');
const fs = require('fs');

//#DEFINE - port for database
    //Port for mongoDB is 27017
//#END-DEFINE 


const {
    COIN, 
    sha256,
    checkIfSumLess,
    generateTarget,
    hexify
} = require("./crypto.js");

const { Resolver } = require('dns');



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

                //assign base values:

                res.insertOne({
                    chainHeight : -1,
                    knownAddressData : [],
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
            this.blocks.insertOne(block).then(async result=>{
                let currentHeight = await this.data.findOne({})
                currentHeight = currentHeight.chainHeight
                await this.data.updateOne({}, {$set: {blockHeight : currentHeight+1}})
                resolve(true)
            })
        })
    }


    async readBlock(blockHeight){
        return new Promise(resolve =>{
            this.data.findOne({}).then(result=>{
                console.log(result)
                if (result.chainHeight <= blockHeight  && result.chainHeight != -1){
                    this.blocks.findOne({height : blockHeight}).then(async result =>{
                        resolve(result)
                    })
                }
                else{
                    resolve(-1)
                }
            })
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
                knownAddressData : [],
                createdDate: Date.now()
            })

            resolve(true)
        })
    }

    async changeNonce(transaction){
        return new Promise(async resolve=>{
            //check to see if address is listed
            let knownAddress = (await this.data.findOne({})).knownAddressData.find(x => x.address == transaction.sender)
            if (addresses == undefined){
                let address = {
                    address : transaction.sender,
                    //adds value of transaction as starting balance
                    balance : transaction.outputs.reduce((sum, output) => sum + output.amount, 0),
                    nonce : transaction.nonce
                }
                await this.data.updateOne({}, {$push : {knownAddressData : address}})
            }
            else{
                let addressList = (await this.data.findOne({})).knownAddressData
                let index  = addressList.indexOf(knownAddress)
                knownAddress.nonce = transaction.nonce
                knownAddress.balance -= transaction.outputs.reduce((sum, output) => sum + output.amount, 0)
                addressList[index] = knownAddress
                await this.data.updateOne({}, {$set : {knownAddressData : addressList}})
            }
        })
    }
}

module.exports = {BlockChain}