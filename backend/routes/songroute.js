const express = require('express');
const route = express.Router();
const  auth  = require('../middleware/auth'); 
const songcontroller = require('../controllers/songcontroller')

const upload = require('../middleware/upload');

route.get('/', songcontroller.getallsongs);
route.post('/upload',auth.verifyToken,auth.isAdmin, upload.single('audio'), songcontroller.uploadsong);
route.delete('/:id', auth.verifyToken,auth.isAdmin, songcontroller.deletesong)
module.exports = route;
