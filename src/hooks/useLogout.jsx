import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/Config';

const useLogout = () => {
  const navigate = useNavigate();

  return useMutation(async () => {
    await signOut(auth);
  }, {
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
};

export default useLogout;
