import { useState } from 'react';
import { BACKEND_URL } from '../../api/axios';
import useFormatDate from '../../hooks/useFormatDate';
import useFileTypeCheck from '../../hooks/useFileTypeCheck';
import FilePreview from './FilePreview';
import PreviewModal from './PreviewModal';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
  Paper,
  Divider,
  Stack,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const PostPreview = ({ post, isPage = false }) => {
  const [previewFile, setPreviewFile] = useState(null);
  const formatDate = useFormatDate();
  const { isImage } = useFileTypeCheck();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navigate = useNavigate();
  const handleGoToPost = () => {
    navigate(`/posts/${post.id}`);
  };

  const imageFiles = post.files?.filter(file => isImage(file.filename)) || [];
  const otherFiles = post.files?.filter(file => !isImage(file.filename)) || [];

  const closePreview = () => setPreviewFile(null);

  if (!post?.id) return null;

  const authorAvatar = post?.users?.files?.[0]?.filename;
  const authorInitial = post.users.username?.[0]?.toUpperCase() || '?';

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 1.5 : 2.5,
          mb: 2,
          borderRadius: 3,
          background: theme.palette.background.default,
          width: '100%',
          boxSizing: 'border-box',
          border: `1.5px solid ${theme.palette.primary.main}`,
          transition: 'box-shadow 0.2s, border-color 0.2s',
          boxShadow: '0 2px 12px 0 rgba(42,63,84,0.07)',
          '&:hover': {
            boxShadow: '0 8px 32px 0 rgba(42,63,84,0.18)',
            borderColor: theme.palette.secondary.main
          }
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          mb={1}
          flexWrap="wrap"
        >
          <Link to={`/users/${post.users.username}`}>
            <Avatar
              src={authorAvatar ? `${BACKEND_URL}/static/${authorAvatar}` : undefined}
              alt={post.users.username}
              sx={{
                width: 48,
                height: 48,
                bgcolor: theme.palette.primary.main,
                color: '#fff',
                fontWeight: 700,
                fontSize: 22,
                flexShrink: 0,
                border: `2px solid ${theme.palette.secondary.main}`
              }}
            >
              {!authorAvatar && authorInitial}
            </Avatar>
          </Link>
          <Box
            sx={{
              minWidth: 0,
              flex: 1,
              overflow: 'hidden',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere'
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color={theme.palette.text.primary}
              component={Link}
              to={`/users/${post.users.username}`}
              sx={{
                textDecoration: 'none',
                color: theme.palette.text.primary,
                display: 'block',
                whiteSpace: 'normal',
                overflow: 'visible',
                textOverflow: 'unset',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                wordBreak: 'break-word',
                overflowWrap: 'anywhere'
              }}
            >
              {`${post?.users.name} ${post.users.surname}`}
            </Typography>
            <Typography
              variant="caption"
              color={theme.palette.text.secondary}
              display="block"
              sx={{
                whiteSpace: 'normal',
                overflow: 'visible',
                textOverflow: 'unset',
                wordBreak: 'break-word',
                overflowWrap: 'anywhere'
              }}
            >
              {formatDate(post.createdAt)}
            </Typography>
          </Box>
        </Stack>

        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontWeight: 600,
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
            color: theme.palette.text.primary
          }}
        >
          {post.title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 1,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
            color: theme.palette.text.primary,
            background: '#fff',
            borderRadius: 2,
            px: 1,
            py: 0.5
          }}
        >
          {post.description}
        </Typography>

        {imageFiles.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 1,
              mb: 1,
              width: '100%',
              alignItems: isMobile ? 'stretch' : 'center',
              justifyContent: isMobile ? 'flex-start' : 'flex-start',
            }}
          >
            {imageFiles.map((file) => (
              <Box
                key={file.id || file.filename}
                component="img"
                src={`${BACKEND_URL}/static/${file.filename}`}
                alt={file.filename}
                sx={{
                  width: isMobile ? '100%' : 120,
                  maxWidth: '100%',
                  height: isMobile ? 'auto' : 80,
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: 1,
                  cursor: 'pointer',
                  border: `2px solid ${theme.palette.primary.light}`,
                  background: theme.palette.background.default,
                  transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                  mt: 0,
                  mb: isMobile ? 1 : 0,
                  '&:hover': {
                    ...(isMobile
                      ? {}
                      : {
                          transform: 'scale(1.07)',
                          boxShadow: 4,
                          borderColor: theme.palette.secondary.main
                        })
                  }
                }}
                onClick={() => setPreviewFile({ type: 'image', url: `${BACKEND_URL}/static/${file.filename}` })}
              />
            ))}
          </Box>
        )}

        {otherFiles.length > 0 && (
          <Box sx={{ mt: 1, width: '100%' }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              width: '100%',
              alignItems: 'stretch',
            }}>
              {otherFiles.map((file) => (
                <Box key={file.id || file.filename} sx={{ width: '100%' }}>
                  <FilePreview file={file} onPreview={setPreviewFile} />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2, borderColor: theme.palette.primary.light, opacity: 0.5 }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              bgcolor: theme.palette.background.default,
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              fontWeight: 600,
              minWidth: 0,
              flexShrink: 1
            }}
          >
            <Tooltip title="Głosuj w górę">
              <IconButton size="small" sx={{ color: theme.palette.success.main }}>
                <FontAwesomeIcon icon={faChevronUp} />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" fontWeight={700} sx={{ color: theme.palette.text.primary }}>2</Typography>
            <Tooltip title="Głosuj w dół">
              <IconButton size="small" sx={{ color: theme.palette.error.main }}>
                <FontAwesomeIcon icon={faChevronDown} />
              </IconButton>
            </Tooltip>
          </Stack>
          {!isPage && (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<FontAwesomeIcon icon={faComment} />}
              onClick={handleGoToPost}
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                mt: { xs: 1, sm: 0 },
                width: { xs: '100%', sm: 'auto' },
                minWidth: 0,
                flexShrink: 1,
                overflow: 'hidden',
                whiteSpace: 'normal',
                textOverflow: 'unset',
                background: '#fff',
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                '&:hover': {
                  background: theme.palette.secondary.main,
                  color: '#fff',
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              Odpowiedz
            </Button>
          )}
        </Stack>
      </Paper>
      <PreviewModal previewFile={previewFile} onClose={closePreview} />
    </>
  );
};

export default PostPreview;