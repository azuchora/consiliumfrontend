import { useEffect, useState } from "react";

const useVoting = ({ initialVote, initialCount, onVote }) => {
  const [vote, setVote] = useState(initialVote);
  const [voteCount, setVoteCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setVote(initialVote);
    setVoteCount(initialCount);
  }, [initialVote, initialCount]);

  const handleVote = async (value) => {
    if (loading) return;
    setLoading(true);

    let newVote = vote === value ? 0 : value;
    let newVoteCount = voteCount - vote + newVote;

    try {
      await onVote(newVote);
      setVote(newVote);
      setVoteCount(newVoteCount);
    } catch (err) {
      
    } finally {
      setLoading(false);
    }
  };

  return { vote, voteCount, loading, handleVote };
}

export default useVoting;
