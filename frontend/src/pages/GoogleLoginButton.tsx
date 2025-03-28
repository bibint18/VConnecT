import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useAppDispatch } from '../redux/store';
import { loginTheUser } from '../redux/userSlice';
import axiosInstance from '../utils/axiosInterceptor';
import { toast } from 'react-toastify';

const GoogleLoginButton = () => {
  const dispatch = useAppDispatch();
  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    try {
      
      const response = await axiosInstance.post('/google-login', {
        idToken: credentialResponse.credential,
      });
      const { accessToken, user } = response.data;
      console.log("googlr login button response",accessToken,user)
      dispatch(loginTheUser({ name: user.name, email: user.email, accessToken }));
    } catch (error:unknown) {
      console.error('Google login failed:', error);
      // Display error to user (e.g., via state or toast)
      const errorMessage =
    (error as { response?: { data?: { message?: string } } }).response?.data?.message || 
    'Google login failed';

  toast.error(errorMessage)
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.error('Google Login Error')}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;