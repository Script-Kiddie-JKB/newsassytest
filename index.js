const express = require("express");
const axios = require('axios');
const TinyURL = require('tinyurl');
const app = express();
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8000;
app.get("/", (req, res) => {
  res.send({
    message: "Bot is running.. :)",
    timestamp: new Date(),
  });
});

app.listen(port, () => {
  console.log("\nWeb-server running!\n");

  const host_url = process.env.HOST_URL || "";
  if (host_url == "") return;

  console.log("Pinging server every 15 minutes:", host_url);
  const pingServer = setInterval(() => {
    axios
      .get(host_url)
      .then((response) => {
        console.log("Initial self-request successful:", response.data.timestamp);
      })
      .catch((error) => {
        console.error("Initial self-request error:", error.message);
        clearInterval(pingServer);
      });
  }, 1000 * 60 * 15); // 15 minutes
});
//-------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------BAILEYS---------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//
const {
  default: makeWASocket,
  delay,
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  makeInMemoryStore,
  makeCacheableSignalKeyStore,
  isJidBroadcast,
} = require("@adiwajshing/baileys");

//-------------------------------------------------------------------------------------------------------------//
// logger to get logs on console
//-------------------------------------------------------------------------------------------------------------//
const P = require("pino");
const NodeCache = require("node-cache");
const cache = new NodeCache();
const msgRetryCounterMap = new NodeCache();
const logger = P({ level: "silent" });
// const logger = P({ level: "debug" });
//-------------------------------------------------------------------------------------------------------------//
// let MAIN_LOGGER = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` });
// let MAIN_LOGGER = require('@adiwajshing/baileys/lib/Utils/logger')
// const logger = MAIN_LOGGER.child({});
// logger.level = 'silent';
//-------------------------------------------------------------------------------------------------------------//

const store = makeInMemoryStore({ logger });
store?.readFromFile("./baileys_store_multi.json");
const interval2 = setInterval(() => {
  store?.writeToFile("./baileys_store_multi.json");
}, 1000 * 10);

//-------------------------------------------------------------------------------------------------------------//
const {
  createMembersData,
  getMemberData,
  member,
} = require("./mongo-DB/membersDataDb");
const {
  createGroupData,
  getGroupData,
  group,
} = require("./mongo-DB/groupDataDb");
const { getBotData, createBotData, bot } = require("./mongo-DB/botDataDb");
const { stickerForward, forwardGroup } = require("./stickerForward");
//-------------------------------------------------------------------------------------------------------------//
// loading functions and env variables
// -------------------------------------------------------------------------------------------------------------//
require("dotenv").config();
const { igApi } = require("insta-fetcher");
let ig;
const myNumber = process.env.myNumber + "@s.whatsapp.net";
const prefix = process.env.PREFIX || "-";
const moderatos = [
  "918318585418",
  `${process.env.myNumber}`,
  `${process.env.botNumber}`,
];
//-------------------------------------------------------------------------------------------------------------//
//Commands Adding
//-------------------------------------------------------------------------------------------------------------//
const fs = require("fs");
const util = require("util");
const readdir = util.promisify(fs.readdir);
// storing all commands
let commandsPublic = {},
  commandsMembers = {},
  commandsAdmins = {},
  commandsOwners = {};

