const fs = require("fs");

const handler = async (sock, msg, from, args, msgInfoObj) => {
    const { sendMessageWTyping } = msgInfoObj;

    await sendMessageWTyping(from,
        {
            image: fs.readFileSync("./assets/donate.png"),
            caption: 'Donate to keep this bot alive!' + '\n'
                + 'Name - Jaikishan Bagul' + '\n'
                + 'UPI Handle - pronoob@paytm'
        },
        { quoted: msg }
    )
}

module.exports.command = () => ({ cmd: ["donate", "donation"], handler });