import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useUser = (username) => {
  const axiosPrivate = useAxiosPrivate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`/users/${username}`);
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [username, axiosPrivate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, setUser, loading, fetchUser };
};

export default useUser;