const addCommands = async () => {
  let path = "./commands/public/";
  let filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".js")) {
      let { command } = require(path + file);
      let cmd_info = command();
      for (let c of cmd_info.cmd) {
        commandsPublic[c] = cmd_info.handler;
      }
    }
  });

  path = "./commands/group/members/";
  filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".js")) {
      let { command } = require(path + file);
      let cmd_info = command();
      for (let c of cmd_info.cmd) {
        commandsMembers[c] = cmd_info.handler;
      }
    }
  });

  path = "./commands/group/admins/";
  filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".js")) {
      let { command } = require(path + file);
      let cmd_info_list = command();

      if (Array.isArray(cmd_info_list)) {
        cmd_info_list.forEach(cmd_info => {
          cmd_info.cmd.forEach(c => {
            commandsAdmins[c] = cmd_info.handler;
          });
        });
      } else {
        cmd_info_list.cmd.forEach(c => {
          commandsAdmins[c] = cmd_info_list.handler;
        });
      }
    }
  });

  path = "./commands/owner/";
  filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".js")) {
      let { command } = require(path + file);
      let cmd_info_list = command();

      if (Array.isArray(cmd_info_list)) {
        cmd_info_list.forEach(cmd_info => {
          cmd_info.cmd.forEach(c => {
            commandsOwners[c] = cmd_info.handler;
          });
        });
      } else {
        cmd_info_list.cmd.forEach(c => {
          commandsOwners[c] = cmd_info_list.handler;
        });
      }
    }
  });

  //deleting the files .webp .jpeg .jpg .mp3 .mp4 .png
  path = "./";
  filenames = await readdir(path);
  filenames.forEach((file) => {
    if (
      file.endsWith(".webp") ||
      file.endsWith(".jpeg") ||
      file.endsWith(".mp3") ||
      file.endsWith(".mp4") ||
      file.endsWith(".jpg") ||
      file.endsWith(".png") ||
      file.endsWith(".gif")
    ) {
      fs.unlinkSync(path + file);
    }
  });
};

//-------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------DATABASE-------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//
const mdClient = require("./mongodb");
//-------------------------------------------------------------------------------------------------------------//
// important to get new qr code after connection logout
//-------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//
// fetching auth function from database
//-------------------------------------------------------------------------------------------------------------//
const authNameInDatabase = "auth";
async function fetchAuth(type) {
  if (type == "logout" || type == "error") {
    fs.rmSync("baileys_auth_info/creds.json", {
      recursive: true,
      force: true,
    });
    fs.rmSync("baileys_store_multi.json", {
      recursive: true,
      force: true,
    });
  }
  try {
    if (!fs.existsSync("./baileys_auth_info")) {
      fs.mkdirSync("./baileys_auth_info");
    }
    let collection = mdClient.db("MyBotDataDB").collection("AuthTable");
    await collection.findOne({ _id: authNameInDatabase }).then(async (res) => {
      if (res == null) {
        console.log("Auth not found in database");
        await collection.insertOne({
          _id: authNameInDatabase,
          sessionAuth: "",
        });
      }
    });
    let result = await collection.findOne({ _id: authNameInDatabase });
    let sessionAuth = result["sessionAuth"];
    if (sessionAuth != "") {
      sessionAuth = JSON.parse(sessionAuth);
      sessionAuth = JSON.stringify(sessionAuth);
      if (type == "start") {
        fs.writeFileSync("baileys_auth_info/creds.json", sessionAuth);
      } else if (type == "reconnecting") {
        console.log("Auth already written");
      }
    } else {
      console.log("Session Auth Empty");
    }
  } catch (err) {
    console.error("Local file writing errors:", err);
  }
}
//-------------------------------------------------------------------------------------------------------------//
// updating auth function in database
//-------------------------------------------------------------------------------------------------------------//
async function updateLogin() {
  let collection = mdClient.db("MyBotDataDB").collection("AuthTable");
  try {
    let sessionDataAuth = fs.readFileSync("baileys_auth_info/creds.json");
    sessionDataAuth = JSON.parse(sessionDataAuth);
    sessionDataAuth = JSON.stringify(sessionDataAuth);
    collection.updateOne(
      { _id: authNameInDatabase },
      { $set: { sessionAuth: sessionDataAuth } }
    );
    // console.log("Db updated");
  } catch (err) {
    console.log("Db updating error : ", err);
  }
}
//----------------------------------------------ADMIN----------------------------------------------------------//
const getGroupAdmins = (participants) =>
  participants
    .filter((i) => i.admin === "admin" || i.admin === "superadmin")
    .map((i) => i.id);
