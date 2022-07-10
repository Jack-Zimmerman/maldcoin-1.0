import React from 'react'
import {AiOutlineArrowRight} from 'react-icons/ai'


class TransactionListObject extends React.Component{
    expandTransaction(){

    }

    render(){
        return(
            <>
                <p className="font-mono font-semibold mx-2">{this.props.transaction.amount + " from " + this.props.transaction.sender}<AiOutlineArrowRight className='inline'></AiOutlineArrowRight>{this.props.transaction.reciever}</p>
                <hr className="border-y-2 border-black"></hr>
            </>
        )
    }
}

export class TransactionList extends React.Component{
    testTransactions = [
        {
            sender : "You",
            amount : 100,
            reciever : "Calvin"
        },
        {
            sender : "Calvin",
            amount : 99.99,
            reciever : "You"
        }
    ]
    constructor(){
        super()
        this.state = {
            transactionList : [],
            transactionObjectList : this.generateTransactionComponent(["loading element"])
        }
    }

    generateTransactionComponent(transac){
        return (
            <TransactionListObject transaction={transac}></TransactionListObject>
        )
    }
    

    //where http request will be made for transaction objects
    componentDidMount(){
        this.setState(
            {
                transactionList: this.testTransactions,
                transactionObjectList : this.testTransactions.map(this.generateTransactionComponent)
            }
        )
    }


    render(){
        return (
            <div className='absolute bottom-6 w-10/12 h-1/2 left-16 border-black border-4 rounded-xl bg-gray-500'>
                <h1 className="font-mono font-bold m-1 text-4xl">Transactions:</h1>
                <div className="relative h-5/6  border-black border-4 rounded-md bg-white">
                    {this.state.transactionObjectList}
                </div>
            </div>
        )
    }


}

