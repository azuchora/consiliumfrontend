import { useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useFollow = (entity, type) => {
  const axiosPrivate = useAxiosPrivate();
  const [followed, setFollowed] = useState(entity?.isFollowed || false);
  const [followLoading, setFollowLoading] = useState(false);

  const handleFollowToggle = async () => {
    if (!entity?.id) return;
    setFollowLoading(true);
    try {
      if (followed) {
        await axiosPrivate.delete(
          type === "user"
            ? `/users/${entity.id}/follow`
            : `/posts/${entity.id}/follow`
        );
        setFollowed(false);
      } else {
        await axiosPrivate.post(
          type === "user"
            ? `/users/${entity.id}/follow`
            : `/posts/${entity.id}/follow`
        );
        setFollowed(true);
      }
    } catch (e) {
      
    } finally {
      setFollowLoading(false);
    }
  };

  return { followed, setFollowed, followLoading, handleFollowToggle };
};

export default useFollow;
