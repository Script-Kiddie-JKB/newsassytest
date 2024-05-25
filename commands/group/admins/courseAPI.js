const axios = require('axios');
const TinyURL = require('tinyurl');

const handler = async (sock, msg, from, args, msgInfoObj) => {
    const { sendMessageWTyping } = msgInfoObj;
    const new_order = 'date';
    let new_page = 1; // Default page
    let per_page = 15; // Default per_page
    const arg_free = 1; // Only free courses
    const arg_keyword = "";
    const arg_language = ""; // Include only English

    // Interpret arguments
    if (args.length === 1) {
        per_page = args[0];
    } else if (args.length === 2) {
        new_page = args[0];
        per_page = args[1];
    }

    await axios.get(`https://www.real.discount/api/all-courses/?store=Udemy&page=${new_page}&per_page=${per_page}&orderby=${new_order}&free=${arg_free}&search=${arg_keyword}&language=${arg_language}`)
        .then(async (res) => {
            const courses = res.data.results.filter(course => course.language === "English");

            for (const value of courses) {
                try {
                    const shortLink = await TinyURL.shorten(value.url);

                    const sendMessage = async () => {
                        if (value.image) {
                            const response = await axios({
                                url: value.image,
                                method: 'GET',
                                responseType: 'arraybuffer'
                            });

                            await sendMessageWTyping(from, {
                                image: response.data,
                                caption: `📘 *Course:* ${value.name}\n\n📖 *Description:* ${value.shoer_description}\n\n🔗 *Enroll:* ${shortLink}\n\n🕒 *Enroll Course Before ${value.sale_end}*`
                            });
                        } else {
                            await sendMessageWTyping(from, {
                                text: `📘 *Course:* ${value.name}\n\n📖 *Description:* ${value.shoer_description}\n\n🔗 *Enroll:* ${shortLink}\n\n🕒 *Enroll Course Before ${value.sale_end}*`
                            });
                        }
                    };

                    await sendMessage();
                    await new Promise(resolve => setTimeout(resolve, 1200000)); // Wait for 20 minutes (1,200,000 milliseconds)

                } catch (err) {
                    console.log('Error:', err);
                    await sendMessageWTyping(from, {
                        text: `📘 *Course:* ${value.name}\n\n📖 *Description:* ${value.shoer_description}\n\n🔗 *Enroll:* ${value.url}\n\n🕒 *Enroll Course Before ${value.sale_end}*`
                    });
                }
            }

            // Send the footer message if per_page is 25
            if (per_page == 25) {
                await sendMessageWTyping(from, { 
                    text: '𝙵𝚘𝚛 𝚖𝚘𝚛𝚎 𝙵𝚛𝚎𝚎 𝙲𝚘𝚞𝚛𝚜𝚎𝚜, 𝙹𝚘𝚒𝚗 𝚞𝚜! \n\n🌟✨💫  𝙴𝚡𝚙𝚕𝚘𝚛𝚎 𝚝𝚑𝚎 𝚆𝚘𝚛𝚕𝚍 𝚘𝚏 𝙺𝚗𝚘𝚠𝚕𝚎𝚍𝚐𝚎 𝚠𝚒𝚝𝚑 𝚄𝚜 💫✨🌟\n\nhttps://chat.whatsapp.com/LVLRFlxL5T4JMsQFoOaouV'
                });
            }
        })
        .catch((err) => {
            sendMessageWTyping(from, { 
                text: "Sorry, something went wrong while fetching courses. Please try again later." 
            }, { quoted: msg });
            console.log(err);
        });
};

module.exports.command = () => ({ cmd: ["free", "evil"], handler });
