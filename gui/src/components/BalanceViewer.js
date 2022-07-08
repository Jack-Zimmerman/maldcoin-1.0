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
            <div className="relative w-1/2 bg-gray-700">
                <h2 className='bg-grey-700 text-white text-center'>
                    {
                        //balance to 8 decimal places(accuracy of COIN)
                        this.state.balance.toFixed(8)
                    }
                </h2>
            </div>
        )
    }
}