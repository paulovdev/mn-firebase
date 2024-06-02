import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '././../firebase/Config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const registerUser = async ({ email, password, username }) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  const ref = doc(db, 'users', user.uid);
  const userDoc = await getDoc(ref);

  if (!userDoc.exists()) {
    await setDoc(ref, {
      userId: user.uid,
      username,
      email,
      userImg: '',
      bio: '',
      created: Date.now(),
    });
  }

  return user;
};

const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation(registerUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('user');
      toast.success('Conta criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar conta:', error);
      toast.error('Ocorreu um erro. Tente novamente mais tarde.');
    },
  });
};

export default useRegister;
