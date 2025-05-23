import { useState } from 'react';
import { BACKEND_URL } from '../../api/axios';
import useFormatDate from '../../hooks/useFormatDate';
import useFileTypeCheck from '../../hooks/useFileTypeCheck';
import FilePreview from './FilePreview';
import PreviewModal from './PreviewModal';
import './PostPreview.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const PostPreview = ({ post, isPage = false }) => {
  const [previewFile, setPreviewFile] = useState(null);
  const formatDate = useFormatDate();
  const { isImage } = useFileTypeCheck();
  
  const navigate = useNavigate();
  const handleGoToPost = () => {
    navigate(`/posts/${post.id}`);
  }

  const imageFiles = post.files?.filter(file => isImage(file.filename)) || [];
  const otherFiles = post.files?.filter(file => !isImage(file.filename)) || [];

  const closePreview = () => setPreviewFile(null);
  
  if(!post?.id) return null;
  
  const authorAvatar = post?.users?.files[0]?.filename;

  return (
    <>
      <section className="post-preview-item">
        <div className="post-preview-header">
          <div className="post-preview-avatar">
            <Link to={`/users/${post.users.username}`} className='post-preview-link'>
              {authorAvatar == null ? 
                post.users.username?.[0].toUpperCase()
               : (
                <img src={`${BACKEND_URL}/static/${authorAvatar}`} className='post-preview-avatar-img' alt='author avatar'/>
              )}
            </Link>
          </div>
          <div className="post-preview-userinfo">
            <strong className="post-preview-username">
              <Link to={`/users/${post.users.username}`} className='post-preview-link'>
                {`${post?.users.name} ${post.users.surname}`}
              </Link>
            </strong>
            <div className="post-preview-date">{formatDate(post.createdAt)}</div>
          </div>
        </div>
        <h3 className="post-preview-title">{post.title}</h3>

        <p className="post-preview-description">{post.description}</p>
        
        {imageFiles.length > 0 && (
          <div className="post-preview-files">
            {imageFiles.map(file => (
              <img
                key={file.id}
                src={`${BACKEND_URL}/static/${file.filename}`}
                alt={file.filename}
                className="post-preview-file-img"
                onClick={() => setPreviewFile({ type: 'image', url: `${BACKEND_URL}/static/${file.filename}` })}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        )}

        {otherFiles.length > 0 && (
          <div className="post-preview-other-files">
            {otherFiles.map(file => (
              <FilePreview key={file.id} file={file} onPreview={setPreviewFile} />
            ))}
          </div>
        )}

        <hr />
        
          {/* {post.is_answered ? (
            <span className="answered">Weź udział w dyskusji</span>
          ) : (
            <span className="not-answered">Brak odpowiedzi</span>
          )}
          {post.post_status_id && (
            <span className="status">Status: {post.post_status_id}</span>
          )} */}
        <div className="post-preview-footer">
          <div className='post-preview-vote'>
            <button className='post-preview-vote-btn'>
              <FontAwesomeIcon icon={faChevronUp} color='#00FF00' style={{fontSize: '1.125rem'}}/>
            </button>
            <span>2</span>
            <button className='post-preview-vote-btn'>
              <FontAwesomeIcon icon={faChevronDown} color='#ff0000' style={{fontSize: '1.125rem'}}/>
            </button>
          </div>
          {!isPage && (
            <button className='post-preview-comment' onClick={handleGoToPost}>
              <FontAwesomeIcon icon={faComment} style={{ fontSize: '1.125rem' }}/>
              <span>Odpowiedz</span>
            </button>
          )}
        </div>
      </section>

      <PreviewModal previewFile={previewFile} onClose={closePreview} />
    </>
  );
};

export default PostPreview;
