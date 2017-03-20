const electron = require('electron')
// Module to control application life.
const electonCore = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
var loginToken;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electonCore.on('ready', createWindow)

// Quit when all windows are closed.
electonCore.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    electonCore.quit()
  }
})

electonCore.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

const ipc = require('electron').ipcMain

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
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
    event.returnValue = 'pong'
  } else {
    event.returnValue = 'error: ' + arg
  }
})