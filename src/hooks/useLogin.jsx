import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/Config';

const useLogin = () => {
  const navigate = useNavigate();

  return useMutation(
    async ({ email, password }) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    {
      onSuccess: () => {
        navigate('/');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export default useLogin;
