import React, {Component} from 'react'
import {NavBar} from './components/NavBar'
import {transactionsPage} from "./content/Transactions"

class App extends Component {
  navData = [
    {
      title: "Wallet & Transactions",
      data: transactionsPage,
      onClick : function(manip){
        manip(transactionsPage)
      }
    },
    {
      title: "Quit",
      data: <h1>test</h1>,
      //provide reference to this.page in App.js
      onClick: function(manip){
        //will quit the application onclose
        window.close()
      }
    }
    ,
    {
      title: "test",
      data: <h1>test</h1>,
      onClick: function(manip){
        manip(<h1>test</h1>)
      }
    }
  ]

  
  constructor(props){
    super(props)
    this.state = {pageHtml : this.navData[0].data}
  }

  //html manipulator
  changePageHtml = (page) => {
    this.setState({pageHtml: page})
  }

  render(){
    return (
      <>
      <body className='w-screen h-screen bg-gray-700'>
        <NavBar elements={this.navData} pageManipator={this.changePageHtml}></NavBar>
        {this.state.pageHtml}
      </body>
      </>
    )
  }
}

//config data that can be simplified away from the main node server
export const config = {
  address : "0329ce342b019890a4810e1b2b6106b34499564fec0a7eb66dd397a4231aab3400"
}



export default App;



//localhost server request protocol:
  //localhost:8080/balance
    //returns account balance
  //localhost:8080/tranasctions
    //returns list of all past transactions