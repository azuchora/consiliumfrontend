import { useState, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./AddCommentForm.css";

const AddCommentForm = ({ postId, parentCommentId = null, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const axiosPrivate = useAxiosPrivate();

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if(!content.trim()){
      setError("Treść komentarza nie może być pusta");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("postId", postId);

      if(parentCommentId !== null){
        formData.append("parentCommentId", parentCommentId);
      }

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axiosPrivate.post(`/posts/${postId}/comments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if(fileInputRef.current){
        fileInputRef.current.value = null;
      }

      setContent("");
      setFiles([]);
      if (onCommentAdded) onCommentAdded(response.data.comment);
    } catch (err) {
      console.error(err);
      setError("Błąd podczas dodawania komentarza");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-comment-form">
      <textarea
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Napisz komentarz..."
        disabled={isSubmitting}
      />

      <input
        id="fileUpload"
        type="file"
        className="hidden-file-input"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isSubmitting}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isSubmitting}
        className="comment-file-btn"
      >
        Wybierz pliki
      </button>

      {files.length > 0 && (
        <div className="selected-files">
          <strong>Wybrane pliki:</strong>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="file-preview"
                  />
                )}
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      <button type="submit" disabled={isSubmitting} className="comment-add-btn">
        {isSubmitting ? "Dodawanie..." : "Dodaj komentarz"}
      </button>
    </form>
  );
};

export default AddCommentForm;
