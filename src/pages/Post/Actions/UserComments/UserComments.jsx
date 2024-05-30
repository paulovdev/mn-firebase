import React, { useState, useEffect, useRef } from "react";
import { getDoc, doc, addDoc, collection, deleteDoc } from "firebase/firestore";
import { IoIosSend } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";

import { toast } from "react-toastify";
import { Blog } from "../../../../context/Context";
import { db } from "../../../../firebase/Config";
import { useNavigate } from "react-router-dom";

import './UserComments.scss'

const UserComments = ({ postId, comments }) => {
    const { currentUser } = Blog();
    const [usersInfo, setUsersInfo] = useState({});
    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const commentFormRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userInfo = {};
            for (const comment of comments) {
                const userRef = doc(db, "users", comment.userId);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    userInfo[comment.userId] = userDoc.data();
                }
            }
            setUsersInfo(userInfo);
        };

        fetchUserInfo();
    }, [comments]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            toast.error("Você precisa estar conectado para comentar.");
            return;
        }
        if (!commentText) {
            toast.error("Por favor, insira um comentário.");
            return;
        }

        try {

            const newComment = {
                postId: postId,
                userId: currentUser.uid,
                text: commentText,
                timestamp: new Date()
            };
            await addDoc(collection(db, "comments"), newComment);
            setCommentText("");

        } catch (error) {
            toast.error("Erro ao adicionar comentário.");
            console.error(error);
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            toast.error("Você precisa estar conectado para responder.");
            return;
        }
        if (!replyText) {
            toast.error("Por favor, insira uma resposta.");
            return;
        }

        try {

            const commenterName = replyingTo ? usersInfo[replyingTo]?.username || "Usuário" : "Usuário";
            const newReply = {
                postId: postId,
                userId: currentUser.uid,
                text: `@${commenterName} ${replyText}`,
                timestamp: new Date(),
                replyingTo: replyingTo
            };
            await addDoc(collection(db, "comments"), newReply);
            setReplyText("");
            setReplyingTo(null);

        } catch (error) {
            toast.error("Erro ao adicionar resposta.");
            console.error(error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteDoc(doc(db, "comments", commentId));
            toast.success("Comentário excluído com sucesso!");
        } catch (error) {
            toast.error("Erro ao excluir o comentário.");
            console.error(error);
        }
    };

    const goToProfile = (userId) => {
        navigate(`/profile/${userId}`);
    };

    return (
        <>

            <div id="user-comments">
                <h1>Comentários</h1>
                <div className="comment-form" ref={commentFormRef}>
                    <form onSubmit={handleCommentSubmit}>
                        <div className="send-input">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Digite seu comentário..."
                            />
                            <button type="submit">
                                <IoIosSend size={26} />
                            </button>
                        </div>
                    </form>
                </div>

                {comments.slice().reverse().map((comment, index) => (
                    <div key={index} className="comment-container">
                        <div className="profile-content">
                            {usersInfo[comment.userId] && (
                                <>
                                    <img
                                        src={usersInfo[comment.userId].userImg}
                                        onClick={() => goToProfile(comment.userId)}

                                        alt=""
                                    />
                                    <p>{usersInfo[comment.userId].username}</p>
                                    {comment.timestamp && (
                                        <p>{comment.timestamp.toDate().toLocaleString()}</p>
                                    )}
                                </>
                            )}
                            {currentUser && currentUser.uid === comment.userId && (
                                <div className="delete">
                                    <button onClick={() => handleDeleteComment(comment.id)}><FaTrashAlt /> </button>
                                </div>
                            )}
                        </div>

                        <p>{comment.text}</p>
                        <button onClick={() => setReplyingTo(comment.userId)}>Responder</button>

                        {replyingTo === comment.userId && (
                            <div className="reply-form">
                                <form onSubmit={handleReplySubmit}>
                                    <div className="send-input">
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder={`@${usersInfo[comment.userId]?.username || 'Usuário'} `}
                                        />
                                        <button type="submit">
                                            <IoIosSend size={26} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </>
    );
};

export default UserComments;
