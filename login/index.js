window.$ = window.jQuery = require('jquery');
const ipc = require('electron').ipcRenderer

$(document).ready(function () {
    const loginBtn = document.getElementById('sync-login')
    loginBtn.addEventListener('click', function () {
        ipc.sendSync('changePage', { page: "loggedin", token: document.getElementById('pwd').value })
    })
});