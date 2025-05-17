import { useEffect, useState } from "react";

const debounce = (func, delay) => {
  let timeoutId;
  return function (...args){
    if(timeoutId){
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  }
}

const useInfiniteScroll = ({
  fetchData,
  useTimestamp = false,
  initialPage = 1,
  getLastTimestamp,
}) => {
  const [page, setPage] = useState(initialPage);
  const [isFetching, setIsFetching] = useState(false);

  const loadData = async () => {
    setIsFetching(true);
    if(useTimestamp){
      const timestamp = getLastTimestamp?.();
      await fetchData(timestamp);
    } else {
      const nextPage = page + 1;
      await fetchData(nextPage);
      setPage(nextPage);
    }
    setIsFetching(false);
  }

  useEffect(() => {
    const init = async () => {
      await loadData();
    }

    init();
  }, []);

  const handleScroll = debounce(async () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight - 250;
    if(bottom && !isFetching){
      await loadData();
    }
  }, 50);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchmove', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    }
  }, [isFetching]);

  return { isFetching, page }
}

export default useInfiniteScroll;
