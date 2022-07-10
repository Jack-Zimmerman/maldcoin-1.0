import React from 'react'
import {AiOutlineArrowRight} from 'react-icons/ai'


class TransactionListObject extends React.Component{
    expandTransaction(){

    }

    render(){
        return(
            <p>{this.props.transaction.sender + " " + this.props.transaction.amount}<AiOutlineArrowRight className='inline'></AiOutlineArrowRight>{"reciever" + this.props.transaction.reciever}</p>
        )
    }
}

export class TransactionList extends React.Component{
    constructor(){
        super()
        this.state = {
            transactionList : [],
            transactionObjectList : this.generateTransactionComponent(["Loading..."])
        }
    }

    generateTransactionComponent(transac){
        return (
            <TransactionListObject transaction={transac}></TransactionListObject>
        )
    }
    
    componentDidMount(){
        let x = new Promise(resolve => setTimeout(resolve, 5000)) 
        const testTransactions = ["test", "123"]
        const testObjects = testTransactions.map(this.generateTransactionComponent)

        x.then(()=>{
            this.setState(
                {
                    transactionList: ["test", "123"],
                    transactionObjectList : testObjects

                }
            )
        })
    }


    render(){
        return (

            <div className="absolute bottom-5 w-fit h-fit">
                {this.state.transactionObjectList}
            </div>
        )
    }


}

