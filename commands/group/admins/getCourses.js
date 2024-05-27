
const mdClient = require("../../../mongodb"); // Import MongoDB client
const coursesCollection = mdClient.db("MyBotDataDB").collection("courses"); // Import courses collection
module.exports.command = () => {
    let cmd = ["cn"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, msgInfoObj) => {
    const { sendMessageWTyping } = msgInfoObj;
    try {
        const count = await coursesCollection.countDocuments();
        sock.sendMessage(from, {
            text: `📚 Total courses available: ${count}`
        });
    } catch (err) {
        console.error('❌ Error:', err);
        sendMessageWTyping(from, {
            text: "❌ Error occurred while getting total courses count."
        });
    }
}

