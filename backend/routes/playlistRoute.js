const express = require('express');
const route = express.Router();
const playlistcontroller = require('../controllers/playlistcontroller');
const  auth  = require('../middleware/auth'); 

route.post('/', auth.verifyToken, playlistcontroller.createPlaylist);
route.get('/', auth.verifyToken, playlistcontroller.getUserPlaylists);
route.post('/add', auth.verifyToken, playlistcontroller.addSongToPlaylist);
route.get('/:id', auth.verifyToken, playlistcontroller.getPlaylistSongs);
route.delete('/:playlistId/songs/:songId', auth.verifyToken, playlistcontroller.removeSongFromPlaylist);
route.delete('/:id', auth.verifyToken, playlistcontroller.deletePlaylist);

module.exports = route;