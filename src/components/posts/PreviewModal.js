import './PreviewModal.css';

const PreviewModal = ({ previewFile, onClose }) => {
  if (!previewFile) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✖</button>
        {previewFile.type === 'image' && (
          <img src={previewFile.url} alt="Preview" className="modal-image" />
        )}
        {previewFile.type === 'iframe' && (
          <iframe
            src={previewFile.url}
            title="File Preview"
            className="modal-iframe"
          />
        )}
      </div>
    </div>
  );
};

export default PreviewModal;
