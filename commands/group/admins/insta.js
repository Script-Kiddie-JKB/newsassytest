const snapsave = require("insta-downloader");

const handler = async (sock, msg, from, args, msgInfoObj) => {
    const { prefix, sendMessageWTyping } = msgInfoObj;

    if (args.length === 0) {
        return sendMessageWTyping(from, { text: `❌ URL is empty! \nPlease send ${prefix}insta <url>` }, { quoted: msg });
    }

    let urlInsta = args[0];

    const validInstagramURL = urlInsta.includes("instagram.com/p/") || 
                              urlInsta.includes("instagram.com/reel/") || 
                              urlInsta.includes("instagram.com/tv/");

    if (!validInstagramURL) {
        return sendMessageWTyping(from, { text: `❌ Invalid URL! Only Instagram posts, reels, and TV videos can be downloaded.` }, { quoted: msg });
    }

    if (urlInsta.includes("?")) {
        urlInsta = urlInsta.split("/?")[0];
    }

    console.log(urlInsta);

    try {
        const res = await snapsave(urlInsta);

        if (!res.status) {
            return sendMessageWTyping(from, { text: "🚫 No data found!" }, { quoted: msg });
        }

        const uniqueUrls = [...new Set(res.data.map(item => item.url))];

        uniqueUrls.forEach((url, index) => {
            setTimeout(() => {
                const messageType = url.match(/\.(jpg|png|jpeg|webp)$/i) ? 'image' : 'video';
                const media = { [messageType]: { url: url } };
                sock.sendMessage(from, media, { quoted: msg });
            }, 1000 * index);
        });
    } catch (error) {
        console.error(error);
        sendMessageWTyping(from, { text: "🚫 Error fetching data! Please try again later." }, { quoted: msg });
    }
}

module.exports.command = () => ({ cmd: ["insta", "i"], handler });
