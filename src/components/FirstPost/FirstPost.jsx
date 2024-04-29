import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Link } from "react-router-dom";
import { PiMedal } from "react-icons/pi";
import FormatDate from "../../utils/FormatDate";
import { toast } from "react-toastify";
import { readTime } from "../../utils/ReadTime";
import "./FirstPost.scss";

const FirstPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const firestore = getFirestore();
        const q = query(collection(firestore, "posts"), orderBy("created"), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const postData = querySnapshot.docs[0].data();
          setPost({ id: querySnapshot.docs[0].id, ...postData });
        } else {
          toast.error("No posts found");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  return (
    <section id="first-post">
      {loading ? (
        <p>Loading...</p>
      ) : post ? (
        <div className="post">
          <div className="left-content">
            <img src={post.postImg} alt="postImg" />
          </div>

          <div className="right-content">

            <div className="featured-post">
              <PiMedal />
              <span>Postagem em destaque </span>
            </div>

            <div className="title-text">
              <h1>{post.title}</h1>
              <div className="body-first-post" dangerouslySetInnerHTML={{ __html: post.desc.slice(0, 200) }}>

              </div>
            </div>

            <div className="text-wrapper">
              <p>
                Criado em
              </p>
              <span>
                <FormatDate date={post.created} />
              </span>
              <span className="predefinition">•</span>
              <p>
                {readTime({ __html: post.desc })} min de leitura
              </p>
            </div>
          </div>
        </div>

      ) : (
        <p>Sem post disponivel</p>
      )
      }
    </section >
  );
};

export default FirstPost;
