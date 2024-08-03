const snapsave = require("insta-downloader");

// Helper function to validate the Instagram URL
const isValidInstagramURL = (url) => {
    return url.includes("instagram.com/p/") ||
           url.includes("instagram.com/reel/") ||
           url.includes("instagram.com/tv/");
};

// Helper function to remove query parameters from URL
const removeQueryParams = (url) => {
    return url.includes("?") ? url.split("/?")[0] : url;
};

// Helper function to send messages with delay
const sendMediaWithDelay = (sock, from, msg, mediaUrls) => {
    mediaUrls.forEach((url, index) => {
        setTimeout(() => {
            const messageType = url.match(/\.(jpg|png|jpeg|webp)$/i) ? 'image' : 'video';
            const media = { [messageType]: { url: url }, caption: "Downloaded by Sassy 🍁" };
            console.log(`📤 Sending ${messageType} from URL: ${url}`);
            sock.sendMessage(from, media, { quoted: msg });
            console.log(`✅ Completed sending ${messageType} from URL: ${url}`);
        }, 1000 * index);
    });
};

// Main handler function
const handler = async (sock, msg, from, args, msgInfoObj) => {
    const { prefix, sendMessageWTyping } = msgInfoObj;

    if (args.length === 0) {
        return sendMessageWTyping(from, { text: `❌ URL is empty! \nPlease send ${prefix}insta <url>` }, { quoted: msg });
    }

    let urlInsta = args[0];
    console.log(`🔗 Received URL: ${urlInsta}`);

    if (!isValidInstagramURL(urlInsta)) {
        return sendMessageWTyping(from, { text: `❌ Invalid URL! Only Instagram posts, reels, and TV videos can be downloaded.` }, { quoted: msg });
    }

    urlInsta = removeQueryParams(urlInsta);
    console.log(`🔍 Processed URL: ${urlInsta}`);

    try {
        console.log(`📥 Request to download from URL: ${urlInsta}`);
        const res = await snapsave(urlInsta);

        if (!res.status) {
            console.log(`⚠️ No data found for URL: ${urlInsta}`);
            return sendMessageWTyping(from, { text: "🚫 No data found!" }, { quoted: msg });
        }

        const uniqueUrls = [...new Set(res.data.map(item => item.url))];
        console.log(`📦 Found ${uniqueUrls.length} media items to download.`);
        
        sendMediaWithDelay(sock, from, msg, uniqueUrls);
    } catch (error) {
        console.error(`❌ Error fetching data for URL: ${urlInsta}`, error);
        sendMessageWTyping(from, { text: "🚫 Error fetching data! Please try again later." }, { quoted: msg });
    }
};

// Export the command
module.exports.command = () => ({ cmd: ["insta", "i"], handler });
