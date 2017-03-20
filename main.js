const electron = require('electron')
const electonCore = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = require('electron').ipcMain
const path = require('path')
const url = require('url')

var loginToken;
let mainWindow

function createWindow() {

  mainWindow = new BrowserWindow({ width: 800, height: 600, frame: false })
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'login/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () { mainWindow = null })
}

electonCore.on('ready', createWindow)

electonCore.on('window-all-closed', function () {
  if (process.platform !== 'darwin') { electonCore.quit() }
})

electonCore.on('activate', function () {
  if (mainWindow === null) { createWindow() }
})

ipc.on('pageEvent', function (event, arg) {
  if (arg == "close") {
    mainWindow.close();
  } else if (arg == "minmax") {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    };
  } else if (arg == "minamise") {
    mainWindow.minimize()
  } else {
    console.error("Unknown pageEvent: " + arg)
  };
  event.returnValue = arg;
});

ipc.on('synchronous-message', function (event, arg) {
  event.returnValue = 'pong'
})

ipc.on('getToken', function (event, arg) {
  event.returnValue = loginToken
})

ipc.on('changePage', function (event, arg) {
  
  if (arg["page"] == "loggedin") {
    loginToken = arg["token"]
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'discord/loggedin.html'),
      protocol: 'file:',
      slashes: true
    }))
    event.returnValue = 'pong'

  } else if (arg["page"] == "loggedout") {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'login/index.html'),
      protocol: 'file:',
      slashes: true
    }))
    event.returnValue = 'pong'

  } else {
    event.returnValue = 'error: ' + arg
  };
})