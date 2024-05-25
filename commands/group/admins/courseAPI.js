const axios = require('axios');
const TinyURL = require('tinyurl');
const cron = require('node-cron');
const mdClient = require("../../../mongodb"); // Adjust the path based on the actual directory structure

const coursesCollection = mdClient.db("MyBotDataDB").collection("courses");
const postedCoursesCollection = mdClient.db("MyBotDataDB").collection("postedCourses");

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

        console.log(`Fetched ${courses.length} courses from the API`); // Log the count of courses fetched

        // Filter out duplicate courses by comparing URLs
        const existingCourses = await coursesCollection.find({}).toArray();
        const newCourses = courses.filter(course => !existingCourses.some(existingCourse => existingCourse.url === course.url));

        if (newCourses.length > 0) {
            // Store new courses in MongoDB
            await coursesCollection.insertMany(newCourses);
            console.log(`Stored ${newCourses.length} new courses in MongoDB`);
        } else {
            console.log("No new courses found");
        }
    } catch (err) {
        console.error("Error fetching and storing courses:", err);
    }
};

// Schedule the handler to run every 20 minutes
cron.schedule('*/20 * * * *', fetchAndStoreCourses);

// Handler function to send courses from MongoDB
const sendCoursesFromDB = async (sock, msg, from, args, msgInfoObj) => {
    const { sendMessageWTyping, groupMetadata } = msgInfoObj;
    const delay_seconds = 120; // Delay of 2 minutes

    try {
        const courses = await coursesCollection.find({}).toArray();
        console.log(`Total courses available: ${courses.length}`);
        let totalPosted = 0; // Variable to store the total number of posted courses
        for (const value of courses) {
            try {
                // Check if the course has already been posted in the same group
                const isPosted = await postedCoursesCollection.findOne({ courseId: value._id, groupJid: from });
                if (isPosted) {
                    console.log(`Course '${value.name}' with ID ${value._id} has already been posted in group '${isPosted.grpName}'`);
                    continue; // Skip this course
                }

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
                await new Promise(resolve => setTimeout(resolve, delay_seconds * 1000)); // Wait for the specified delay

                // Store information about the posted course including the group name
                await postedCoursesCollection.insertOne({ courseId: value._id, name: value.name, postedAt: new Date(), groupJid: from, grpName: groupMetadata.subject });
                console.log(`Posted course '${value.name}' with ID ${value._id} in group '${groupMetadata.subject}' at ${new Date().toLocaleString()}`);
                totalPosted++; // Increment the total number of posted courses

                // Schedule deletion of the posted course from the courses collection after one day
                setTimeout(async () => {
                    await coursesCollection.deleteOne({ _id: value._id });
                    console.log(`Deleted posted course '${value.name}' with ID ${value._id} from courses collection after one day`);
                }, 24 * 60 * 60 * 1000); // 24 hours

            } catch (err) {
                console.error('Error:', err);
                await sendMessageWTyping(from, {
                    text: `📘 *Course:* ${value.name}\n\n📖 *Description:* ${value.shoer_description}\n\n🔗 *Enroll:* ${value.url}\n\n🕒 *Enroll Course Before ${value.sale_end}*`
                });
            }
        }
        console.log(`Total courses posted: ${totalPosted}`);
        // Send the final message after all courses have been posted
        await sendMessageWTyping(from, {
            text: `✅ Successfully posted ${totalPosted} courses! 🎉📚\n\n𝙵𝚘𝚛 𝚖𝚘𝚛𝚎 𝙵𝚛𝚎𝚎 𝙲𝚘𝚞𝚛𝚜𝚎𝚜, 𝙹𝚘𝚒𝚗 𝚞𝚜! \n\n🌟 𝙴𝚡𝚙𝚕𝚘𝚛𝚎 𝚝𝚑𝚎 𝚆𝚘𝚛𝚕𝚍 𝚘𝚏 𝙺𝚗𝚘𝚠𝚕𝚎𝚍𝚐𝚎 𝚠𝚒𝚝𝚑 𝚄𝚜 \n\nhttps://chat.whatsapp.com/LVLRFlxL5T4JMsQFoOaouV'
        });
    } catch (err) {
        console.error("Error fetching courses from MongoDB:", err);
    }
};

module.exports.command = () => ({ cmd: ["free", "evil"], handler: sendCoursesFromDB });
