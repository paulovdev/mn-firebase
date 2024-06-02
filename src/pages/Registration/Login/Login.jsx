import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { MdVisibilityOff, MdVisibility } from 'react-icons/md';
import useLogin from '../../../hooks/useLogin';

import './Login.scss';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isLoading } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error('Todos os campos são necessários!');
      return;
    }

    login({ email: form.email, password: form.password });
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
            type={showPassword ? 'text' : 'password'}
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

        {!isLoading && <button className="btn">Entrar</button>}
        {isLoading && (
          <button className="btn" disabled>
            Entrando...
          </button>
        )}
      </form>
    </section>
  );
};

export default Login;
