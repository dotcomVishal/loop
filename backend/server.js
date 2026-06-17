require('dotenv').config();
require('./db/config')

const cors = require('cors');



const express = require('express');
const app = express();
const songroute = require('./routes/songroute');
const authroute = require('./routes/authroute');
const playlistRoute = require('./routes/playlistRoute');
const path = require('path');
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authroute);
app.use('/uploads', express.static(path.join(__dirname,'uploads')));
app.use('/api/playlists', playlistRoute);

app.use('/api/songs', songroute);

app.get('/', (request,response) =>{
    response.send("server alive ig")
}); 


app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`)
});

