const ipc = require('electron').ipcRenderer;
var path = require('path');
var url = require('url');
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
        $('#inboundMessages').append(`</br><li class="messages"><legend>` + displayName + ' - ' + message.author.id + `</legend></li>`);
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
    startDiscord.initDiscord().then(DiscordClient => {
        var channels;
        document.getElementById("navbar-brand").innerHTML = DiscordClient.user.username;
        refreshNavbar(DiscordClient, "Ready");

        $('#guildList').append(
            '<div class="panel-group" id="accordion">'
        );

        var guildCount = 0;
        for (var guild of DiscordClient.guilds) {
            guildCount++
            var theFn = 'onClick="displayGuild(' + guild[1].id + ')"';
            var iconURL
            channels = '';

            guild[1].channels.forEach((element, index, array) => {
                if (element.type == "text") {
                    channels = channels + '<li><a href="#">' + element.name + '</a></li>';
                };
            });

            if (guild[1].iconURL) {
                iconURL = guild[1].iconURL;
            } else {
                iconURL = "noAvatar.jpg";
            };

            $('#guildList').append(
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a data-toggle="collapse" data-parent="#accordion" href="#collapse'+guildCount+'">' +

                '<img class="icons" src="'+iconURL+'">'+
                '<div style="vertical-align:middle; display:inline;">'+
                ''+guild[1]+'</a>' +
                
                '</h4>' +
                '</div>' +
                '<div id="collapse'+guildCount+'" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                channels +
                '</div>' +
                '</div>' +
                '</div>'
            );

            /*
            
                        $('#guildList').append(
                            '<div class="dropdown">' +
                            '<img id="guildIcon" class="icons" src="' + guild[1].iconURL + '">' +
                            '<button class="dropdown-toggle guildList" data-toggle="dropdown">' + guild[1] +
                            '<span class="caret"></span></button>' +
                            '<ul class="dropdown-menu">' +
                            channels +
                            '</ul>' +
                            '</div>'
                        );
            */
        };
        $('#guildList').append(
            '</div>'
        );

    }).catch(console.error)
});