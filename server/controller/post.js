var response = require('./../general/response');

module.exports = {
   

    // add comment 


    addComment : async (req,res) => {
        let addCommentQuery = "INSERT INTO comments (postId,comment) VALUES (?,?)";
        try {
                 let addComment = await connection.query(addCommentQuery, [req.body.postId,req.body.comment]);
                 response.createResponse(res,200 ,{addComment});
        }
        catch(err){
            response.createResponse(res,400,{err})
        }
    },

    //  Get Comments and Reply List

    getCommentsandReplyList : async (req,res) => {

        let query = `select c.postId,c.id as commentId,c.comment,c.dt as commentDate,r.reply,r.dt as replydate,r.id as replyId from comments as c left join reply as r on c.id = r.commentId where c.postId = ?; `
        try {
                let getCommentsandReplyList = await connection.query(query,[req.params.postId]);

                const commentReplyGroup = getCommentsandReplyList.reduce((groups, ele_data) => {
                    var ele = ele_data.commentId
                     if (!groups[ele]) {
                       groups[ele] = [];
                     }
                     groups[ele].push(ele_data);
                     return groups;
                   }, {});
             
                   const commentReplyGroupArrays = Object.keys(commentReplyGroup).map((commentId) => {
                       let comment = commentReplyGroup[commentId][0].comment;
                       let date = commentReplyGroup[commentId][0].commentDate;
                     return {
                        commentId,
                        comment,
                        date,
                        replyList: commentReplyGroup[commentId]
                     };
                   });
             
                    response.createResponse(res,200,commentReplyGroupArrays);    

        }
        catch (err) {
            response.createResponse(res,400,{err});
        }

    },

    // add Reply

    addReply : async (req,res) => {
        let addReplyQuery = "INSERT INTO reply (postId,commentId,reply) VALUES (?,?,?)";
        try {
                 let addReply = await connection.query(addReplyQuery, [req.body.postId,req.body.commentId,req.body.reply]);
                 response.createResponse(res,200 ,{addReply});
        }
        catch(err){
            response.createResponse(res,400,{err})
        }
    },




}