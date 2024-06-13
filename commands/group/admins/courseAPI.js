const axios = require('axios');
const TinyURL = require('tinyurl');
const mdClient = require("../../../mongodb");

const coursesCollection = mdClient.db("MyBotDataDB").collection("courses");
const postedCoursesCollection = mdClient.db("MyBotDataDB").collection("postedCourses");

postedCoursesCollection.createIndex({ courseId: 1, groupJid: 1 });

// In-memory cache for posted course URLs
const postedCoursesCache = new Set();

// Processing flag to prevent concurrent executions
let processing = false;

const fetchAndStoreCourses = async () => {
    const new_order = 'date';
    const new_page = 1;
    const per_page = 10;
    const arg_free = 1;
    const arg_keyword = "";
    const arg_language = "";

    try {
        const res = await axios.get(`https://www.real.discount/api/all-courses/?store=Udemy&page=${new_page}&per_page=${per_page}&orderby=${new_order}&free=${arg_free}&search=${arg_keyword}&language=${arg_language}`);
        const courses = res.data.results.filter(course => course.language === "English");

        console.log(`✨ Fetched ${courses.length} courses from the API`); // Log the count of courses fetched

        // Filter out duplicate courses by comparing URLs
        const existingCourses = await coursesCollection.find({}).toArray();
        const newCourses = courses.filter(course => !existingCourses.some(existingCourse => existingCourse.url === course.url));

        if (newCourses.length > 0) {
            // Store new courses in MongoDB
            await coursesCollection.insertMany(newCourses);
            console.log(`📦 Stored ${newCourses.length} new courses in MongoDB`);
        } else {
            console.log("🚫 No new courses found");
        }
    } catch (err) {
        console.error("❌ Error fetching and storing courses:", err);
    }
};

fetchAndStoreCourses();

const fetchInterval = setInterval(fetchAndStoreCourses, 3 * 60 * 1000);
// const fetchInterval = setInterval(fetchAndStoreCourses, 30 * 1000);

//const getRandomDelay = () => Math.floor(Math.random() * (10 * 60 * 1000 - 1 * 60 * 1000) + 1 * 60 * 1000); // Random delay between 1 and 10 minutes
const getRandomDelay = () => Math.floor(Math.random() * (2 * 60 * 1000 - 1 * 60 * 1000) + 1 * 60 * 1000); // Random delay between 1 and 2 minutes

const sendCoursesFromDB = async (sock, msg, from, args, msgInfoObj) => {
    const { sendMessageWTyping, groupMetadata } = msgInfoObj;

    // Check if the process is already running
    if (processing) {
        console.log("🚫 Command is already being processed. Please wait until the current process is complete.");
        await sendMessageWTyping(from, {
            text: "🚫 Command is already being processed. Please wait until the current process is complete."
        });
        return;
    }

    // Set the processing flag to true
    processing = true;

    const courses = await coursesCollection.find({}).toArray();
    console.log(`📚 Total courses available: ${courses.length}`);
    let totalPosted = 0; // Variable to store the total number of posted courses
    let allCoursesAlreadyPosted = true; // Flag to track if all courses are already posted

    for (const value of courses) {
        try {
            // Check if the course URL is in the cache
            if (postedCoursesCache.has(value.url)) {
                console.log(`🔍 Course '${value.name}' with ID ${value._id} has already been posted`);
                continue; // Skip this course
            }

            // Check if the course has already been posted in the same group
            const isPosted = await postedCoursesCollection.findOne({ courseId: value._id, groupJid: from });

            if (isPosted) {
                console.log(`🔍 Course '${value.name}' with ID ${value._id} has already been posted in group '${isPosted.grpName}'`);
                // Add course URL to cache
                postedCoursesCache.add(value.url);
                continue; // Skip this course
            }

            allCoursesAlreadyPosted = false; // At least one course is new

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
            const randomDelay = getRandomDelay();
            await new Promise(resolve => setTimeout(resolve, randomDelay)); // Wait for the random delay

            // Store information about the posted course including the group name
            await postedCoursesCollection.insertOne({ courseId: value._id, name: value.name, postedAt: new Date(), groupJid: from, grpName: groupMetadata.subject });
            console.log(`📢 Posted course '${value.name}' with ID ${value._id} in group '${groupMetadata.subject}' at ${new Date().toLocaleString()}`);
            totalPosted++;

            postedCoursesCache.add(value.url);
        } catch (err) {
            console.error('❌ Error:', err);
            await sendMessageWTyping(from, {
                text: `📘 *Course:* ${value.name}\n\n📖 *Description:* ${value.shoer_description}\n\n🔗 *Enroll:* ${value.url}\n\n🕒 *Enroll Course Before ${value.sale_end}*`
            });
        }
    }

    if (allCoursesAlreadyPosted) {
        await sendMessageWTyping(from, {
            text: `🚫 All available courses have already been posted. Please try again after 30 minutes.`
        });
    } else {
        console.log(`🚀 Total courses posted: ${totalPosted}`);
        await sendMessageWTyping(from, {
            text: `✅ Successfully posted ${totalPosted} courses! 🎉📚\n\n𝙵𝚘𝚛 𝚖𝚘𝚛𝚎 𝙵𝚛𝚎𝚎 𝙲𝚘𝚞𝚛𝚜𝚎𝚜, 𝙹𝚘𝚒𝚗 𝚞𝚜! \n\n🌟 𝙴𝚡𝚙𝚕𝚘𝚛𝚎 𝚝𝚑𝚎 𝚆𝚘𝚛𝚕𝚍 𝚘𝚏 𝙺𝚗𝚘𝚠𝚕𝚍𝚎𝚐𝚎 𝚠𝚒𝚝𝚑 𝚄𝚜 \n\nhttps://chat.whatsapp.com/LVLRFlxL5T4JMsQFoOaouV`
        });
    }

    // Clear the in-memory cache after processing all courses
    postedCoursesCache.clear();
    console.log("🧹 Cleared the in-memory cache");

    // Set the processing flag to false to allow new executions
    processing = false;
};

module.exports.command = () => ({ cmd: ["free", "evil"], handler: sendCoursesFromDB });
