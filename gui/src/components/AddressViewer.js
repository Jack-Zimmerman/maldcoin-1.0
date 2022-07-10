import React from 'react'
import {config} from '../App'
const electron = window.require('electron')

export class AddressViewer extends React.Component{
    copyAddressToClipboard(){
        electron.clipboard.writeText(config.address)
        alert("Copied Address to clipboard")
    }

    render(){
        return(
            <div className="relative inline w-fit bg-gray-500 py-2 px-4 rounded-xl border-2 border-black mx-10 top-6">
                <h3 className="inline text-mono text-bold">Address:</h3>
                <p className='relative inline text-mono left-3 bg-white w-fit px-2 hover:bg-blue-300 active:bg-blue-500 select-none' onClick={this.copyAddressToClipboard}>{"0x" + config.address}</p>
            </div>
        )
    }
}