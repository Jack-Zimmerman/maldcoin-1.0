const {
    app, 
    BrowserWindow,
    Menu,
    MenuItem
} = require('electron')

const path = require('path')

try{
    require('@electron/remote/main').initialize()
}
catch(e){}


//create window with options
function createWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webpreferences: {
            nodeIntegration: true,
            enableRemoteModule : true
        },
        autoHideMenuBar: true,
        icon : path.join(__dirname, 'favicon.ico')
    })

    //pin to port 3000
    window.loadURL('http://localhost:3000');

    //remove menu
    window.setMenu(null)


    return window
}


//handle macOS quits
app.on('window-all-closed', function(){
    if (process.platform !== 'darwin'){
        app.quit()
    }
})

//create electron window
app.on('ready', createWindow)

//create electron window
app.on('activate', function(){
    if(BrowserWindow.getAllWindows().length === 0){
        createWindow()
    }
})



