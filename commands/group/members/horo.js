const cheerio = require('cheerio');
const axios = require('axios');

const generalURL = "https://www.horoscope.com/us/horoscopes/general/horoscope-general-daily-today.aspx?sign=";
const loveURL = "https://www.horoscope.com/us/horoscopes/love/horoscope-love-daily-today.aspx?sign=";
const careerURL = "https://www.horoscope.com/us/horoscopes/career/horoscope-career-daily-today.aspx?sign=";
const wellnessURL = "https://www.horoscope.com/us/horoscopes/wellness/horoscope-wellness-daily-today.aspx?sign=";

const getHoroscope = async (url, sign) => {
    const res = await axios.get(url + sign);
    const $ = cheerio.load(res.data);
    const horoscope = $('body > div.grid.grid-right-sidebar.primis-rr > main > div.main-horoscope > p:nth-child(2)').text();
    return horoscope;
}

const getGeneralHoroscope = async (sign) => {
    return getHoroscope(generalURL, sign);
}

const getLoveHoroscope = async (sign) => {
    return getHoroscope(loveURL, sign);
}

const getCareerHoroscope = async (sign) => {
    const res = await axios.get(careerURL + sign);
    const $ = cheerio.load(res.data);
    const horoscope = $('body > div.grid.grid-right-sidebar.primis-rr > main > div.main-horoscope > p').first().text().trim();
    return horoscope;
}

const getWellnessHoroscope = async (sign) => {
    return getHoroscope(wellnessURL, sign);
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    const { prefix, sendMessageWTyping } = msgInfoObj;
    const horoEmojis = [
        { sign: '♈', name: 'Aries' },
        { sign: '♉', name: 'Taurus' },
        { sign: '♊', name: 'Gemini' },
        { sign: '♋', name: 'Cancer' },
        { sign: '♌', name: 'Leo' },
        { sign: '♍', name: 'Virgo' },
        { sign: '♎', name: 'Libra' },
        { sign: '♏', name: 'Scorpio' },
        { sign: '♐', name: 'Sagittarius' },
        { sign: '♑', name: 'Capricorn' },
        { sign: '♒', name: 'Aquarius' },
        { sign: '♓', name: 'Pisces' }
    ];

    // Construct the styled message with horoscope options
    const horoListMessage = `
     ┌──────────────────────────────────────┐
    ⭐️                          Horoscope Options                                        ⭐️ 
     └──────────────────────────────────────┘
${horoEmojis.map(({ sign, name }) => `                                                  ${sign}   ${name}`).join('\n')}

Please choose one of the horoscopes above by typing its name or emoji.`;

    if (!args[0]) return sock.sendMessage(from, { text: horoListMessage }, { quoted: msg });

    let horoscope = args[0];
    let h_Low = horoscope.toLowerCase();
    const signs = {
        "aries": 1, "taurus": 2, "gemini": 3, "cancer": 4, "leo": 5, "virgo": 6,
        "libra": 7, "scorpio": 8, "sagittarius": 9, "capricorn": 10, "aquarius": 11, "pisces": 12
    }

    if (!Object.keys(signs).includes(h_Low)) {
        sendMessageWTyping(from, { text: "Kindly enter the right spelling." }, { quoted: msg });
    } else {
        const generalHoroscope = await getGeneralHoroscope(signs[h_Low]);
        const loveHoroscope = await getLoveHoroscope(signs[h_Low]);
        const careerHoroscope = await getCareerHoroscope(signs[h_Low]);
        const wellnessHoroscope = await getWellnessHoroscope(signs[h_Low]);
        sendMessageWTyping(from, {
            text: `🔮 *Horoscope for ${horoscope.toUpperCase()}* 🔮\n\n📅 *Date*: ${new Date().toLocaleDateString()}\n\n🌟 *Nature Holds For you*: ${generalHoroscope.split("-")[1]}\n\n❤️ *Love Horoscope*: ${loveHoroscope.split("-")[1]}\n\n💼 *Career Horoscope*: ${careerHoroscope.split("-")[1]}\n\n💪 *Wellness Horoscope*: ${wellnessHoroscope.split("-")[1]}`
        }, { quoted: msg });
    }
}

module.exports.command = () => ({ cmd: ['horo'], handler });
