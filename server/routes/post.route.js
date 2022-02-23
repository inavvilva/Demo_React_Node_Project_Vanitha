const express = require("express");
var routes = express.Router();
var postController = require('./../controller/post');

routes.get('/getCommentsandReplyList/:postId' ,[] ,postController.getCommentsandReplyList);


routes.post('/addComment',[],postController.addComment);
routes.post('/addReply',[],postController.addReply);



module.exports = routes;