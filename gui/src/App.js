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
        <NavBar elements={this.navData} pageManipator={this.changePageHtml}></NavBar>
        {this.state.pageHtml}
      </>
    )
  }
}

export default App;
