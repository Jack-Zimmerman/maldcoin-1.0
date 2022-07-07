import React, {Component} from 'react'



export class NavBarElement extends Component{
    render(){
        return(
            //create new button that when clicked passes page reference to the onClick function to then allow for the change of the page html
            <button onClick={() => this.props.onClick(this.props.pageManipator)}  className="w-1/6 h-1/6 font-mono bg-gray-700 hover:bg-blue-100 hover:text-black text-white ">
                {this.props.title}
            </button>
        )
    }
}

export class NavBar extends Component{
    render(){
        const elements = this.props.elements;

        if(elements === undefined){
            throw new Error("Did not define elements for NavBar")
        }

        const barObjects = elements.map(element => {
            return <NavBarElement title={element.title} onClick={element.onClick} pageManipator={this.props.pageManipator}></NavBarElement>
        })

        return(
            <div className="flex-auto h-1/6 w-screen bg-gray-500">
                {barObjects}
            </div>
        )
    }
}
