/*
const express = require('express');
const fs = require('fs-extra');
let router = express.Router();
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const MESSAGE = process.env.MESSAGE || `
🔥 𝐊ąìʂҽղ-𝐌𝐃 | 𝐒𝐞𝐬𝐬𝐢𝐨𝐧 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 ✅
🔥 Your Bot is Now Alive, Royal & Ready to Rock! 🔥
━━━━━━━━━━━━━━━━━━━━━━
🟢 Session pair code Successfully ✅
🔗 Connect for Instant Support & Royal Help:
📌 WhatsApp Group:
https://chat.whatsapp.com/Ja7bWhgrFkc3V67yBjchM2
━━━━━━━━━━━━━━━━━━━━━━
📦 GitHub Repo — Star It For Power Boost!
✴️ 𝐊ąìʂҽղ-𝐌𝐃 GitHub:
🪂github.com/sumon9836/KAISEN-MD.git
━━━━━━━━━━━━━━━━━━━━━━
🚀 Deploy Your Royal Bot Now
👑 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲: 𝐋𝐨𝐯𝐞𝐥𝐲-𝐁𝐨𝐲.𝐱.𝐒𝐮𝐦𝐨𝐧
🍉 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲: 𝐊ąìʂҽղ 𝐈𝐧𝐭𝐞𝐥 𝐂𝐨𝐫𝐞™
✨ Deploy & Rule Like a True Legend
━━━━━━━━━━━━━━━━━━━━━━
📝 Royal Quote of the Bot:

> “𝐁𝐨𝐭 𝐁𝐲 𝐍𝐚𝐦𝐞, 𝐋𝐞𝐠𝐞𝐧𝐝 𝐁𝐲 𝐅𝐚𝐦𝐞”
— Royalty Runs in the Code
━━━━━━━━━━━━━━━━━━━━━━
🦾 𝐊ąìʂҽղ_𝐌𝐃 || 𝐒𝐚𝐦𝐢𝐧_𝐒𝐮𝐦𝐨𝐧 || 𝐑𝐨𝐲𝐚𝐥𝐁𝐨𝐭
`;

const { upload } = require('./mega');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    DisconnectReason
} = require("@whiskeysockets/baileys");

// Ensure the directory is empty when the app starts
if (fs.existsSync('./auth_info_baileys')) {
    fs.emptyDirSync(__dirname + '/auth_info_baileys');
}

router.get('/', async (req, res) => {
    let num = req.query.number;

    async function SUHAIL() {
        const { state, saveCreds } = await useMultiFileAuthState(`./auth_info_baileys`);
        try {
            let Smd = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.macOS("Safari"),
            });

            if (!Smd.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Smd.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Smd.ev.on('creds.update', saveCreds);
            Smd.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === "open") {
                    try {
                        await delay(10000);
                        if (fs.existsSync('./auth_info_baileys/creds.json'));

                        const auth_path = './auth_info_baileys/';
                        let user = Smd.user.id;

                        // Define randomMegaId function to generate random IDs
                        function randomMegaId(length = 6, numberLength = 4) {
                            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                            let result = '';
                            for (let i = 0; i < length; i++) {
                                result += characters.charAt(Math.floor(Math.random() * characters.length));
                            }
                            const number = Math.floor(Math.random() * Math.pow(10, numberLength));
                            return `${result}${number}`;
                        }

                        // Upload credentials to Mega
                        const mega_url = await upload(fs.createReadStream(auth_path + 'creds.json'), `${randomMegaId()}.json`);
                        const Id_session = mega_url.replace('https://mega.nz/file/', '');

                        const Scan_Id = Id_session;

                        let msgsss = await Smd.sendMessage(user, { text: "KAISEN~" + Scan_Id });
                        await Smd.sendMessage(user, { text: MESSAGE }, { quoted: msgsss });
                        await delay(1000);
                        try { await fs.emptyDirSync(__dirname + '/auth_info_baileys'); } catch (e) {}

                    } catch (e) {
                        console.log("Error during file upload or message send: ", e);
                    }

                    await delay(100);
                    await fs.emptyDirSync(__dirname + '/auth_info_baileys');
                }

                // Handle connection closures
                if (connection === "close") {
                    let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                    if (reason === DisconnectReason.connectionClosed) {
                        console.log("Connection closed!");
                    } else if (reason === DisconnectReason.connectionLost) {
                        console.log("Connection Lost from Server!");
                    } else if (reason === DisconnectReason.restartRequired) {
                        console.log("Restart Required, Restarting...");
                        SUHAIL().catch(err => console.log(err));
                    } else if (reason === DisconnectReason.timedOut) {
                        console.log("Connection TimedOut!");
                    } else {
                        console.log('Connection closed with bot. Please run again.');
                        console.log(reason);
                        await delay(5000);
                        exec('pm2 restart qasim');
                    }
                }
            });

        } catch (err) {
            console.log("Error in SUHAIL function: ", err);
            exec('pm2 restart qasim');
            console.log("Service restarted due to error");
            SUHAIL();
            await fs.emptyDirSync(__dirname + '/auth_info_baileys');
            if (!res.headersSent) {
                await res.send({ code: "Try After Few Minutes" });
            }
        }
    }

    await SUHAIL();
});

module.exports = router;
*/
const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const { exec } = require('child_process');

