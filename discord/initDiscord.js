Discord = require("discord.js");
const ipc = require('electron').ipcRenderer

module.exports = {
    initDiscord: function (loginToken) {
        return new Promise(function (fulfill, reject) {
            global.DiscordClient = new Discord.Client({ revive: true });
            DiscordClient.login(loginToken)
                .then(() => {
                    console.log("Logged in 👌")
                })
                .catch((err) => {
                    console.log("Unable to login: " + err)
                    reject("Unable to login: " + err)
                });

            DiscordClient.on("channelCreate", (channel) => { refreshNavbar(DiscordClient, "channelCreate") });
            DiscordClient.on("channelDelete", (channel) => { refreshNavbar(DiscordClient, "channelDelete") });
            //  DiscordClient.on("channelPinsUpdate", (channel, time) => {});
            //  DiscordClient.on("channelUpdate", (oldChannel, newChannel) => {});
            DiscordClient.on("debug", (info) => { console.warn("Warn: " + info) });
            DiscordClient.on("disconnect", (event) => { console.log("Disconnected from discord!") });
            //  DiscordClient.on("emojiCreate", (emoji) => {});
            //  DiscordClient.on("emojiDelete", (emoji) => {});
            //  DiscordClient.on("emojiUpdate", (oldEmoji, newEmoji) => {});
            DiscordClient.on("error", (error) => { console.error(error) });
            //  DiscordClient.on("guildBanAdd", (guild, user) => {});
            //  DiscordClient.on("guildBanRemove", (guild, user) => {});
            DiscordClient.on("guildCreate", (guild) => { refreshNavbar(DiscordClient, "guildCreate") });
            DiscordClient.on("guildDelete", (guild) => { refreshNavbar(DiscordClient, "guildDelete") });
            DiscordClient.on("guildMemberAdd", (member) => { refreshNavbar(DiscordClient, "guildMemberAdd") });
            //  DiscordClient.on("guildMemberAvailable", (GuildMember) => {});
            DiscordClient.on("guildMemberRemove", (GuildMember) => { refreshNavbar(DiscordClient, "guildMemberRemove") });
            //  DiscordClient.on("guildMembersChunk", (members) => {});
            //  DiscordClient.on("guildMemberSpeaking", (member, speaking) => {});
            //  DiscordClient.on("guildMemberUpdate", (oldMember, newMember) => {});
            // DiscordClient.on("guildUnavailable", (guild) => { discordFunction["handleEvents"].run("guildUnavailable", sinonBase, sinonData, guild) });
            //  DiscordClient.on("guildUpdate", (oldGuild, newGuild) => {});
            DiscordClient.on("message", (message) => {
                //console.log(message)
                printMessage(message);
            });
            //  DiscordClient.on("messageDeleteBulk", (messages) => {});
            //  DiscordClient.on("messageReactionAdd", (messageReaction, user) => {});
            //  DiscordClient.on("messageReactionRemove", (messageReaction, user) => {});
            //  DiscordClient.on("messageReactionRemoveAll", (messageReaction) => {});
            // DiscordClient.on("messageUpdate", (oldMessage, newMessage) => { discordFunction["handleEvents"].run("messageUpdate", sinonBase, sinonData, oldMessage, newMessage) });
            //  DiscordClient.on("presenceUpdate", (oldMember, newMember) => {});
            DiscordClient.on("ready", () => { fulfill(DiscordClient); console.log("Logged in and ready for work.") });
            DiscordClient.on("reconnecting", () => { console.log("reconnecting to discord") });
            //  DiscordClient.on("roleCreate", (role) => {});
            //  DiscordClient.on("roleDelete", (role) => {});
            //  DiscordClient.on("roleUpdate", (oldRole, newRole) => {});
            //  DiscordClient.on("typingStart", (channel, user) => {});
            //  DiscordClient.on("typingStop", (channel, user) => {});
            //  DiscordClient.on("userNoteUpdate", (user, oldNote, oldNote) => {});
            //  DiscordClient.on("userUpdate", (oldUser, newUser) => {});
            //  DiscordClient.on("voiceStateUpdate", (oldMember, newMember) => {});
            DiscordClient.on("warn", (info) => { console.warn(info) });

        });
    }
}