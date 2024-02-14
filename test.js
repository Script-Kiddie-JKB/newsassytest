/**
 * @author: jacktheboss220
 */
require("dotenv").config();

//-------------------------------------------------------------------------------------------------------------//

// const fs = require('fs');
// const mdClient = require('./mongodb');

// const collection = mdClient.db("MyBotDataDB").collection("AuthTable");

// collection.deleteOne({ _id: "auth" }).then(res => {
//     console.log(res);
//     collection.find({}).toArray().then(res => {
//         console.log(res);
//     })
// });

// const collection = mdClient.db("MyBotDataDB").collection("Groups");

// const collection = mdClient.db("MyBotDataDB").collection("members");

// collection.find({ dmLimit: { $lt: 100 } }).toArray().then(res => {
//     res.forEach(ele => {
//         collection.updateOne({ _id: ele._id }, { $set: { dmLimit: 1000 } }).then(res => {
//             console.log(res);
//         })
//     })
// })

// collection.findOne({ _id: "918318585418@s.whatsapp.net" }).then(res => {
// console.log(res.test);
// console.log(res.warning.test);
// console.log(typeof (res.warning));
// })

// collection.aggregate([
//     { $match: { _id: "919557666582-1467533860@g.us" } },
//     { $unwind: "$members" },
//     { $sort: { "members.count": -1 } },
//     { $group: { _id: "$_id", memberCount: { $push: "$members" } } }
// ]).toArray().then(r => {
//     const t = r[0].memberCount.map(ele => {
//         return ele.name + " " + ele.count
//     })
//     console.log(t);
// });

//-------------------------------------------------------------------------------------------------------------//

// const { Configuration, OpenAIApi } = require("openai");
// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);
// (async () => {
//     const result = await openai.createImage({
//         prompt: "a man sitting at night watching the horizon, sky with stars, lake, 4k, ultra real",
//         n: 1,
//         size: "1024x1024",
//     });
//     console.log(result.data);
// })();

//-------------------------------------------------------------------------------------------------------------//

// const tts = require('google-tts-api');
// (async () => {
//     const url = tts.getAudioUrl('Hello World', {
//         lang: 'en',
//         slow: false,
//         host: 'https://translate.google.com',
//         timeout: 10000,
//     });
//     console.log(url);
// })();
//-------------------------------------------------------------------------------------------------------------//

// const gis = require('g-i-s');
// gis('cats', logResults);

// function logResults(error, results) {
//     if (error) {
//         console.log(error);
//     }
//     else {
//         console.log(JSON.stringify(results, null, '  '));
//     }
// }

//-------------------------------------------------------------------------------------------------------------//

// const { savefrom } = require('@bochilteam/scraper');
// (async () => {
//     const data = await savefrom('https://www.instagram.com/reel/Cu3zPb6Kf6c/?utm_source=ig_web_copy_link')
//     console.log(data) // JSON
// })();

//-------------------------------------------------------------------------------------------------------------//

// const axios = require('axios');

// const url = "https://worker.savefrom.net/savefrom.php";

// const url1 = "https://www.instagram.com/p/Cvlr-u4tfTe/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA==";
// const payload = {
//     "sf_url": url1,
//     "sf_submit": "",
//     "new": 2,
//     "lang": "en",
//     "app": "",
//     "country": "in",
//     "os": "Windows",
//     "browser": "Chrome",
//     "channel": "main",
//     "sf-nomad": 1,
//     "url": url1,
//     "ts": 1691301740358,
//     "_ts": 1691163582244,
//     "_tsc": 0,
//     "_s": "ef3b2df49393398c5ccf16f8e5b784322922d81fe20bee58bf53d9a6aad393ab"
// }

// axios.post(url, payload, {
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//     }
// }).then(response => {
//     console.log(response.data);
// }).catch(error => {
//     console.error(error);
// });

//-------------------------------------------------------------------------------------------------------------//

// const truecallerjs = require('truecallerjs');
// var searchData = {
//     number: "8318585418",
//     countryCode: "IN",
//     installationId: 'a1i0s--gyCXV4-G-x5QsSQeJZ5hhGTIBgZ6r6oXWgB-44NEw170V8yVxk6u1NahW',
// };

