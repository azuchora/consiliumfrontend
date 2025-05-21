import { useState, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const usePost = (postId) => {
  const axiosPrivate = useAxiosPrivate();
  const [post, setPost] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchPost = async () => {
      try {
        const response = await axiosPrivate.get(`/posts/${postId}`, { signal: controller.signal });
        if(isMounted) setPost(response.data.post);
      } catch (e) {
        if (e.name !== "CanceledError") setError("Błąd ładowania posta");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [postId, axiosPrivate]);

  return { post, isLoading, error };
};

export default usePost;
