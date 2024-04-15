import { useState } from "react";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/Config"; // Assuming firebase is in a folder named "firebase" two levels above
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link for navigation

import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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
      toast.success("Logado com sucesso!");
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
        <p>Faça login para acessar o blog.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <label>E-mail:</label>
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Senha:</label>
        <input
          type="password"
          name="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <div className="no-have-account">
          <p>Ainda não possui uma conta?</p>
          <Link to="/register">Crie uma agora!</Link>{" "}
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

export default Login;