// Environment configuration
const MESSAGE = process.env.MESSAGE || `
🔥 𝐊ąìʂҽղ-𝐌𝐃 | 𝐒𝐞𝐬𝐬𝐢𝐨𝐧 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 ✅
🔥 Your Bot is Now Alive, Royal & Ready to Rock! 🔥
━━━━━━━━━━━━━━━━━━━━━━
🟢 Session pair code Successfully ✅
🔗 Connect for Instant Support & Royal Help:
📌 WhatsApp Group:
https://chat.whatsapp.com/Ja7bWhgrFkc3V67yBjchM2
━━━━━━━━━━━━━━━━━━━━━━
📦 GitHub Repo — Star It For Power Boost!
✴️ 𝐊ąìʂҽղ-𝐌𝐃 GitHub:
🪂github.com/sumon9836/KAISEN-MD.git
━━━━━━━━━━━━━━━━━━━━━━
🚀 Deploy Your Royal Bot Now
👑 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲: 𝐋𝐨𝐯𝐞𝐥𝐲-𝐁𝐨𝐲.𝐱.𝐒𝐮𝐦𝐨𝐧
🍉 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲: 𝐊ąìʂҽղ 𝐈𝐧𝐭𝐞𝐥 𝐂𝐨𝐫𝐞™
✨ Deploy & Rule Like a True Legend
━━━━━━━━━━━━━━━━━━━━━━
📝 Royal Quote of the Bot:

> "𝐁𝐨𝐭 𝐁𝐲 𝐍𝐚𝐦𝐞, 𝐋𝐞𝐠𝐞𝐧𝐝 𝐁𝐲 𝐅𝐚𝐦𝐞"
— Royalty Runs in the Code
━━━━━━━━━━━━━━━━━━━━━━
🦾 𝐊ąìʂҽղ_𝐌𝐃 || 𝐒𝐚𝐦𝐢𝐧_𝐒𝐮𝐦𝐨𝐧 || 𝐑𝐨𝐲𝐚𝐥𝐁𝐨𝐭
`;

const { upload } = require('./mega');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    DisconnectReason
} = require('@whiskeysockets/baileys');

// Constants
const AUTH_DIR = path.join(__dirname, 'auth_info_baileys');
const RECONNECT_DELAY = 5000; // 5 seconds
const INITIAL_DELAY = 1500; // 1.5 seconds

// Ensure clean auth directory on startup
async function initializeAuthDirectory() {
    try {
        if (await fs.pathExists(AUTH_DIR)) {
            await fs.emptyDir(AUTH_DIR);
        } else {
            await fs.mkdir(AUTH_DIR, { recursive: true });
        }
    } catch (error) {
        console.error('Failed to initialize auth directory:', error);
        throw error;
    }
}

// Helper function to generate random IDs
function generateRandomId(length = 6, numberLength = 4) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    const number = Math.floor(Math.random() * Math.pow(10, numberLength))
        .toString()
        .padStart(numberLength, '0');
    
    return `${result}${number}`;
}

// Handle connection events
async function handleConnectionEvents(socket, saveCreds, res) {
    socket.ev.on('creds.update', saveCreds);
    
    socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            try {
                await delay(10000); // Wait for 10 seconds after connection
                
                if (await fs.pathExists(path.join(AUTH_DIR, 'creds.json'))) {
                    const randomId = generateRandomId();
                    const megaUrl = await upload(
                        fs.createReadStream(path.join(AUTH_DIR, 'creds.json')),
                        `${randomId}.json`
                    );
                    
                    const sessionId = megaUrl.replace('https://mega.nz/file/', '');
                    const user = socket.user?.id;

                    if (user) {
                        const confirmationMsg = await socket.sendMessage(user, { text: "KAISEN~" + sessionId });
                        await socket.sendMessage(user, { text: MESSAGE }, { quoted: confirmationMsg });
                    }
                }
            } catch (error) {
                console.error('Error during post-connection setup:', error);
            } finally {
                try {
                    await fs.emptyDir(AUTH_DIR);
                } catch (error) {
                    console.error('Error cleaning auth directory:', error);
                }
            }
        }

        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            
            switch (reason) {
                case DisconnectReason.connectionClosed:
                    console.log('Connection closed!');
                    break;
                case DisconnectReason.connectionLost:
                    console.log('Connection lost from server!');
                    break;
                case DisconnectReason.restartRequired:
                    console.log('Restart required, restarting...');
                    break;
                case DisconnectReason.timedOut:
                    console.log('Connection timed out!');
                    break;
                default:
                    console.log(`Connection closed with reason code: ${reason}`);
            }

            // Attempt to restart the service
            await delay(RECONNECT_DELAY);
            exec('pm2 restart qasim', (error) => {
                if (error) {
                    console.error('Failed to restart service:', error);
                }
            });
        }
    });
}

// Main route handler
router.get('/', async (req, res) => {
    const { number } = req.query;
    
    if (!number) {
        return res.status(400).send({ error: 'Phone number is required' });
    }

    try {
        await initializeAuthDirectory();
        
        const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
        const socket = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
            },
            printQRInTerminal: false,
            logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
            browser: Browsers.macOS('Safari'),
        });

        if (!socket.authState.creds.registered) {
            await delay(INITIAL_DELAY);
            const cleanNumber = number.replace(/[^0-9]/g, '');
            const pairingCode = await socket.requestPairingCode(cleanNumber);
            
            if (!res.headersSent) {
                return res.send({ code: pairingCode });
            }
        }

        await handleConnectionEvents(socket, saveCreds, res);
    } catch (error) {
        console.error('Error in session setup:', error);
        
        try {
            await fs.emptyDir(AUTH_DIR);
        } catch (cleanupError) {
            console.error('Failed to clean auth directory:', cleanupError);
        }

        if (!res.headersSent) {
            res.status(500).send({ error: 'Failed to setup session', details: error.message });
        }

        // Attempt to restart the service
        exec('pm2 restart qasim', (execError) => {
            if (execError) {
                console.error('Failed to restart service:', execError);
            }
        });
    }
});

module.exports = router;
                    
