const ipc = require('electron').ipcRenderer;
var path = require('path');
var url = require('url');
var loginToken = require("./../authFile.json");
var startDiscord = require('./initDiscord.js');
var botToken = "";
var marked = require('marked');
marked.setOptions({ renderer: new marked.Renderer(), gfm: true, tables: false, breaks: false, pedantic: false, sanitize: true, smartLists: false, smartypants: false });
var sinonData = {};
sinonData = {};

function printMessage(message) {

    if (!sinonData["ID" + message.guild.id]) {
        sinonData["ID" + message.guild.id] = {};
    };

    if (!sinonData["ID" + message.guild.id]["ID" + message.channel.id]) {
        sinonData["ID" + message.guild.id]["ID" + message.channel.id] = {};
        sinonData["ID" + message.guild.id]["ID" + message.channel.id]["lastMessageAuthor"] = "";
        sinonData["ID" + message.guild.id]["ID" + message.channel.id]["messages"] = [];
    };

    sinonData["ID" + message.guild.id]["ID" + message.channel.id]["messages"].push(message);

    if (sinonData["ID" + message.guild.id]["ID" + message.channel.id]["lastMessageAuthor"] != message.author.id) {
        var displayName = "";
        if (message.member) {
            displayName = message.member.displayName;
        } else {
            displayName = message.author.username;
        };
        $('#inboundMessages').append(`<li class="messages"><legend>` + displayName + ' - ' + message.author.id + `</legend></li>`);
    };

    sinonData["ID" + message.guild.id]["ID" + message.channel.id]["lastMessageAuthor"] = message.author.id;
    if (message.attachments.first()) {
        console.log(message.attachments.first().url);
        $('#inboundMessages').append($(`<li class="messages" ></li>`).text("Guild: " + message.guild.name + " Author: " + displayName + " Message: " + marked(message.content)));
        $('#inboundMessages').append('<li class="messages image"><img src="' + message.attachments.first().url + '"></li>');
    } else {
        $('#inboundMessages').append(`<li class="messages" >` + marked(message.content) + `</li>`);
    };

    document.getElementById('inboundMessages').scrollIntoView(false);
};

function logout() {
    ipc.sendSync('changePage', { page: "loggedout" });
};

function displayGuild(guildID) {
    console.log("Displaying info for " + guildID);
    console.log(JSON.stringify(sinonData["ID" + guildID], null, 4));
};

function refreshNavbar(DiscordClient, event) {
    console.log("Update event from:" + event);
    document.getElementById("navbar-channels").innerHTML = "Channels: " + DiscordClient.channels.size;
    document.getElementById("navbar-guilds").innerHTML = "Guilds: " + DiscordClient.guilds.size;
    document.getElementById("navbar-users").innerHTML = "Users: " + DiscordClient.users.size;
};


$(window).on("load", function () {

    document.getElementById('minamise').addEventListener('click', function () {
        ipc.sendSync('pageEvent', "minamise");
    });

    document.getElementById('minmax').addEventListener('click', function () {
        ipc.sendSync('pageEvent', "minmax");
    });

    document.getElementById('close').addEventListener('click', function () {
        ipc.sendSync('pageEvent', "close");
    });

    console.log("window loaded");
    if (loginToken.discordToken == "") {
        console.log("sending request for token");
        botToken = ipc.sendSync('getToken', null);
    } else {
        botToken = loginToken.discordToken;
    };

    startDiscord.initDiscord(botToken).then(DiscordClient => {
        var channels;
        $('#inboundMessages').append("<li>Logged in 👌</li>");
        document.getElementById("navbar-brand").innerHTML = DiscordClient.user.username;
        refreshNavbar(DiscordClient, "Ready");
        for (var guild of DiscordClient.guilds) {

            var theFn = 'onClick="displayGuild(' + guild[1].id + ')"';
            channels = '';

            guild[1].channels.forEach((element, index, array) => {
                if (element.type == "text") {
                    channels = channels + '<li><a href="#">' + element.name + '</a></li>';
                };
            });

            $('#guildList').append(
                '<div class="dropdown">' +
                '<button class="dropdown-toggle guildList" data-toggle="dropdown"><img class="icons" src="' + guild[1].iconURL + '">' + guild[1] +
                '<span class="caret"></span></button>' +
                '<ul class="dropdown-menu">' +
                channels +
                '</ul>' +
                '</div>'
            );
        };

    }).catch(console.error)
});