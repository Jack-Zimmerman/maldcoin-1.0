const {app, BrowserWindow} = require('electron') 

function createWindow(){
    //create electron window:
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {}
    });

    window.loadURL("http://localhost:3000");
}

app.on('ready', createWindow);