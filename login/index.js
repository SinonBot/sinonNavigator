window.$ = window.jQuery = require('jquery');
const ipc = require('electron').ipcRenderer

$(document).ready(function () {

    document.getElementById('sync-login').addEventListener('click', function () {
        ipc.sendSync('changePage', { page: "loggedin", token: document.getElementById('pwd').value })
    })

    document.getElementById('minamise').addEventListener('click', function () {
        ipc.sendSync('pageEvent', "minamise")
    })

    document.getElementById('minmax').addEventListener('click', function () {
        ipc.sendSync('pageEvent', "minmax")
    })
    
    document.getElementById('close').addEventListener('click', function () {
        ipc.sendSync('pageEvent', "close")
    })
});