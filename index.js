const express = require("express");
const { OpenAI } = require("openai");
const { generate } = require("elevenlabs");
const fs = require("fs");

const app = express();
app.use(express.json());

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

        fs.writeFileSync("output.mp3", audio);

        res.send(`<?xml version="1.0" encoding="UTF-8"?>
            <Response>
                <Play>https://your-server-url/audio-response</Play>
            </Response>`);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`✅ Server running on port ${PORT}`));
