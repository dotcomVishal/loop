require('dotenv').config();
const pool = require('../db/config');
const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');

const uploadsong = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'No file provided' });

        const filepath = `/uploads/${file.filename}`;
        const absolutepath = path.join(__dirname, '..', filepath);

        let title = null;
        let artist = null;

        try {
            
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    
                    model: "meta-llama/llama-3.3-70b-instruct", 
                    temperature: 0.1,
                    messages: [
                        {
                            role: "system",
                            content: "Analyze the provided filename and return ONLY a valid raw JSON object with keys 'title' and 'artist'. Strip file extensions, track numbers, 'official audio', quality tags, or brackets. Do not wrap code blocks in markdown or provide conversational explanations. Example output: {\"title\": \"Blinding Lights\", \"artist\": \"The Weeknd\"}"
                        },
                        {
                            role: "user",
                            content: file.originalname
                        }
                    ]
                })
            });

            const data = await response.json();

            
            if (data.error) {
                console.error("OpenRouter API Error:", data.error.message);
            } else {
                const aiResponse = JSON.parse(data.choices[0].message.content.trim());
                console.log("AI Parsed Metadata:", aiResponse);
                title = aiResponse.title || null;
                artist = aiResponse.artist || null;
            }
        } catch (aiError) {
            console.error("AI parsing failed, moving to metadata fallback:", aiError.message);
        }

        if (!title || !artist) {
            try {
                const metadata = await mm.parseFile(absolutepath);
                if (!title) title = metadata.common.title || null;
                if (!artist) artist = metadata.common.artist || null;
            } catch (metaError) {
                console.error("Metadata parsing failed, moving to hard defaults:", metaError.message);
            }
        }

        if (!title) title = file.originalname || "Unknown Title";
        if (!artist) artist = "Unknown Artist";

        const querytext = 'INSERT INTO songs (title, artist, file_path) VALUES ($1, $2, $3) RETURNING *;';
        const values = [title, artist, filepath];
        const result = await pool.query(querytext, values);

        return res.status(201).json({
            message: "Song ingested successfully",
            song: result.rows[0]
        });

    } catch (error) {
        console.error('Ingestion pipeline failure:', error.message);
        return res.status(500).json({ error: "Internal server error during ingestion" });
    }
};

const deletesong = async(req,res)=>{
    try { 
        const {id} = req.params;

        const findquery = 'SELECT file_path FROM songs WHERE id = $1';
        const findresult = await pool.query(findquery, [id]);

        if (findresult.rows.length === 0){
            return res.status(400).json({ error : 'song not found'});
        }

        const relativepath = findresult.rows[0].file_path;
        const absolutepath = path.join(__dirname,'..',relativepath);

        if (fs.existsSync(absolutepath)) {
            fs.unlinkSync(absolutepath);
            console.log('file deleted');
        } else {
            console.log('file not found cannot delete');
        }

        const deletequery = 'DELETE FROM songs WHERE id = $1';
        await pool.query(deletequery, [id]);

        return res.status(200).json({ mesage : 'deletion complete'});
    } catch (error) {
        console.error('delete error : ', error.message);
        return res.status(500).json({error : 'internal server error while deletion'});
    }
};

const getallsongs = async (req, res) => {
    try {
        const querytext = 'SELECT * FROM songs ORDER BY created_at DESC;';
        const result = await pool.query(querytext);

        return res.status(200).json({
            count: result.rowCount, 
            songs: result.rows      
        });
    } catch (error) {
        console.error("Fetch Error:", error.message);
        return res.status(500).json({ error: "Failed to fetch songs from database" });
    }
};

module.exports = {
    getallsongs,
    uploadsong,
    deletesong
};
