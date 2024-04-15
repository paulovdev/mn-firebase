import { useState } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/Config";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";

import "./Register.scss";

const Register = ({ setModal }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      toast.error("Todos os campos são obrigatórios.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const ref = doc(db, "users", user.uid);
      const userDoc = await getDoc(ref);

      if (!userDoc.exists()) {
        await setDoc(ref, {
          userId: user.uid,
          username: form.username,
          email: form.email,
          userImg: "",
          bio: "",
          created: Date.now(),
        });
        navigate("/");
        toast.success("Conta criada com sucesso!");
        setModal(false);
      }
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      setError("Ocorreu um erro. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register">
      <div className="container">
        <h1>Cadastre-se</h1>
        <p>Preencha os campos abaixo para criar uma nova conta</p>
      </div>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input
          type="text"
          required
          minLength={1}
          maxLength={16}
          inputMode="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <label>E-mail:</label>
        <input
          type="email"
          name="email"
          minLength={1}
          required
          inputMode="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Senha:</label>
        <input
          type="password"
          name="password" 
          minLength={6}
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <label>Confirmacao da senha:</label>
        <input
          type="password"
          name="confirmPassword"
          minLength={6}
          required
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        {!loading && <button className="btn">Cadastre-se</button>}
        {loading && (
          <button className="btn" disabled>
            Cadastrando...
          </button>
        )}
        {error && <span className="error">{error}</span>}
      </form>
    </section>
  );
};

export default Register;
