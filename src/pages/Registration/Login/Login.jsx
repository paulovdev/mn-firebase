import React, { useState } from "react";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/Config";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";

import "./Login.scss";
import { Transition } from "../../../utils/Transition/Transition";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Todos os campos são necessários!");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="login">
      <div className="container">
        <h1>Entrar</h1>
        <p>Digite seu e-mail e senha para continuar</p>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Senha"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <MdVisibility size={28} /> : <MdVisibilityOff size={28} />}
          </span>
        </div>

        <div className="no-have-account">
          <p>Ainda não possui uma conta?</p>
          <Link to="/register">Crie uma agora!</Link>
        </div>

        {!loading && <button className="btn">Entrar</button>}
        {loading && (
          <button className="btn" disabled>
            Entrando...
          </button>
        )}
      </form>
    </section>
  );
};

export default Transition(Login);