// truecallerjs.searchNumber(searchData).then((data) => {
//     console.log(JSON.stringify(data));
// }).catch((err) => {
//     console.log(err);
// });

//-------------------------------------------------------------------------------------------------------------//

// const url = "https://worker.savefrom.net/savefrom.php";

// const formData = {
//     "sf_url": "https://www.instagram.com/reel/CtGI1qguKUL/",
//     "sf_submit": "",
//     "new": 2,
//     "lang": "en",
//     "app": "",
//     "country": "in",
//     "os": "Windows",
//     "browser": "Chrome",
//     "channel": "main",
//     "sf-nomad": 1,
//     "url": "https://www.instagram.com/reel/CtGI1qguKUL/",
//     "ts": 1691294033867,
//     "_ts": 1691163582244,
//     "_tsc": 0,
//     "_s": "f4e70b3962c40c63ad64702bdeb02538b29cf8c7085641a38f8bb9f34ea311c7"
// }

// const axios = require('axios');

// axios.post(url, formData).then(res => {
//     console.log(res.data);
// }).catch(err => {
//     console.log(err);
// })

//-------------------------------------------------------------------------------------------------------------//

// const axios = require('axios');
// var __importDefault = (this && this.__importDefault) || function (mod) {
//     return (mod && mod.__esModule) ? mod : { "default": mod };
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// const vm_1 = __importDefault(require("vm"));
// const url = "https://worker.savefrom.net/savefrom.php";

// const url1 = "https://www.instagram.com/p/CvgSKFLNjIh/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA==";

// const payload = {
//     "sf_url": url1,
//     "sf_submit": "",
//     "new": 2,
//     "lang": "en",
//     "app": "",
//     "country": "in",
//     "os": "Windows",
//     "browser": "Chrome",
//     "channel": "main",
//     "sf-nomad": 1,
//     "url": url1,
//     // "ts": 1691304699154,
//     "_ts": 1691163582244,
//     "_tsc": 0,
//     "_s": "ef3b2df49393398c5ccf16f8e5b784322922d81fe20bee58bf53d9a6aad393ab"
// }

// axios.post(url, payload, {
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//     }
// }).then(response => {
//     console.log(response.data);
//     let scriptJS = response.data;
//     const executeCode = '[]["filter"]["constructor"](b).call(a);';
//     if (scriptJS.indexOf(executeCode) === -1)
//         throw new Error(`Cannot find execute code\n${scriptJS}`);
//     scriptJS = scriptJS.replace(executeCode, `
// try {const script = ${executeCode.split('.call')[0]}.toString();if (script.includes('function showResult')) scriptResult = script;else (${executeCode.replace(/;/, '')});} catch {}
// `);
//     const context = {
//         scriptResult: '',
//         log: console.log
//     };
//     vm_1.default.createContext(context);
//     new vm_1.default.Script(scriptJS).runInContext(context);
//     const data = ((_a = context.scriptResult.split('window.parent.sf.videoResult.show(')) === null || _a === void 0 ? void 0 : _a[1]) || ((_b = context.scriptResult.split('window.parent.sf.videoResult.showRows(')) === null || _b === void 0 ? void 0 : _b[1]);
//     if (!data)
//         throw new Error(`Cannot find data ("${data}") from\n"${context.scriptResult}"`);
//     let json;
//     try {
//         // @ts-ignore
//         if (context.scriptResult.includes('showRows')) {
//             const splits = data.split('],"');
//             const lastIndex = splits.findIndex(v => v.includes('window.parent.sf.enableElement'));
//             json = JSON.parse(splits.slice(0, lastIndex).join('],"') + ']');
//         }
//         else {
//             json = [JSON.parse(data.split(');')[0])];
//         }
//     }
//     catch (e) {
//         json = null;
//     }

//     const result = json.map(item => item.url[0].url);
//     console.log(result);

// }).catch(error => {
//     console.error(error);
// });

// function parseTextCommand(text) {
//     const regex = /(?:([^;]+);)?(?:([^;]+);)?(?:([^;]+);)?(?:([^;]+);)?(?:([^;]+);)?/;

