import React, { useState } from "react";
import Avatar from "../avatar/Avatar";
import "./Post.scss";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch } from 'react-redux';
import { likeAndUnlikePost } from "../../redux/slices/postsSlice";
import { useNavigate } from "react-router";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_SUCCESS } from "../../App";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { CardContainer, CardBody, CardItem } from "../ui/3d-card";



function Post({ post }) {
    const dispatch = useDispatch();
    const [isMouseEntered, setIsMouseEntered] = useState(false);
    const navigate = useNavigate();
    async function handlePostLiked() {
        dispatch(likeAndUnlikePost({
            postId: post._id
        }))
    }

    const handleMouseEnter = () => {
        setIsMouseEntered(true);
    };

    const handleMouseLeave = () => {
        setIsMouseEntered(false);
    };

    return (
        <div className="Post">
            <div className="heading" onClick={() => navigate(`/profile/${post.owner._id}`)}>
                <Avatar src={post.owner?.avatar?.url} />
                <h4>{post.owner?.name}</h4>
            </div>
            <div className="content">
                <img src={post?.image?.url} alt="" />
            </div>
            <div className="footer">
                <div className="like" onClick={handlePostLiked}>
                    {post.isLiked ? <AiFillHeart style={{ color: 'red' }} className="icon" /> : <AiOutlineHeart className="icon" />}
                    <h4>{`${post.likesCount} likes`}</h4>
                </div>
                <div className="caption-prediction-container">
                    <p className="caption">{post?.caption}</p>
                    <div className="prediction-container">
                        <MdOutlinePrivacyTip className={((100 - post?.apiResponse?.prediction * 100) > 50) ? "green-icon large-icon" : "orange-icon large-icon"} />
                        {'  '}
                        <h3 className={((100 - post?.apiResponse?.prediction * 100) > 50) ? "green-icon" : "orange-icon"}>
                            <span>
                                {`${(100 - post?.apiResponse?.prediction * 100).toFixed(2)}%`}
                            </span>
                        </h3>
                    </div>
                </div>
                <h6 className="time-ago">{post?.timeAgo}</h6>
            </div>
        </div>
        // <CardContainer className="inter-var">
        //     <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        //         <div
        //             className={`Post ${isMouseEntered ? 'hovered' : ''
        //                 }`}
        //             onMouseEnter={handleMouseEnter}
        //             onMouseLeave={handleMouseLeave}
        //             onClick={() => navigate(`/profile/${post.owner._id}`)}
        //         >
        //             <CardItem
        //                 translateZ="50"
        //                 className="text-xl font-bold text-neutral-600 dark:text-white"
        //             >
        //                 <div className="heading">
        //                     <Avatar src={post.owner?.avatar?.url} />
        //                     <h4>{post.owner?.name}</h4>
        //                 </div>
        //             </CardItem>
        //             <CardItem translateZ="100" className="w-full mt-4">
        //             <div className="content">
        //                 <img 
        //                     src={post?.image?.url} 
        //                     height="1000"
        //                     width="1000"
        //                     className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
        //                     alt="thumbnail" />
        //             </div>
        //             </CardItem>
        //             <div className="footer">
        //                 <div className="like" onClick={handlePostLiked}>
        //                     {post.isLiked ? (
        //                         <AiFillHeart style={{ color: "red" }} className="icon" />
        //                     ) : (
        //                         <AiOutlineHeart className="icon" />
        //                     )}
        //                     <h4>{`${post.likesCount} likes`}</h4>
        //                 </div>
        //                 <div className="caption-prediction-container">
        //                     <p className="caption">{post?.caption}</p>
        //                     <div className="prediction-container">
        //                         <MdOutlinePrivacyTip
        //                             className={`${(100 - post?.apiResponse?.prediction * 100) > 50
        //                                 ? "green-icon large-icon"
        //                                 : "orange-icon large-icon"
        //                                 } ${isMouseEntered ? 'hovered' : ''
        //                                 }`}
        //                         />
        //                         {'  '}
        //                         <h3
        //                             className={`${(100 - post?.apiResponse?.prediction * 100) > 50
        //                                 ? "green-icon"
        //                                 : "orange-icon"
        //                                 } ${isMouseEntered ? 'hovered' : ''
        //                                 }`}
        //                         >
        //                             <span>{`${(100 - post?.apiResponse?.prediction * 100).toFixed(
        //                                 2
        //                             )}%`}</span>
        //                         </h3>
        //                     </div>
        //                 </div>
        //                 <h6 className="time-ago">{post?.timeAgo}</h6>
        //             </div>
        //         </div>
        //     </CardBody>
        // </CardContainer>
    );
}

export default Post;
