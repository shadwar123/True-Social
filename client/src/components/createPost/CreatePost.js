import React, { useState } from "react";
import Avatar from "../avatar/Avatar";
import "./CreatePost.scss";
import backgroundDummyImg from "../../assets/background.jpeg";
import { BsCardImage } from "react-icons/bs";
import { axiosClient } from "../../utils/axiosClient";
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from "../../redux/slices/appConfigSlice";
import { getUserProfile } from "../../redux/slices/postsSlice";
import { useCallback, useEffect } from 'react';
import { createWorker } from 'tesseract.js';

function CreatePost() {
    const [postImg, setPostImg] = useState("");
    const [caption, setCaption] = useState('');
    const [textResult, setTextResult] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [apiResponse, setApiResponse] = useState({ prediction: 0, result: '' });

    const dispatch = useDispatch();
    const myProfile = useSelector(state => state.appConfigReducer.myProfile);

    const worker = createWorker();


    const convertImageToText = useCallback(async () => {
        if (!selectedImage) return;


        await worker?.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        const { data } = await worker.recognize(selectedImage);

        setTextResult(data.text);
        const alphabeticText = data.text.match(/[a-zA-Z]+/g); 

        const resultString = alphabeticText.join(' ');
        console.log('imageinfo', resultString)

        handlePredict(resultString);

    }, [selectedImage]);

    useEffect(() => {
        convertImageToText();
    }, [selectedImage, convertImageToText])

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(e.target.files[0]);
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                if (fileReader.readyState === fileReader.DONE) {
                    setPostImg(fileReader.result);
                    // console.log("img data", fileReader.result);
                }
            };
        } else {
            setSelectedImage(null);
            setTextResult("");
            setPostImg('');
        }

    };

    const handlePredict = async (e) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/fake_news_prediction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: e }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log("resultshadow", result);
            setApiResponse(result);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const hanldePostSubmit = async () => {
        try {
            const result = await axiosClient.post('/posts', {

                caption,
                apiResponse,
                postImg
            });
            console.log('post done', result);
            dispatch(getUserProfile({
                userId: myProfile?._id
            }));
        } catch (error) {
            console.log('what is th error', error);
        } finally {
            setCaption('');
            setPostImg('');
            setApiResponse({ prediction: 0, result: '' });
        }


    }

    return (
        <div className="CreatePost">
            <div className="left-part">
                <Avatar src={myProfile?.avatar?.url} />
            </div>
            <div className="right-part">
                <input
                    value={caption}
                    type="text"
                    className="captionInput"
                    placeholder="What's on your mind?"
                    onChange={(e) => setCaption(e.target.value)}
                />
                {postImg && (
                    <div className="img-container">
                        <img
                            className="post-img"
                            src={postImg}
                            alt="post-img"
                        />
                        <h3>
                            {apiResponse.result}{' '}
                            <span
                                className={((100 - apiResponse.prediction * 100) > 50) ? "green-icon" : "orange-icon"}
                            >
                                {`${(100 - apiResponse.prediction * 100).toFixed(2)}%`}
                            </span>
                        </h3>

                    </div>

                )}

                <div className="bottom-part">
                    <div className="input-post-img">
                        <label htmlFor="inputImg" className="labelImg">
                            <BsCardImage />
                        </label>
                        <input
                            className="inputImg"
                            id="inputImg"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <button className="post-btn btn-primary" onClick={hanldePostSubmit}>Post</button>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
