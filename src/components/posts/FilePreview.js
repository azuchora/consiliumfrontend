import { BACKEND_URL } from '../../api/axios';
import useFileTypeCheck from '../../hooks/useFileTypeCheck';
import './FilePreview.css';

const FilePreview = ({ file, onPreview }) => {
  const { isPreviewable } = useFileTypeCheck();
  const fileUrl = `${BACKEND_URL}/static/${file.filename}`;

  return (
    <div className="file-preview">
      {isPreviewable(file.filename) ? (
        <>
          <div
            className="file-iframe-wrapper"
            onClick={() => onPreview({ type: 'iframe', url: fileUrl })}
            style={{ cursor: 'pointer' }}
          >
            <iframe
              src={fileUrl}
              title={file.filename}
              className="file-iframe"
            />
          </div>
          <a
            href={fileUrl}
            download
            className="file-download-link"
            title="Pobierz plik"
            rel="noopener noreferrer"
            target="_blank"
          >
            ⬇️ Pobierz
          </a>
        </>
      ) : (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="file-download-link"
        >
          Pobierz plik: {file.filename}
        </a>
      )}
    </div>
  );
};

export default FilePreview;
