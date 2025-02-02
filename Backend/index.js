// server.js

const express = require('express');
const http = require('http');
const connectToMongo = require('./db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const server = http.createServer(app);
const path = require('path');



const port =  9000;

const routeUpload = require('./route/routeUpload');
const authRouter = require('./route/auth');
const githubauthRouter = require('./route/githubAuth');
const stackholdersRouter=require('./route/stackholdersRoute');
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/auth', authRouter);
app.use('/api/auth',stackholdersRouter);
app.use('/api/githubauth', githubauthRouter);
app.use('/api/image', routeUpload);
app.set('view engine', 'ejs');

connectToMongo();


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




