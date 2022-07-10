import React from 'react'

export class BalanceViewer extends React.Component{
    constructor(){
        super()
        this.state = {balance: 0.0000000};
    }

    async grabBalanceLoop(){
        for(;;){
            //every 5 seconds send request for balance from node
            await new Promise(resolve => setTimeout(resolve(), 5000))

            //get balance from localhost server /balance
            const givenBalance = await (await fetch("http://localhost:8080/balance")).json()

            this.setState(
                { 
                    balance: givenBalance
                }
            )
        }
    }

    render(){
        return(
            //outer border 
                //inner border and backdrop 
                    //data
            <div className="relative w-2/3 h-fit p-2 text-xl mx-auto bg-gray-500 rounded-xl border-4 border-black top-10">
                <h1 className='text-mono text-red-800 font-bold'>MALDcoin Balance:</h1>
                <div className="bg-gray-700 font-mono rounded-xl">
                    <h2 className='bg-grey-700 text-5xl text-white text-center'>
                        {
                            //balance to 8 decimal places(accuracy of COIN)
                            this.state.balance.toFixed(8) + " Coins"
                        }
                    </h2>
                </div>
            </div>
        )
    }
}