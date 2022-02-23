const express = require("express");
const bodyParser = require('body-parser');
const path = require("path");
const postRoutes = require('./routes/post.route');

connection = require('./config/database');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use('/post',postRoutes);

app.get("*",(req,res) => {
    res.sendFile(path.resolve(__dirname, '../client/build',index.html));
});

app.listen(PORT ,() => {
    console.log(`Server listening on ${PORT}`);
});