import React, {Component} from 'react'
import {NavBar} from './components/NavBar'

class App extends Component {

  //page that the application currently is on

  navData = [
    {
      title: "Wallet",
      data: <h1>test</h1>,
      //provide reference to this.page in App.js
      onClick: function(manip){
        manip(<h1>test</h1>)
      }
    }
  ]
  
  constructor(props){
    super(props)
    this.state = {pageHtml : <h1>placeholder</h1>}
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
