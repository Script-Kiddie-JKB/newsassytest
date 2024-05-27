const mdClient = require("../../../mongodb"); // Import MongoDB client
const coursesCollection = mdClient.db("MyBotDataDB").collection("courses"); // Import courses collection

// Function to delete all courses and return the count of deleted courses
const deleteAllCourses = async () => {
    try {
        const { deletedCount } = await coursesCollection.deleteMany({});
        return { count: deletedCount, message: `🗑️ ${deletedCount} courses deleted successfully.` };
    } catch (err) {
        console.error('❌ Error:', err);
        throw new Error("❌ Error occurred while deleting all courses.");
    }
};

// Handler for counting total courses
const countHandler = async (sock, msg, from, msgInfoObj) => {
    const { sendMessageWTyping } = msgInfoObj;
    try {
        const count = await coursesCollection.countDocuments();
        sock.sendMessage(from, {
            text: `📚 Total courses available: ${count}`
        });
    } catch (err) {
        console.error('❌ Error:', err);
        sendMessageWTyping(from, {
            text: "❌ Error occurred while getting total courses count."
        });
    }
};

const deleteAllHandler = async (sock, msg, from, msgInfoObj) => {
    const { sendMessageWTyping } = msgInfoObj;
    try {
        const { count, message } = await deleteAllCourses();
        sock.sendMessage(from, {
            text: `✅ ${message} 📚 Total courses available: ${count}` // Sending confirmation message along with the count of deleted courses
        });
    } catch (err) {
        console.error('❌ Error:', err);
        sendMessageWTyping(from, {
            text: `❌ ${err.message}` // Sending error message
        });
    }
};


module.exports.command = () => [
    { cmd: ["cn"], handler: countHandler }, // Command to count total courses
    { cmd: ["cd"], handler: deleteAllHandler } // Command to delete all courses
];
