import React from 'react';
import {
    Grid ,
    Avatar,
    TextField,
    InputAdornment,
    IconButton,
    Snackbar,
} from '@material-ui/core';
import './style.css';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import RedoIcon from '@material-ui/icons/Redo';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import * as moment from 'moment';


const PostView = (props) => {

    const [comment ,setComment] = React.useState('');
    const [showComments ,setShowComments] = React.useState(false);
    const [commentsList ,setCommentsList] = React.useState([]);
    const [reply ,setReply] = React.useState('');
    const [replyCommentId ,setReplyCommentId] = React.useState(false);
    const [snackbarOpen ,setSnackbar] = React.useState(false);
    const [message ,setMessage] = React.useState('');
    const commentRef = React.useRef(null);
    const replyRef = React.useRef([]);


    const addComment = async () => {
        const response = await fetch('/post/addComment',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({postId:'1',comment:comment})
        });
        await response.text().then((result) => {
          setComment('');
          getCommentsandReplyList();

        }).catch((err) => {
            setMessage("Something went wrong ,Please try again later");
            setSnackbar(true);
        });

    } 

    const getCommentsandReplyList = async () => {
         await  fetch("/post/getCommentsandReplyList/1",)
         .then((res) => res.json())
         .then((result) => {
           if(result.data){        
           result.data.forEach((ele) => {
               ele.date = moment(ele.date).fromNow();
             ele.replyList = ele.replyList.filter(function (el) {
                 el.replydate = moment(el.replydate).fromNow();
                 return el.reply !=null;
             });
           });
           setCommentsList(result.data); 
           }  
           else{        
           setCommentsList([]);     
           }      
         }).catch((err) => {
            setMessage("Something went wrong ,Please try again later");
            setSnackbar(true);
         })
    }

    const handleShowComments = () => {
        setShowComments(!showComments);
    }

    const addReply = async (index,commentData) => {
        const response = await fetch('/post/addReply' ,{
            method: 'POST',
            headers: {
              'Content-Type' : 'application/json',
            },
            body :JSON.stringify({postId:'1',commentId:commentData.commentId,reply:reply})
        });

       await response.text().then((result) => {

            setReply('');
            getCommentsandReplyList();

       }).catch((err) => {
            setMessage("Something went wrong ,Please try again later");
            setSnackbar(true);
       });
       
        
    }

    const handleCloseSnackBar = () => {
        setSnackbar(false);
    }

    React.useEffect(() => {
        getCommentsandReplyList();
    },[])

    return (
        <div className='postCard'>       
            
             <Grid container >
                 {/* ------------ Name and image -------------- */}
               <Grid item xs={12} >
                <Avatar alt="cat" src="/assets/cat_image1.jpg" className='avatarAlignment' />
                <span className='textAlignLeft'>
                    Animal Lover 
                   <div className='dateTime'>
                       2 days ago
                   </div>
                </span>
               </Grid>
               {/* -------------- post content --------------- */}
               <Grid item xs={12} className="postPadding">
                   <img src='/assets/cat_images2.jpg' className="imageAlignment" alt="cat_post"/>
               </Grid>
               {/* -------------- post Action ---------------- */}
               <Grid item xs={12} >
                   <div className='commentClick'   >
                     <span onClick={(e) => { handleShowComments(e) }}>{commentsList.length > 0 ? (commentsList.length === 1 ? commentsList.length+' Comment' : commentsList.length+' Comments') : ''}  </span>
                   </div>
                   <Grid container className="actionContainer">
                       <Grid item xs={4} className="alignStart">
                       <FavoriteBorderIcon /> <span className="textposition"> Like</span>
                       </Grid>
                       <Grid item xs={4} className="alignCenter commentSection" >
                        <ChatBubbleOutlineIcon /> <span 
                                                   className='textposition' 
                                                   onClick={(e) => {                                                          setShowComments(true);
                                                    setTimeout(() => {
                                                        commentRef.current.scrollIntoView();
                                                        commentRef.current.focus();
                                                        setReplyCommentId(0);
                                                    }, 500);
                                                 
                                                   }}
                                                   >
                                                   Comment
                                                   </span>
                       </Grid>
                       <Grid item xs={4} className="alignEnd">
                        <RedoIcon /><span className='textposition'>Share</span>
                       </Grid>
                   </Grid>
               </Grid>
               </Grid>   
               {/* --------------- Comment Section --------------- */}
                {showComments && (
                <div>
                    <Grid container>
                        {commentsList.length > 0 && (
                            <Grid item xs={12} className="commentTextfieldContainer">
                            <Grid container>
                                {commentsList.map((ele,index) => (
                                    <Grid item xs={12} key={index} className="commandsPadding">
                                        <Avatar alt="cat" src="/assets/cat_image1.jpg" className='avatarAlignment commentAvatar' />                                 
                                            <div className='textAlignLeft commentTextField'>
                                            <div className='commentsView'>
                                            <p className='commentViewHeader'>Animal Lover</p>                                    
                                            <p className='commentViewText'>{ele.comment}</p> 
                                            </div> 
                                            <p 
                                            className='rightAlignment' 
                                            onClick={(e) => {
                                                setReplyCommentId(ele.commentId);
                                                setTimeout(() => {
                                                    replyRef.current[index].scrollIntoView();
                                                    replyRef.current[index].focus();
                                                }, 500);
                                                }}
                                                >Reply</p>
                                            <p className='leftAlignment'>{ele.date}</p>

                                            {/* ----------------- Reply Section ------------------*/}                                    
                                            
                                            {replyCommentId === ele.commentId && (
                                                <div>
                                                    {ele.replyList.length > 0 ? ele.replyList.sort((a,b) => a.replyId - b.replyId).map((replyEle,subindex) => (
                                                        <div className='commentTextfieldContainer replyViewContainer' key={subindex}>
                                                            <Avatar alt="cat" src="/assets/cat_image1.jpg" className='avatarAlignment commentAvatar' />
                                                            <div className='replyView'>
                                                            <div className='commentsView'>
                                                                <p className='commentViewHeader'>Animal Lover</p>                                    
                                                                <p className='commentViewText'>{replyEle.reply}</p> 
                                                                </div> 
                                                                <p 
                                                                className='rightAlignment' 
                                                            
                                                                    >Reply</p>
                                                                <p className='leftAlignment'>{replyEle.replydate}</p> 
                                                                </div>                                      
                                                        </div>
                                                    )) : ''}
                                                
                                                    <div className='commentTextfieldContainer replyViewContainer imageAlignment'> 
                                                        <Avatar alt="cat" src="/assets/cat_image1.jpg" className='avatarcommentAlignment commentAvatar' />
                                                        <TextField
                                                            margin='dense'
                                                            placeholder='Write a Reply'
                                                            className='replyTextField'
                                                            variant='outlined'
                                                            inputRef={(el) => (replyRef.current[index] = el)}
                                                            onKeyDown={(e) => {
                                                                if(e.key === 'Enter'){
                                                                    if(reply !== ''){
                                                                    addReply(index, ele)
                                                                    } 
                                                                }
                                                            }}
                                                            value={reply}
                                                            onChange={(e) => {
                                                                setReply(e.target.value);
                                                            }}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        {reply !== '' && (
                                                                            <IconButton
                                                                            arial-label="Send"
                                                                            onClick={(e) => {
                                                                                addReply(index, ele)
                                                                            }}
                                                                            >
                                                                            <SendOutlinedIcon />
                                                                            </IconButton>
                                                                        )}
                                                                    
                                                                    </InputAdornment>
                                                                )
                                                            }}
                                                            />
                                                    </div>
                                            </div>
                                            )}
                                                                    
                                            </div>                                    
                                    </Grid>
                                ))}
                            </Grid>
                            </Grid>
                        )}
                   
                            <Grid item xs={12} className="commentTextfieldContainer">
                            <Avatar alt="cat" src="/assets/cat_image1.jpg" className='avatarcommentAlignment' />
                            <TextField
                                margin='dense'
                                placeholder='Write a Comment'
                                className='commentTextField'
                                inputRef={commentRef}
                                variant='outlined'                              
                                value={comment}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter'){
                                        if(comment !== ''){
                                        addComment();
                                        }
                                    }
                                }}
                                onChange={(e) => {
                                    setComment(e.target.value);
                                    setReplyCommentId(0);
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {comment !== '' && (
                                                <IconButton
                                                arial-label="Send"
                                                onClick={addComment}
                                              
                                                >
                                                <SendOutlinedIcon />
                                                </IconButton>
                                            )}
                                        
                                        </InputAdornment>
                                    ),
                                    pattern: "[a-z]{1,15}"
                                }}
                                />
                            </Grid>
                    </Grid>
                    <Snackbar
                     anchorOrigin={{
                         vertical: 'bottom',
                         horizontal: 'center',
                     }}
                     open={snackbarOpen}
                     autoHideDuration={1000}
                     onClose={handleCloseSnackBar}
                     message={<span id="message">{message}</span>}
                     />
               </div>
               )}
              
               
                         
        
        </div>
    );

}

export default PostView;