exports.commands = ["amsg"];

exports.input = function(network, chan, cmd, args) {
        if (args.length === 0 || args[0] === "") {
                return true;
        }

        var irc = network.irc;
        var msg = args.join(" ");

        network.channels.forEach(function(chan) {
                if (chan.type !== "channel") {
                        return;
                }

                irc.say(chan.name, msg);

                if (!irc.network.cap.isEnabled("echo-message")) {
                        irc.emit("privmsg", {
                                nick: irc.user.nick,
                                target: chan.name,
                                message: msg
                        });
                }
        });

        return true;
};
