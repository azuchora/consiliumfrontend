import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import Loading from "../messages/Loader";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      }
      catch (err){
        console.error(err);
      }
      finally {
        isMounted && setIsLoading(false);
      }
    }

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => isMounted = false;
  }, [auth?.accessToken, refresh]);

  return (
    <>
      {!persist 
        ? <Outlet />
        : isLoading
          ? <Loading fullscreen={true} />
          : <Outlet />
      }
    </>
  )
}

export default PersistLogin;
