import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useRegister from '../../../hooks/useRegister';
import './Register.scss';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { mutate, isLoading, error } = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      toast.error('Todos os campos são obrigatórios.');
      return;
    }

    if (form.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    mutate(
      { email: form.email, password: form.password, username: form.username },
      {
        onSuccess: () => {
          navigate('/');
        },
      }
    );
  };

  return (
    <section id="register">
      <div className="container">
        <h1>Cadastre-se</h1>
        <p>Preencha os campos abaixo para criar uma nova conta</p>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          required
          placeholder="Nome"
          minLength={6}
          maxLength={24}
          inputMode="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="email"
          name="email"
          minLength={1}
          placeholder="E-mail"
          required
          inputMode="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          name="password"
          placeholder="Senha"
          minLength={6}
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirme sua senha"
          minLength={6}
          required
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />
        <div className="no-have-account">
          <p>Já tem uma conta?</p>
          <Link to="/login">Faça login</Link>
        </div>
        {!isLoading && <button className="btn">Cadastre-se</button>}
        {isLoading && (
          <button className="btn" disabled>
            Cadastrando...
          </button>
        )}
        {error && <span className="error">Ocorreu um erro. Tente novamente mais tarde.</span>}
      </form>
    </section>
  );
};

export default Register;
