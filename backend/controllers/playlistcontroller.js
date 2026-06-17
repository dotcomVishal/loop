const pool = require('../db/config');

const createPlaylist = async (req,res) => {
    try {
        const { name } = req.body;
        const userId = req.user.userId;

        if (!name) return res.status(400).json({ error: "Playlist name is required" });

        const result = await pool.query(
            'INSERT INTO playlists (name, user_id) VALUES ($1, $2) RETURNING *;',
            [name, userId]
        );

        res.status(201).json({ playlist: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Failed to create playlist" });
    }
};


const getUserPlaylists = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await pool.query(
            'SELECT * FROM playlists WHERE user_id = $1 ORDER BY created_at DESC;',
            [userId]
        );
        res.status(200).json({ playlists: result.rows });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch playlists" });
    }
};

const addSongToPlaylist = async (req, res) =>{
    try {
        const {playlistId,songId} = req.body;

        const userId = req.user.userId;


        const checkOwner = await pool.query('SELECT id FROM playlists WHERE id = $1 AND user_id = $2', [playlistId, userId]);
        if (checkOwner.rows.length === 0) {
            return res.status(403).json({ error: "Unauthorized or playlist not found" });
        }

        await pool.query(
            'INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2);',
            [playlistId, songId]
        );

        res.status(201).json({message:'Song added to playlist'});


    } catch (error){
        if (error.code === '23505') { 
            return res.status(400).json({ error: "Song is already in this playlist" });
        }
        res.status(500).json({error : 'Failed to add song'});
    }
};

const getPlaylistSongs = async (req, res) => {
    try {
        const playlistId = req.params.id;
        const userId = req.user.userId;

        const checkOwner = await pool.query('SELECT name FROM playlists WHERE id = $1 AND user_id = $2', [playlistId, userId]);
        if (checkOwner.rows.length === 0) {
            return res.status(403).json({ error: "Unauthorized or playlist not found" });
        }

        const query = `
            SELECT s.* 
            FROM songs s
            INNER JOIN playlist_songs ps ON s.id = ps.song_id
            WHERE ps.playlist_id = $1
            ORDER BY ps.added_at ASC;
        `;
        const result = await pool.query(query, [playlistId]);

        res.status(200).json({ 
            playlistName: checkOwner.rows[0].name,
            songs: result.rows 
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch playlist songs" });
    }
};

const removeSongFromPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.params;
        const userId = req.user.userId;

        const checkOwner = await pool.query('SELECT id FROM playlists WHERE id = $1 AND user_id = $2', [playlistId, userId]);
        if (checkOwner.rows.length === 0) return res.status(403).json({ error: "Unauthorized" });

        await pool.query('DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2', [playlistId, songId]);
        res.status(200).json({ message: "Song removed" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove song" });
    }
};


const deletePlaylist = async (req, res) => {
    try {
        const playlistId = req.params.id;
        const userId = req.user.userId;

        const checkOwner = await pool.query('SELECT id FROM playlists WHERE id = $1 AND user_id = $2', [playlistId, userId]);
        if (checkOwner.rows.length === 0) return res.status(403).json({ error: "Unauthorized" });

        await pool.query('DELETE FROM playlists WHERE id = $1', [playlistId]);
        res.status(200).json({ message: "Playlist deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete playlist" });
    }
};

module.exports = {
    createPlaylist,
    getUserPlaylists,
    addSongToPlaylist,
    getPlaylistSongs,
    removeSongFromPlaylist,
    deletePlaylist
};