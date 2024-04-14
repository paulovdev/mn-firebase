import { db } from '../firebase/Config'

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut
} from 'firebase/auth';

import { useState, useEffect } from 'react';

export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cancelled, setCancelled] = useState(false);

    const auth = getAuth();

    function checkIfIsCancelled() {
        if (cancelled) {
            return;
        }
    }

    const createUser = async (data) => {
        checkIfIsCancelled();

        setLoading(true);
        setError('');

        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            await updateProfile(user, { displayName: data.displayName });

            setLoading(false);
            return user;
        } catch (error) {
            console.error(error);

            let systemErrorMessage;

            if (error.code === 'auth/weak-password') {
                systemErrorMessage = 'A senha precisa conter pelo menos 6 caracteres';
            }
            else if (error.code === 'auth/email-already-in-use') {
                systemErrorMessage = 'E-mail já cadastrado';
            }
            else if (error.code === 'auth/invalid-email') {
                systemErrorMessage = 'O endereço de e-mail não é válido.';
            }
            else if (error.code === "auth/too-many-requests") {
                systemErrorMessage = 'As solicitações foram bloqueadas devido a atividades incomuns. Tente novamente mais tarde.';
            }
            else {
                systemErrorMessage = 'Ocorreu um erro, por favor, tente novamente mais tarde.';
            }

            setLoading(false);
            setError(systemErrorMessage);
        }
    };

    //logout
    const logout = () => {
        checkIfIsCancelled();

        signOut(auth);
    }

    //login 
    const login = async (data) => {
        checkIfIsCancelled()

        setLoading(true)
        setError("")

        try {
            await signInWithEmailAndPassword(auth, data.email, data.password)
            setLoading(false)
        } catch (error) {
            console.error(error);

            let systemErrorMessage;

            if (error.code === 'auth/invalid-credential') {
                systemErrorMessage = 'Nome de usuario ou senha incorreta';
            }
            else {
                systemErrorMessage = 'Ocorreu um erro, por favor, tente novamente mais tarde.';
            }
            setError(systemErrorMessage)
            setLoading(false)
        }
    }

    useEffect(() => {
        return () => setCancelled(true)
    }, [])

    return {
        auth,
        createUser,
        error,
        loading,
        logout,
        login
    }
}