//     const matches = text.match(regex);

//     if (!matches) {
//         return null; // Invalid format
//     }

//     const [, fontColor, fontStrokeColor, fontSize, fontTop, fontBottom] = matches;

//     const parsedData = {
//         fontColor: fontColor || "defaultFontColor",
//         fontStrokeColor: fontStrokeColor || "defaultFontStrokeColor",
//         fontSize: fontSize || "defaultFontSize",
//         fontTop: fontTop || "defaultFontTop",
//         fontBottom: fontBottom || "defaultFontBottom",
//     };

//     return parsedData;
// }

//-------------------------------------------------------------------------------------------------------------//

// // const userInput = "#FF0000;;24;;Hello;World";
// const userInput = "24;Hello;World";
// const parsedResult = parseTextCommand(userInput);

// if (parsedResult) {
//     console.log(parsedResult);
// } else {
//     console.log("Invalid command format.");
// }

//-------------------------------------------------------------------------------------------------------------//

// const Genius = require("genius-lyrics");
// const { getLyrics } = require('genius-lyrics-api');
// const Client = new Genius.Client(process.env.GENIUS_ACCESS_SECRET);

// (async () => {
//     const searches = await Client.songs.search("shameless camila cabello");
//     const firstSong = searches[0];
//     let lyric = await firstSong.lyrics();
//     if (lyric == null) {
//         lyric = await getLyrics({ apiKey: process.env.GENIUS_ACCESS_SECRET, title: firstSong.title, artist: firstSong.artist.name, optimizeQuery: true });
//     }
//     console.log("Name: " + firstSong.title);
//     console.log("Artist: " + firstSong.artist.name);
//     console.log("Lyrics: " + lyric);
// })();

//-------------------------------------------------------------------------------------------------------------//

// const snapsave = require("snapsave-downloader");
// (async () => {
//     // let URL = await snapsave("https://www.instagram.com/p/CvmigYyovau/");
//     let URL = await snapsave("https://www.instagram.com/p/Cvq2RFMN-_z");
//     const data = [...new Set(URL.data.map(item => item.url))];
//     console.log(data);
// })();

//-------------------------------------------------------------------------------------------------------------//

// const fs = require("fs");
// const axios = require("axios");

// const baseURL = "https://www.googleapis.com/customsearch/v1";
// const googleapis = `?key=${process.env.GOOGLE_API_KEY}`;
// const searchEngineKey = `&cx=${process.env.SEARCH_ENGINE_KEY}`;
// const defQuery = "&q=";
// const evv = "realme 8"

// const urlToSearch = `${baseURL}${googleapis}${searchEngineKey}${defQuery}${evv}`;

// axios(urlToSearch).then(async (res) => {
//     const searchResults = res.data?.items;
//     const extractedData = searchResults.map(result => {
//         return {
//             title: result.title,
//             snippet: result.snippet,
//             link: result.link,
//         };
//     });

//     const message = extractedData.map(result => (
//         `Title: ${result.title}\nSnippet: ${result.snippet}\nLink: ${result.link}\n`
//     )).join('\n');

//     console.log(message);
// }).catch(() => {
// });

//-------------------------------------------------------------------------------------------------------------//

// require("dotenv").config();
// const truecallerjs = require('truecallerjs');

// (async () => {
//     var searchData = {
//         number: "918318585418",
//         countryCode: "IN",
//         installationId: process.env.TRUECALLER_ID
//     }

//     const response = await truecallerjs.search(searchData);
//     if (!response) return console.log("No data found");
//     const data = response.json().data[0];

//     const name = response.getName();
//     const { e164Format, numberType, countryCode, carrier, type } = data?.phones[0];
//     const { city } = response.getAddresses()[0];
//     const email = response.getEmailId();

//     const message = '*Name:* ' + name + '\n' +
//         '*Number:* ' + e164Format + '\n' +
//         '*City:* ' + city + '\n' +
//         '*Country Code:* ' + countryCode + '\n' +
//         '*Carrier:* ' + carrier + ', ' + numberType + '\n' +
//         // '*Type:* ' + type + '\n' +
//         '*Email:* ' + email + '\n';