//-------------------------------------------------------------------------------------------------------------//
try {
  fs.rmSync("./baileys_auth_info/creds.json", { recursive: true, force: true });
  fs.rmSync("./baileys_store_multi.json", { recursive: true, force: true });
} catch (err) {
  console.log("Local auth file already deleted");
}
//-------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------MAIN-FUNCTION-------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//
const startSock = async (connectionType) => {
  await addCommands();
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}\n`);

  console.log("ConnectType:", connectionType);
  await fetchAuth(connectionType);

  const { state, saveCreds } = await useMultiFileAuthState("baileys_auth_info");

  const sock = makeWASocket({
    version,
    // logger: P({ level: 'debug' }),
    logger,
    printQRInTerminal: true,
    // auth: state,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    msgRetryCounterMap,
    // keepAliveIntervalMs: 0,
    // defaultQueryTimeoutMs: undefined,
    generateHighQualityLinkPreview: true,
    shouldIgnoreJid: (jid) => isJidBroadcast(jid),
    getMessage,
  });
  store?.bind(sock.ev);
  //-------------------------------------------------------------------------------------------------------------//
  let interval1 = setInterval(() => {
    updateLogin();
  }, 1000 * 30);

  //-------------------------------SendMessageWTyping------------------------------------------------------------//
  const sendMessageWTyping = async (jid, option1, option2) => {
    await sock.presenceSubscribe(jid);
    await delay(500);

    await sock.sendPresenceUpdate("composing", jid);
    await delay(2000);

    await sock.sendPresenceUpdate("paused", jid);
    // try {
    await sock.sendMessage(jid, option1, {
      ...option2,
      mediaUploadTimeoutMs: 1000 * 60 * 60,
    });
    // } catch (err) {
    // console.log("Send Message Error:", err);
    // }
  };

const coursesCollection = mdClient.db("MyBotDataDB").collection("courses");

const sendCourse = async (course) => {
  const evilzone = "917887499710-1569411053@g.us";

  try {
    const shortLink = await TinyURL.shorten(course.url);

    if (course.image) {
      const response = await axios({
        url: course.image,
        method: 'GET',
        responseType: 'arraybuffer'
      });

      await sendMessageWTyping(evilzone, {
        image: response.data,
        caption: `📘 *Course:* ${course.name}\n\n📖 *Description:* ${course.shoer_description}\n\n🔗 *Enroll:* ${shortLink}\n\n🕒 *Enroll Course Before ${course.sale_end}*`
      });
    } else {
      await sendMessageWTyping(evilzone, {
        text: `📘 *Course:* ${course.name}\n\n📖 *Description:* ${course.shoer_description}\n\n🔗 *Enroll:* ${shortLink}\n\n🕒 *Enroll Course Before ${course.sale_end}*`
      });
    }
    
    console.log(`✅ Sent course: ${course.name}`);
  } catch (err) {
    console.error('❌ Error sending course:', err);
  }
};

const fetchAndSendCourses = async () => {
  try {
    const new_order = 'date';
    const new_page = 1;
    const per_page = 10;
    const arg_free = 1;
    const arg_keyword = "";
    const arg_language = "";

    const res = await axios.get(`https://www.real.discount/api/all-courses/?store=Udemy&page=${new_page}&per_page=${per_page}&orderby=${new_order}&free=${arg_free}&search=${arg_keyword}&language=${arg_language}`);
    const courses = res.data.results.filter(course => course.language === "English");

    console.log(`✨ Fetched ${courses.length} courses from the API`);

    const existingCourses = await coursesCollection.find({}).toArray();
    const newCourses = courses.filter(course => !existingCourses.some(existingCourse => existingCourse.url === course.url));

    if (newCourses.length > 0) {
      for (const course of newCourses) {
        await coursesCollection.insertOne(course);
        console.log(`📦 Stored course: ${course.name} in MongoDB`);

        // Post the course just after inserting it into the database
        await sendCourse(course);
      }
    } else {
      console.log("🚫 No new courses found");
    }

  } catch (err) {
    console.error("❌ Error fetching and storing courses:", err);
  }
};

// Initial execution
fetchAndSendCourses();

