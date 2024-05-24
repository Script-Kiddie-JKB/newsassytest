const axios = require("axios");
const cheerio = require("cheerio");
// const baseurl = "https://pronoob-aio-drive.gq/Sct?search=";
const baseurl = "https://www.myhindilekh.in/";

module.exports.command = () => {
    let cmd = ["movie"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    const { evv, sendMessageWTyping } = msgInfoObj;
    if (!args[0]) return sendMessageWTyping(from, { text: 'Provide Movie Name.' }, { quoted: msg });
    let link = baseurl + evv.replaceAll(" ", "-");
    let url = `Direct link for ${evv}\n\n`;

    try {
        const { data } = await axios.get(link);

        const $ = cheerio.load(data);

        const links = $('div[class="entry-content"] p a');
        links.each((index, ele) => {
            let movie_list = $(ele).attr('href');
            if (movie_list.includes('download'))
                url += '🎬 ' + movie_list + "\n\n";
        });
        if (url != `Direct link for ${evv}\n\n`) {
            sock.sendMessage(from, { text: url, linkPreview: url });
        } else {
            sendMessageWTyping(from, { text: `*Sorry* No Movie Found\nCheck your _spelling or try another movie_.` }, { quoted: msg });
        }
    } catch (err) {
        sendMessageWTyping(from, { text: err.toString() }, { quoted: msg });
    }
    // let link = baseurl + evv.toLowerCase().split(" ").join("+");
    // const res = await axios({
    //     method: "GET",
    //     url: link,
    //     responseType: "streamarraybuffer",
    // }).catch((err) => {
    //     return sendMessageWTyping(from, { text: err.toString() }, { quoted: msg });
    // });

    // try {
    //     data = res.data;
    //     let word = data.trim().replace(/^\s+|\s+$/gm, '').split("\n");
    //     for (let i = 0; i < word.length; i++) {
    //         if (word[i].startsWith("<a href")) {
    //             if (word[i].endsWith('mkv"') || (word[i].endsWith('mp4"')) || (word[i].endsWith('avi"')))
    //                 url += "🎬 https://pronoob-aio-drive.gq/" + word[i].substr(9, word[i].length - 10) + "\n\n";
    //         }
    //     }
    //     if (url != `Direct link for ${evv}\n\n`) {
    //         sock.sendMessage(from, { text: url,linkPreview: url });
    //     } else {
    //         sendMessageWTyping(from, { text: `*Sorry* No Movie Found\nCheck your _spelling or try another movie_.` }, { quoted: msg });
    //     }
    // } catch (err) {
    //     sendMessageWTyping(from, { text: err.toString() }, { quoted: msg });
    // }


}
