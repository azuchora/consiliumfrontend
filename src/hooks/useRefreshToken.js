import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth, setAvatar, setUsername } = useAuth();

  const refresh = async () => {
    const response = await axios.get('/refresh', {
      withCredentials: true,
    });
    setAuth(prev => {
      return { 
        ...prev, 
        accessToken: response.data.accessToken,
        roles: response.data.roles
       }
    })
    setAvatar(response.data.avatarFilename);
    setUsername(response.data.username);
    return response.data.accessToken;
  }
  
  return refresh;
}

export default useRefreshToken;
