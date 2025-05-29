import { useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useDeleteEntity = ({ entityId, entityType, onDelete }) => {
  const axiosPrivate = useAxiosPrivate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await axiosPrivate.delete(
        entityType === "post"
          ? `/posts/${entityId}`
          : `/comments/${entityId}`
      );
      if (onDelete) onDelete(entityId);
      setDeleteDialogOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    deleteDialogOpen,
    setDeleteDialogOpen,
    deleteLoading,
    handleDelete,
  };
};

export default useDeleteEntity;