// Set interval to fetch and send courses every 1 minute
setInterval(fetchAndSendCourses, 1 * 60 * 1000);

  //-------------------------------------------------------------------------------------------------------------//
  const fake_quoted = (anu, message) => {
    return {
      key: {
        remoteJid: anu.id,
        fromMe: false,
        id: "810B5GH29EE7481fakeid",
        participant: "0@s.whatsapp.net",
      },
      messageTimestamp: 1122334455,
      pushName: "WhatsApp",
      message: { conversation: message },
    };
  };
  //-------------------------------------------------------------------------------------------------------------//
  const arrMeg = [];
  const readmes = setInterval(async () => {
    if (arrMeg.length > 0) msgHandler(arrMeg.shift());
  }, 500);
  //-------------------------------------------------------------------------------------------------------------//
  const msgHandler = async (msg) => {
    const ownerSend = (mess) => {
      try {
        sock.sendMessage(myNumber, {
          text: mess,
          mentions: msg.message.extendedTextMessage
            ? msg.message.extendedTextMessage.contextInfo.mentionedJid
            : "",
        });
      } catch {
        sock.sendMessage(myNumber, { text: mess });
      }
    };
    //-------------------------------------------------------------------------------------------------------------//
    const from = msg.key.remoteJid;
    const content = JSON.stringify(msg.message);
    const type = Object.keys(msg.message)[0];
    //-------------------------------------------------------------------------------------------------------------//
    if (type === "stickerMessage" && forwardGroup != "") {
      stickerForward(sock, msg, from);
    }
    //-------------------------------------------------------------------------------------------------------------//
    let botNumberJid = sock.user.id;
    botNumberJid = botNumberJid.includes(":")
      ? botNumberJid.split(":")[0] + "@s.whatsapp.net"
      : botNumberJid;
    //-------------------------------------------------------------------------------------------------------------//
    //--------------------------------------------------BODY-------------------------------------------------------//
    //-------------------------------------------------------------------------------------------------------------//
    let body =
      type === "conversation"
        ? msg.message.conversation
        : type == "imageMessage" && msg.message.imageMessage.caption
          ? msg.message.imageMessage.caption
          : type == "videoMessage" && msg.message.videoMessage.caption
            ? msg.message.videoMessage.caption
            : type == "extendedTextMessage" && msg.message.extendedTextMessage.text
              ? msg.message.extendedTextMessage.text
              : type == "buttonsResponseMessage"
                ? msg.message.buttonsResponseMessage.selectedDisplayText
                : type == "templateButtonReplyMessage"
                  ? msg.message.templateButtonReplyMessage.selectedDisplayText
                  : type == "listResponseMessage"
                    ? msg.message.listResponseMessage.title
                    : "";
    //-------------------------------------------------------------------------------------------------------------//
    //-------------------------------------------------------------------------------------------------------------//
    //-------------------------------------------------------------------------------------------------------------//
    if (type == "buttonsResponseMessage") {
      if (msg.message.buttonsResponseMessage.selectedButtonId == "eva")
        body = body.startsWith(prefix) ? body : prefix + body;
    } else if (type == "templateButtonReplyMessage") {
      body = body.startsWith(prefix) ? body : prefix + body;
    } else if (type == "listResponseMessage") {
      if (
        msg.message.listResponseMessage.singleSelectReply.selectedRowId == "eva"
      )
        body = body.startsWith(prefix) ? body : prefix + body;
    }
    //-------------------------------------------------------------------------------------------------------------//
    if (body[1] == " ") body = body[0] + body.slice(2);
    const evv = body.trim().split(/ +/).slice(1).join(" ");
    const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    //-------------------------------------------------------------------------------------------------------------//
    const isCmd = body.startsWith(prefix);
    if (!isCmd && (type == "videoMessage" || type == "stickerMessage")) return;
    //-------------------------------------------------------------------------------------------------------------//
    const isGroup = from.endsWith("@g.us");
    const senderJid = isGroup ? msg.key.participant : msg.key.remoteJid;
    //--------------------------------------------------Count------------------------------------------------------//
    const updateId = msg.key.fromMe ? botNumberJid : senderJid;
    const updateName = msg.key.fromMe ? sock.user.name : msg.pushName;
    if (type == "conversation" || type == "extendedTextMessage") {
      member.updateOne(
        { _id: updateId },
        { $inc: { totalmsg: 1 } },
        { $set: { username: updateName } }
      ); //19-10-2022
      createMembersData(updateId, updateName);
    }
    //-------------------------------------------------------------------------------------------------------------//
    let groupMetadata = "";
    if (isGroup && (type == "conversation" || type == "extendedTextMessage")) {
      groupMetadata = cache.get(from + ":groupMetadata");
      if (!groupMetadata) {
        groupMetadata = await sock.groupMetadata(from);
        const success = cache.set(
          from + ":groupMetadata",
          groupMetadata,
          60 * 60
        );
        createGroupData(from, groupMetadata);
      }
      group
        .updateOne(
          { _id: from, "members.id": updateId },
          {
            $inc: { "members.$.count": 1 },
            $set: { "members.$.name": updateName },
          }
        )
        .then((r) => {
          if (r.matchedCount == 0) {
            group.updateOne(
              { _id: from },
              {
                $push: {
                  members: { id: updateId, name: updateName, count: 1 },
                },
              }
            );
          }
        });
      group.updateOne({ _id: from }, { $inc: { totalMsgCount: 1 } }); //19-10-2022
    }
    //-------------------------------------------------------------------------------------------------------------//
    if (msg.message.extendedTextMessage) {
      if (
        msg.message.extendedTextMessage.contextInfo?.mentionedJid ==
        botNumberJid
      ) {
        sock.sendMessage(
          from,
          { sticker: fs.readFileSync("./media/tag.webp") },
          { quoted: msg }
        );
      }
    }
    //--------------------------------------------------SENDER-----------------------------------------------------//
    const senderNumber = senderJid.includes(":")
      ? senderJid.split(":")[0]
      : senderJid.split("@")[0];
    const senderData = await getMemberData(senderJid);
    const groupData = isGroup ? await getGroupData(from) : "";
    //-------------------------------------------------------------------------------------------------------------//
    if (isGroup && type == "imageMessage" && groupData?.isAutoStickerOn) {
      if (msg.message.imageMessage.caption == "") {
        console.log("Sticker Created");
        commandsPublic["sticker"](sock, msg, from, args, {
          senderJid,
          type,
          content,
          isGroup,
          sendMessageWTyping,
          evv,
        });
      }
    }
    //---------------------------------------------IS-BLOCK--------------------------------------------------------//
    if (senderData?.isBlock) return;
    //-------------------------------------------------ChatBot-----------------------------------------------------//
    if (type == "conversation" || type == "extendedTextMessage") {
      if (
        body.split(" ")[0].toLowerCase() == "eva" ||
        body.split(" ")[0].toLowerCase() == "gemini"
      ) {
        if (senderData?.isBlock)
          return ownerSend("User Blocked : " + senderJid);
        const isChatBotOn = groupData ? groupData.isChatBotOn : false;
        if (isChatBotOn) {
          commandsPublic["eva"](sock, msg, from, args, {
            evv,
            sendMessageWTyping,
            isGroup,
          });
        }
      }
    }
    //---------------------------------------------------NO-CMD----------------------------------------------------//
    if (!isCmd) return;
    //-------------------------------------------------READ-SEEN---------------------------------------------------//
    await sock.readMessages([msg.key]);
    //------------------------------------------------GROUP-DATA---------------------------------------------------//
    const groupAdmins = isGroup
      ? getGroupAdmins(groupMetadata.participants)
      : "";
    const isGroupAdmin = groupAdmins.includes(senderJid) || false;
    // const groupData = isGroup ? await getGroupData(from) : "";
    //-------------------------------------------------------------------------------------------------------------//
    if (["idp", "dp", "insta", "i", "ig"].includes(command)) {
      const botData = await getBotData();
      ig = new igApi(botData.instaSession_id);
    }
    //-------------------------------------------------------------------------------------------------------------//
    const msgInfoObj = {
      prefix,
      type,
      content,
      evv,
      command,
      isGroup,
      ig,
      senderJid,
      groupMetadata,
      groupAdmins,
      botNumberJid,
      sendMessageWTyping,
      ownerSend,
    };
    //-------------------------------------------------------------------------------------------------------------//
    console.log(
      "[COMMAND]",
      command,
      "[FROM]",
      senderNumber,
      "[name]",
      msg.pushName,
      "[IN]",
      isGroup ? groupMetadata.subject : "Directs"
    );
    ownerSend(
      `📝: ${prefix}${command} by ${msg.pushName}(+${senderNumber}) in ${isGroup ? groupMetadata.subject : "DM"
      }`
    );
    //-------------------------------------------------BLOCK-CMDs--------------------------------------------------//
    if (isGroup) {
      let resBotOn = groupData ? await groupData.isBotOn : false;

      if (
        resBotOn == false &&
        !(command.startsWith("group") || command.startsWith("dev"))
      )
        return sendMessageWTyping(from, {
          text:
            "```By default, bot is turned off in this group.\nAsk the Owner to activate.\n\nUse ```" +
            prefix +
            "dev",
        });
      let blockCommandsInDB = await groupData?.cmdBlocked;
      if (command != "") {
        if (blockCommandsInDB.includes(command)) {
          return sendMessageWTyping(
            from,
            { text: `Command blocked for this group.` },
            { quoted: msg }
          );
        }
      }
    }
    //-------------------------------------------------------------------------------------------------------------//
    //---------------------------------------------------COMMANDS--------------------------------------------------//
    //-------------------------------------------------------------------------------------------------------------//

    if (commandsPublic[command]) {
      return commandsPublic[command](sock, msg, from, args, msgInfoObj);
    } else if (commandsMembers[command]) {
      if (isGroup || msg.key.fromMe) {
        return commandsMembers[command](sock, msg, from, args, msgInfoObj);
      } else {
        return sendMessageWTyping(
          from,
          { text: "```❌ This command is only applicable in Groups!```" },
          { quoted: msg }
        );
      }
    } else if (commandsAdmins[command]) {

      if (!isGroup) {
        return sendMessageWTyping(
          from,
          { text: "```❌ This command is only applicable in Groups!```" },
          { quoted: msg }
        );
      } else if (isGroupAdmin || moderatos.includes(senderNumber)) {
        return commandsAdmins[command](sock, msg, from, args, msgInfoObj);
      } else {
        return sendMessageWTyping(
          from,
          { text: "```🤭 kya matlab tum admin nhi ho.```" },
          { quoted: msg }
        );
      }
    } else if (commandsOwners[command]) {
      if (moderatos.includes(senderNumber) || myNumber == senderJid) {
        return commandsOwners[command](sock, msg, from, args, msgInfoObj);
      } else {
        return sendMessageWTyping(
          from,
          { text: "```🤭 kya matlab tum mere owner nhi ho.```" },
          { quoted: msg }
        );
      }
    } else {
      return sendMessageWTyping(
        from,
        { text: "```" + msg.pushName + " !!Use " + prefix + "help ```" },
        { quoted: msg }
      );
    }
  };
  //---------------------------------Loading-Events---------------------------------------------------------------//
  sock.ev.process(async (events) => {
    //-------------------------------------------------------------------------------------------------------------//
    if (events["connection.update"]) {
      const update = events["connection.update"];
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        console.log(
          lastDisconnect.error.output.statusCode,
          DisconnectReason.loggedOut
        );

        if (
          lastDisconnect.error.output.statusCode == DisconnectReason.loggedOut
        ) {
          try {
            let path = "./baileys_auth_info/";
            let filenames = await readdir(path);
            filenames.forEach((file) => {
              fs.unlinkSync(path + file);
            });
          } catch { }
          clearInterval(interval1);
          clearInterval(interval2);
          // reconnect if not logged out
          startSock("logout");
        } else if (lastDisconnect.error.output.statusCode == 515) {
          startSock("reconnecting");
        } else if (lastDisconnect.error.output.statusCode == 403) {
          startSock("error");
        } else {
          startSock();
        }
      }
      console.log("connection update", update);
    }
    //-------------------------------------------------------------------------------------------------------------//
    if (events["creds.update"]) {
      await saveCreds();
    }
    //-------------------------------------------------------------------------------------------------------------//
    if (events["messages.upsert"]) {
      const upsert = events["messages.upsert"];
      for (const msg of upsert.messages) {
        if (!msg.message) return;
        // await msgHandler(msg);
        arrMeg.push(msg);
      }
      6;
    }
    //-------------------------------------------------------------------------------------------------------------//
    if (events["groups.upsert"]) {
      const msg = events["groups.upsert"];
      createGroupData(msg[0].id, sock.groupMetadata(msg[0].id));

      group.updateOne({ _id: msg[0].id }, { $set: { isBotOn: false } });
      await sock.sendMessage(msg[0].id, {
        text:
          "*Thank You For Adding Me In This Group.*\n" +
          "*If You Want To Use This Bot Ask The Owner To Activate It, Please Type " +
          prefix +
          "dev*",
      });
      try {
        const from = msg[0].id;
        cache.del(from + ":groupMetadata");
      } catch (err) {
        console.log(err);
      }
    }
    //-------------------------------------------------------------------------------------------------------------//
    if (events["groups.update"]) {
      const msg = events["groups.update"];
      try {
        console.log("[groups.update]");
        const from = msg[0].id;
        cache.del(from + ":groupMetadata");
      } catch (err) {
        console.log(err);
      }
    }
    //-------------------------------------------------------------------------------------------------------------//
    if (events["group-participants.update"]) {
      const anu = events["group-participants.update"];
      let groupDataDB = await getGroupData(anu.id);
      cache.del(anu.id + ":groupMetadata");

      if (anu.action == "add") {
        //Welcome Message
        if (groupDataDB.welcome != "") {
          // const wel_members = anu.participants.map((mem) => mem.split("@")[0]);
          anu.participants.forEach((member) => {
            sock.sendMessage(
              anu.id,
              {
                text:
                  "Welcome @" +
                  member.split("@")[0] +
                  "\n\n" +
                  groupDataDB.welcome,
                mentions: [member],
              },
              {
                quoted: fake_quoted(anu, "Welcome to " + groupDataDB.grpName),
              }
            );
          });
        }
        //91Only Working
        if (
          groupDataDB.is91Only == true &&
          !anu.participants[0].startsWith("91")
        ) {
          await sock.sendMessage(
            anu.id,
            {
              text: "```Only Indian Number Allowed In This Group.\n```",
            },
            {
              quoted: fake_quoted(anu, "Only Indian Number Allowed, Namaste"),
            }
          );
          sock.groupParticipantsUpdate(anu.id, [anu.participants[0]], "remove");
        }
        sock.sendMessage(myNumber, {
          text: `*Action:* ${anu.action}\n*Group:* ${anu.id}\n*Group Name:* ${groupDataDB?.grpName}\n*Participants:* ${anu.participants[0]}`,
        });
      } else {
        sock.sendMessage(myNumber, {
          text: `*Action:* ${anu.action}\n*Group:* ${anu.id}\n*Group Name:* ${groupDataDB?.grpName}\n*Participants:* ${anu.participants[0]}`,
        });
      }
      console.log(anu);
    }
    //-------------------------------------------------------------------------------------------------------------//
  });
  //-------------------------------------------------------------------------------------------------------------//
  return sock;
  //-------------------------------------------------------------------------------------------------------------//
  async function getMessage(key) {
    if (store) {
      const msg = await store.loadMessage(key.remoteJid, key.id);
      return msg?.message || undefined;
    }
    return proto.Message.fromObject({});
  }
};
//-------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//
startSock("start"); // calling the main function
//-------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: ", p, "reason:", reason);
});
//-------------------------------------------------------------------------------------------------------------//
process.on("uncaughtException", function (err) {
  console.log(err);
});
//-------------------------------------------------------------------------------------------------------------//
