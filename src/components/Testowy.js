import { useEffect, useState } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";

export const Testowy = () => {
  const [posts, setPosts] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [x, setX] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getPosts = async () => {
      try {
        const response = await axiosPrivate.get('/posts', {
          signal: controller.signal
        });
        console.log(response.data);
        isMounted && setPosts(response.data.posts);
      } catch (err){
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
          console.log('Request was canceled: ', err.message);
          return;
        }
        navigate('/login', { state: { from: location }, replace: true });
      }
    }

    getPosts();

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [x]);

  return (
    <article>
      <h2>Lista postów</h2>
      {posts?.length
        ? (
          <ul>
            {posts.map((post, i) => <li key={i}>{post.created_at}{post.description}</li>)}
          </ul>
        ) : <p> Brak postów </p>
      }
      <button onClick={() => setX(x + 1)}>Klik</button>
    </article>
  )
}