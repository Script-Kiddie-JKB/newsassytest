const mdClient = require("../../../mongodb"); // Import MongoDB client
const coursesCollection = mdClient.db("MyBotDataDB").collection("courses"); // Import courses collection
const postedCoursesCollection = mdClient.db("MyBotDataDB").collection("postedCourses"); // Import postedCourses collection

// Function to delete all courses from postedCourses collection and return the count of deleted courses
const deleteAllPostedCourses = async () => {
    try {
        const { deletedCount } = await postedCoursesCollection.deleteMany({});
        return { count: deletedCount };
    } catch (err) {
        console.error('❌ Error:', err);
        throw new Error("❌ Error occurred while deleting all posted courses.");
    }
};

// Function to delete all courses from courses collection and return the count of deleted courses
const deleteAllCourses = async () => {
    try {
        const { deletedCount } = await coursesCollection.deleteMany({});
        return { count: deletedCount };
    } catch (err) {
        console.error('❌ Error:', err);
        throw new Error("❌ Error occurred while deleting all courses.");
    }
};

// Handler for counting total courses and listing their names (latest first)
const countHandler = async (sock, msg, from, msgInfoObj) => {
    const { sendMessageWTyping } = msgInfoObj;
    try {
        const courses = await coursesCollection.find({}, { projection: { name: 1 } }).sort({ insertionTime: -1 }).toArray();
        const count = courses.length;

        let courseDetails = "📚 Total courses available: " + count;
        if (count > 0) {
            courseDetails += "\n\n📋 Course Details:\n";
            courses.forEach(course => {
                const { name } = course;
                courseDetails += `• 📖 ${name}\n`;
            });
        }

        sock.sendMessage(from, {
            text: courseDetails
        });
    } catch (err) {
        console.error('❌ Error:', err);
        sendMessageWTyping(from, {
            text: "❌ Error occurred while getting total courses count."
        });
    }
};

// Handler for deleting all posted courses
const deleteAllPostedHandler = async (sock, msg, from, msgInfoObj) => {
    const { sendMessageWTyping } = msgInfoObj;
    try {
        const { count } = await deleteAllPostedCourses();
        sock.sendMessage(from, {
            text: `🗑️ Deleted ${count} posted courses successfully.` // Sending acknowledgement message
        });
    } catch (err) {
        console.error('❌ Error:', err);
        sendMessageWTyping(from, {
            text: `❌ Error occurred while deleting all posted courses.` // Sending error message
        });
    }
};

// Handler for deleting all courses
const deleteAllHandler = async (sock, msg, from, msgInfoObj) => {
    const { sendMessageWTyping } = msgInfoObj;
    try {
        const { count } = await deleteAllCourses();
        sock.sendMessage(from, {
            text: `🗑️ Deleted ${count} courses successfully.` // Sending acknowledgement message
        });
    } catch (err) {
        console.error('❌ Error:', err);
        sendMessageWTyping(from, {
            text: `❌ Error occurred while deleting all courses.` // Sending error message
        });
    }
};

module.exports.command = () => [
    { cmd: ["cn"], handler: countHandler }, // Command to count total courses
    { cmd: ["cd"], handler: deleteAllHandler }, // Command to delete all courses
    { cmd: ["cpd"], handler: deleteAllPostedHandler } // Command to delete all posted courses
];