//     console.log(message);

// })();

//-------------------------------------------------------------------------------------------------------------//

// const axios = require("axios");

// axios.get(`https://search5-noneu.truecaller.com/v2/search`, {
//     params: {
//         q: "9183185418",
//         countryCode: "IN",
//         type: 4,
//         locAddr: "",
//         placement: "SEARCHRESULTS,HISTORY,DETAILS",
//         encoding: "json",
//     },
//     headers: {
//         "content-type": "application/json; charset=UTF-8",
//         "accept-encoding": "gzip",
//         "user-agent": "Truecaller/13.28.6 (Android;13)",
//         Authorization: `Bearer ${process.env.TRUECALLER_ID}`,
//     },
// }).then((response) => {
//     console.log(response.data);
// }).catch((error) => {
//     console.log(error.response.data);
//     // console.log(error.response);
// });

//-------------------------------------------------------------------------------------------------------------//

// const axios = require("axios");
// (async () => {
//     await axios({
//         url: `https://www.instagram.com/__mahesh__01/?__a=1&__d=dis`,
//         headers: {
//             accept: "*/*",
//             "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
//             "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
//             "sec-ch-ua-mobile": "?0",
//             'sec-ch-ua-platform': '"Linux"',
//             "sec-fetch-dest": "empty",
//             "sec-fetch-mode": "cors",
//             "sec-fetch-site": "same-site",
//             'x-asbd-id': '198387',
//             'x-csrftoken': '9id7NIrYulj8aPVUSAOLvNC2nkhRRWdd',
//             'x-ig-app-id': '936619743392459',
//             'x-ig-www-claim': 'hmac.AR2rCmfN1Jb98fTtIV5rXy1EHz-DxQIGk6fgEQbmFdZp0uiw',
//             cookie: `sessionid=60827384736%3AU3JPMQmLdXWQjQ%3A15%3AAYdUsVYY5SDNLgt6nbAn1EN26nKQqxiV62_6E5djFA; ig_nrcb=1; fbm_124024574287414=base_domain=.instagram.com; ds_user_id=60827384736; dpr=1.5;`,
//             Referer: 'https://www.instagram.com/',
//             'Referrer-Policy': 'strict-origin-when-cross-origin',
//         },
//         method: "GET",
//     }).then(res => {
//         console.log(res.data.graphql.user.profile_pic_url_hd);
//     })

// })();

//-------------------------------------------------------------------------------------------------------------//

// const { getBotData } = require('./mongo-DB/botDataDb');

// (async () => {

//     const botData = await getBotData();

//     const text = botData.instaSession_id;

//     const sessionid = /sessionid=([^;]+);/.exec(text)[1];
//     const ds_user_id = /ds_user_id=([^;]+);/.exec(text)[1];

//     console.log(sessionid);
//     console.log(ds_user_id);
// })()

//-------------------------------------------------------------------------------------------------------------//

// const inshorts = require('inshorts-api');
// let arr = ['national', 'business', 'sports', 'world', 'politics', 'technology', 'startup', 'entertainment', 'miscellaneous', 'hatke', 'science', 'automobile'];

// var options = {
//     lang: 'en',
//     category: "",
//     numOfResults: 10
// }

// inshorts.get(options, function (result) {
//     let message = `☆☆☆☆💥 ${"" == "" ? "All" : newsType.toUpperCase()} 💥☆☆☆☆ \n\n${""}`;
//     for (const news of result) {
//         message += '🌐 ';
//         message += `${news.title} ~ ${news.author}\n`;
//         // message += `Author: ${news.author}\n`;
//         // message += `Content: ${news.content}\n`;
//         // message += `Posted At: ${news.postedAt}\n`;
//         // message += `Source URL: ${news.sourceURL}\n`;
//         message += '\n';
//     }
//     console.log(message);
// });

//-------------------------------------------------------------------------------------------------------------//

// const OpenAI = require('openai');

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });

// async function main() {
//     const completion = await openai.chat.completions.create({
//         messages: [{ role: 'user', content: 'Say this is a testSay this is a testSay this is a testSay this is a testSay this is a testSay this is a testSay this is a testSay this is a testSay this is a testSay this is a testSay this is a testSay this is a testSay this is a testSay this is a testSay this is a test' }],
//         model: 'gpt-3.5-turbo',
//         max_tokens: 30,
//     });
//     // const completion = await openai.completions.create({
//     //     model: "text-davinci-003",
//     //     prompt: "This story begins",
//     //     max_tokens: 30,
//     // });

//     console.log(completion.choices);
// }

// main();

//-------------------------------------------------------------------------------------------------------------//
// const ytdl = require('ytdl-core');
// const youtubedl = require('youtube-dl-exec');

// // https://youtube.com/watch?v=Fp_P_e1cPOE
// (async () => {
//     let title = await ytdl.getInfo(URL).then(res => res.videoDetails.title.trim());
//     console.log(title);
// })();

// youtubedl("https://youtube.com/watch?v=Fp_P_e1cPOE", {
//     format: 'mp4',
//     output: "download.mp4",
//     maxFilesize: "104857600"
// }).then((r) => {
//     console.log(r);
//     if (r?.includes("max-filesize")) {
//         console.log("File size exceeds more then 100MB.");
//     } else {
//         console.log("File downloaded successfully.");
//     }
// }).catch(err => {
//     console.log(err);
// })


// const snapsave = require("insta-downloader");

// const handler = async (urlInsta) => {

//     snapsave(urlInsta).then(async res => {
//         console.log(res);
//     }).catch(err => {
//         console.log(err);
//     });
// }

// handler("https://www.instagram.com/reel/Cx8YUHyoN0_/?utm_source=ig_web_copy_link");


// const youtubedl = require('youtube-dl-exec');
// const audioFormat = 'mp3'; // Choose your desired audio format (e.g., mp3, flac)
// const outputFilename = 'audio.mp3'; // Output filename

// async function downloadAudio(url) {
//     try {

//         const result = await youtubedl(url, {
//             format: 'm4a',
//             output: outputFilename,
//             maxFilesize: "104857600",
//             preferFreeFormats: true,
//         });

//         console.log(`Downloaded audio: ${result}`);
//     } catch (error) {
//         console.error(`Error downloading audio: ${error.message}`);
//     }
// }

// // Replace with your actual YouTube link

// downloadAudio(youtubeLink);


// const URL = 'https://www.youtube.com/watch?v=PGPVZT3Blvs';
// const URL = 'https://www.youtube.com/watch?v=c3L0fbtftRY';
// const URL = 'https://youtu.be/fx2Z5ZD_Rbo?si=X2O0MmuOukEjKVw8';
// const fileDown = 'download.mp4';
// const fs = require('fs');

// (async () => {

// const stream = youtubedl(URL, {
//     format: 'mp4',
//     output: "down.mp4",
//     // maxFilesize: "104857600"
// });

// await Promise.all([stream]).then(async (r) => {
//     console.log(r);
//     if (r?.includes("max-filesize")) {
//         console.log("File size exceeds more then 100MB.");
//     } else {
//         console.log("File downloaded successfully.");
//     }
// }).catch(err => {
//     console.log(err);
// });

//     try {
//         ytdl(URL, {
//             // filter: format => format.container === 'mp4',
//             // filter: format => format.container === 'm4a',
//             // format: 'm4a',
//             filter: info => info.hasVideo && info.hasAudio,
//             // filter: info => info.itag
//         }).pipe(fs.createWriteStream("fileDown.mp4")).on('finish', () => {
//             console.log("Video downloaded")
//         }).on('error', (err) => {
//             console.log(err);
//         });
//     } catch (err) {
//         console.log(err);
//     }

// })();

const fs = require('fs');
const { intersect } = require("@hapi/hoek");

const all = JSON.parse(fs.readFileSync('all.json'));

const sticker1 = all["919557666582-1586018947@g.us"].participants.map(r => r.id);
const sticker2 = all["919557666582-1628610549@g.us"].participants.map(r => r.id);

const commonInBoth = sticker1.filter(r => sticker2.includes(r));
fs.writeFileSync('common1.json', JSON.stringify(commonInBoth.map(r => parseInt(r.split("@")[0])), null, 2));