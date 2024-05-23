const { delay } = require('@adiwajshing/baileys');

let stopBroadcast = false; // Shared state variable to control broadcasting

const broadcastHandler = async (sock, msg, from, args, msgInfoObj) => {
    const { sendMessageWTyping } = msgInfoObj;

    if (!args[0]) return sendMessageWTyping(from, { text: "❗️ *Please provide a message to broadcast* ❗️" }, { quoted: msg });

    const groups = await sock.groupFetchAllParticipating();
    const groupJids = Object.keys(groups);

    let message = "📢 *Broadcast Message from Owner* 📢\n\n" + args.join(" ");

    stopBroadcast = false; 

    try {
        for (let i = 0; i < groupJids.length; i++) {
            if (stopBroadcast) {
                sendMessageWTyping(from, { text: "❌ *Broadcast stopped* ❌" }, { quoted: msg });
                break;
            }
            await sendMessageWTyping(groupJids[i], { text: message });

            const metadata = await sock.groupMetadata(groupJids[i]);
            const groupName = metadata.subject;

            sendMessageWTyping(from, { text: `✅ Broadcasted to ${groupName}` }, { quoted: msg });

            await delay(2000);
            if (i === groupJids.length - 1) {
                sendMessageWTyping(from, { text: `✅ *Broadcasted to ${groupJids.length} groups* ✅` }, { quoted: msg });
            }
        }
    } catch (err) {
        console.log(err);
    }
};

// Command to stop broadcasting
const stopHandler = (sock, msg, from, args, msgInfoObj) => {
    stopBroadcast = true; // Set the stop flag
    msgInfoObj.sendMessageWTyping(from, { text: "🛑 *Stopping the broadcast...* 🛑" }, { quoted: msg });
};

module.exports.command = () => [
    { cmd: ["bb", "broadcast", "sendbroadcast"], handler: broadcastHandler }, // Added "sendbroadcast" as an alias
    { cmd: ["stopbb", "stopbroadcast", "cancelbroadcast"], handler: stopHandler } // Added "cancelbroadcast" as an alias
];
