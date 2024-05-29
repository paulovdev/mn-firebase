import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "../../utils/Editor/Editor";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db, storage } from "../../firebase/Config";
import { addDoc, collection } from "firebase/firestore";
import { Blog } from "../../context/Context";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { IoImageOutline } from "react-icons/io5";
import { FaSave } from "react-icons/fa";
import ScrollTop from "../../utils/ScrollTop/ScrollTop";
import TopicInput from "../../components/TopicInput/TopicInput";
import topicsData from "../../components/TopicInput/TopicsData";
import StepIndicators from "../../components/StepIndicators/StepIndicators";
import { Transition } from '../../utils/Transition/Transition';

import "./CreatePost.scss";

const CreatePost = () => {
  const imageRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [desc, setDesc] = useState("");
  const { currentUser } = Blog();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState({
    title: "",
    photo: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const colors = ["#A6A6A6", "#737373", "#404040", "#262626", "#0D0D0D"];
  const topics = topicsData.categories.reduce((acc, curr) => acc.concat(curr.topics), []);
  const [selectedTopic, setSelectedTopic] = useState("Sem Topico");

  const [isTitleValid, setIsTitleValid] = useState(false);
  const [isPhotoValid, setIsPhotoValid] = useState(false);
  const [isDescValid, setIsDescValid] = useState(false);

  useEffect(() => {
    setIsTitleValid(preview.title.length >= 6);
    setIsPhotoValid(!!preview.photo);
    setIsDescValid(!!desc);
  }, [preview.title, preview.photo, desc]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!isTitleValid || !isPhotoValid || !isDescValid) {
        toast.error("Preencha os campos obrigatórios!!!");
        setLoading(false);
        return;
      }
      const collections = collection(db, "posts");
      let url = "";
      if (preview.photo) {
        const storageRef = ref(storage, `image/${preview.photo.name}`);
        setUploadingImage(true);
        await uploadBytes(storageRef, preview.photo);
        url = await getDownloadURL(storageRef);
        setUploadingImage(false);
      }
      await addDoc(collections, {
        userId: currentUser?.uid,
        title: preview.title,
        color: selectedColor,
        desc,
        postImg: url,
        created: new Date().toISOString(),
        topic: selectedTopic,
      });
      setLoading(false);
      toast.success("Post publicado com sucesso!");
      navigate(`/`);
    } catch (error) {
      console.error("erro ao adicionar documento: ", error);
      toast.error("ocorreu um erro ao publicar o post. Por favor, tente novamente mais tarde.");
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClick = () => {
    imageRef.current.click();
  };

  return (
    <section id="create-post">
      <AnimatePresence mode='wait'>
        <motion.div
          key={`step-indicator-${currentStep}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="step-indicator-container"
        >
          <StepIndicators currentStep={currentStep} />
        </motion.div>
      </AnimatePresence>
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode='wait'>
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="animate-step"
            >
              <div className="step-title">
                <h1>Informações Iniciais</h1>
                <p>Preencha o título e continue.</p>
                <input
                  type="text"
                  placeholder="Título do post aqui..."
                  value={preview.title}
                  minLength={6}
                  onChange={(e) => setPreview({ ...preview, title: e.target.value })}
                />
                {!isTitleValid && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    O título deve ter pelo menos 6 letras (Restam {6 - preview.title.length} letras)
                  </motion.p>
                )}
                <div className="next-prev">
                  <button type="button" className="next" onClick={handleNextStep} disabled={!isTitleValid}>
                    Continuar
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="animate-step"
            >
              <div className="step-topic">
                <h1>Seleção de Tópico</h1>
                <p>Escolha o tópico do seu post.</p>
                <TopicInput topics={topics} onSelectTopic={setSelectedTopic} />
                <div className="next-prev">
                  <button type="button" className="prev" onClick={handlePreviousStep}>
                    Voltar
                  </button>
                  <button type="button" className="next" onClick={handleNextStep}>
                    Continuar
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="animate-step"
            >
              <div className="step-image">
                <h1>Seleção de Imagem</h1>
                <p>Carregue uma imagem para o seu post.</p>
                <div className="image-select">
                  <button type="button" className="prf-file" onClick={handleClick}>
                    <IoImageOutline size={75} />
                    <p>{imageUrl ? "Imagem carregada..." : ""}</p>
                  </button>
                  {imageUrl && <img width={150} src={imageUrl} alt="Imagem carregada" className="preview-image" />}
                </div>
                <input
                  onChange={(e) => {
                    setImageUrl(URL.createObjectURL(e.target.files[0]));
                    setPreview({ ...preview, photo: e.target.files[0] });
                  }}
                  ref={imageRef}
                  type="file"
                  hidden
                />
                {!isPhotoValid && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    A imagem é obrigatória
                  </motion.p>
                )}
                <div className="next-prev">
                  <button type="button" className="prev" onClick={handlePreviousStep}>
                    Voltar
                  </button>
                  <button type="button" className="next" onClick={handleNextStep} disabled={!isPhotoValid}>
                    Continuar
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="animate-step"
            >
              <div className="step-color">
                <h1>Seleção de Cor</h1>
                <p>Escolha a cor de destaque para o seu post.</p>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  title="Escolher cor"
                  style={{ background: selectedColor }}
                >
                  {colors.map((color, index) => (
                    <option key={index} value={color} style={{ backgroundColor: color }}>
                      {color}
                    </option>
                  ))}
                </select>
                <div className="next-prev">
                  <button type="button" className="prev" onClick={handlePreviousStep}>
                    Voltar
                  </button>
                  <button type="button" className="next" onClick={handleNextStep}>
                    Continuar
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="animate-step"
            >
              <div className="step-text">
                <h1>Edição de Texto</h1>
                <p>Escreva o conteúdo do seu post.</p>
                <Editor
                  placeholder="Escreva sobre o que quiser e compartilhe o seu conhecimento..."
                  value={desc}
                  onChange={setDesc}
                />
                {!isDescValid && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    O conteúdo do post é obrigatório
                  </motion.p>
                )}
                <div className="next-prev">
                  <button type="button" className="prev" onClick={handlePreviousStep}>
                    Voltar
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn"
                  title="Salvar"
                  disabled={uploadingImage || !isTitleValid || !isPhotoValid || !isDescValid}
                >
                  <div className="icon-content">
                    <FaSave
                      style={{
                        animation: !loading ? "" : "round 1s infinite",
                      }}
                      size={26}
                    />
                  </div>
                  <p>Publicar</p>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      <ScrollTop />
    </section>
  );
};

export default Transition(CreatePost);
