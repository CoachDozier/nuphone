const express = require("express");
const { OpenAI } = require("openai");
const { generate } = require("elevenlabs");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Create public directory for storing audio files
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// Serve static files from the public directory
app.use("/public", express.static(publicDir));

// Simple test endpoint
app.get("/test", (req, res) => {
    res.send("Server is running!");
});

// Endpoint to check if audio file exists
app.get("/check-audio", (req, res) => {
    if (fs.existsSync(path.join(publicDir, "output.mp3"))) {
        const stats = fs.statSync(path.join(publicDir, "output.mp3"));
        res.json({
            status: "ok",
            message: "Audio file exists",
            size: stats.size + " bytes",
            url: "/public/output.mp3"
        });
    } else {
        res.json({
            status: "error",
            message: "Audio file does not exist"
        });
    }
});

// Get the server URL for debugging
app.get("/server-info", (req, res) => {
    const host = req.get('host');
    const protocol = req.protocol;
    res.json({
        host: host,
        protocol: protocol,
        fullUrl: `${protocol}://${host}`,
        deploymentUrl: `https://${process.env.REPL_SLUG}.replit.app`,
        env: {
            REPL_SLUG: process.env.REPL_SLUG,
            REPL_OWNER: process.env.REPL_OWNER,
            REPL_ID: process.env.REPL_ID,
            NODE_ENV: process.env.NODE_ENV,
            REPLIT_DEPLOYMENT: process.env.REPLIT_DEPLOYMENT
        }
    });
});

// Simple endpoint to show just the Replit URL
app.get("/my-url", (req, res) => {
    const replitUrl = process.env.REPL_SLUG ? 
        `https://${process.env.REPL_SLUG}.replit.app` : 
        "Could not determine URL from environment variables";
    
    res.send(`Your Replit URL is: ${replitUrl}`);
});

app.post("/process-call", async (req, res) => {
    try {
        console.log("Received call from Twilio");

        const userSpeech = req.body.SpeechResult || "Hello";
        console.log("User said:", userSpeech);

        // Generate AI response
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "system", content: "You are a virtual receptionist." },
                       { role: "user", content: userSpeech }]
        });

        const aiText = aiResponse.choices[0].message.content;
        console.log("AI Response:", aiText);

        // Convert AI text to speech using ElevenLabs
        const audio = await generate({
            api_key: process.env.ELEVENLABS_API_KEY,
            text: aiText,
            voice: "Rachel",
            model_id: "eleven_monolingual_v1"
        });

        // Save the audio file to the public directory
        const audioPath = path.join(publicDir, "output.mp3");
        fs.writeFileSync(audioPath, audio);
        
        // Get the server URL dynamically
        const baseUrl = process.env.REPL_SLUG ? 
            `https://${process.env.REPL_SLUG}.replit.app` : 
            req.protocol + '://' + req.get('host');
        
        console.log("Using base URL:", baseUrl);
        
        res.set("Content-Type", "application/xml");
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
            <Response>
                <Play>${baseUrl}/public/output.mp3</Play>
            </Response>`);
    } catch (error) {
        console.error("Error in /process-call:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Home page
app.get("/", (req, res) => {
    res.send("AI Phone Answering System - Server is running!");
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).send("Internal Server Error: " + (err.message || "Unknown error"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Deployment URL: https://${process.env.REPL_SLUG}.replit.app`);
    console.log(`✅ Test URLs:`);
    console.log(`✅ /test - General server test`);
    console.log(`✅ /check-audio - Check if audio file exists`);
    console.log(`✅ /server-info - Get server URL information`);
    console.log(`✅ /my-url - Get Replit URL`);
});
