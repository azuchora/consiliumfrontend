import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../../api/axios';
import useFormatDate from '../../hooks/useFormatDate';
import useFileTypeCheck from '../../hooks/useFileTypeCheck';
import FilePreview from './FilePreview';
import PreviewModal from './PreviewModal';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faChevronUp, faChevronDown, faStar as faStarSolid, faUser } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
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
  Chip,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';

const genderMap = {
  male: 'Mężczyzna',
  female: 'Kobieta'
};

const PostPreview = ({ post, isPage = false }) => {
  const { auth } = useAuth();
  const currentUserId = auth?.id;

  const totalVotes = post.post_votes?.reduce((sum, v) => sum + v.value, 0) || 0;
  const userVote = post.post_votes?.find(v => v.userId === currentUserId)?.value || 0;

  const [previewFile, setPreviewFile] = useState(null);
  const [vote, setVote] = useState(userVote);
  const [voteCount, setVoteCount] = useState(totalVotes);
  const [followed, setFollowed] = useState(post.isFollowed || false);
  const [followLoading, setFollowLoading] = useState(false);
  const [loadingVote, setLoadingVote] = useState(false);
  const axiosPrivate = useAxiosPrivate();

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

  useEffect(() => {
    setVote(userVote);
    setVoteCount(totalVotes);
  }, [userVote, totalVotes, post.id, currentUserId]);

  useEffect(() => {
    setFollowed(post.isFollowed || false);
  }, [post.isFollowed, post.id]);

  if (!post?.id) return null;

  const authorAvatar = post?.users?.files?.[0]?.filename;
  const authorInitial = post.users.username?.[0]?.toUpperCase() || '?';

  const handleVote = async (value) => {
    if (loadingVote) return;
    setLoadingVote(true);

    let newVote;
    let newVoteCount;

    if (vote === value) {
      newVote = 0;
      newVoteCount = voteCount - vote;
    } else {
      newVote = value;
      newVoteCount = voteCount - vote + value;
    }

    try {
      await axiosPrivate.put(`/posts/${post.id}/vote`, { value: newVote });
      setVote(newVote);
      setVoteCount(newVoteCount);
    } catch (err) {
      console.log(`Voting error: ${err.message}`);
    } finally {
      setLoadingVote(false);
    }
  };

  const isOwnPost = currentUserId && post.users?.id === currentUserId;
  const canFollowPost = currentUserId && !isOwnPost;
  const handleFollowToggle = async () => {
    if (!canFollowPost) return;
    setFollowLoading(true);
    try {
      if (followed) {
        await axiosPrivate.delete(`/posts/${post.id}/follow`);
        setFollowed(false);
      } else {
        await axiosPrivate.post(`/posts/${post.id}/follow`);
        setFollowed(true);
      }
    } catch (e) {
      
    } finally {
      setFollowLoading(false);
    }
  };

  const age = post.age;
  const gender = post.gender ? genderMap[post.gender] || post.gender : null;

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
          sx={{
            minHeight: 48,
            width: '100%',
            flexWrap: 'nowrap',
            overflow: 'visible'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 48,
              mr: 1,
              p: 0,
            }}
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
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              flex: 1,
              minWidth: 0,
              width: '100%',
              gap: 0.2,
              overflow: 'visible'
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
                overflow: isMobile ? 'visible' : 'hidden',
                textOverflow: isMobile ? 'unset' : 'ellipsis',
                whiteSpace: isMobile ? 'normal' : 'nowrap',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                minWidth: 0,
                flexShrink: 0,
                flexGrow: 1,
                wordBreak: isMobile ? 'break-word' : 'normal',
                maxWidth: '100%',
                mr: 0,
              }}
            >
              {`${post?.users.name} ${post.users.surname}`}
            </Typography>
            <Typography
              variant="caption"
              color={theme.palette.text.secondary}
              sx={{
                whiteSpace: isMobile ? 'normal' : 'nowrap',
                overflow: isMobile ? 'visible' : 'hidden',
                textOverflow: isMobile ? 'unset' : 'ellipsis',
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                mt: 0.2,
                mb: 0.2,
                width: '100%',
                minWidth: 0,
                display: 'block',
                wordBreak: isMobile ? 'break-word' : 'normal',
              }}
            >
              {formatDate(post.createdAt)}
            </Typography>
          </Box>
          {!isMobile && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                ml: 2,
                flexShrink: 0,
                minWidth: 0,
                maxWidth: '50%',
              }}
            >
              {isOwnPost && (
                <Chip
                  icon={<FontAwesomeIcon icon={faUser} style={{ fontSize: 16 }} />}
                  label="Twój post"
                  size="small"
                  sx={{
                    bgcolor: theme.palette.info.light,
                    color: theme.palette.info.dark,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    lineHeight: 1.2,
                    px: 1.5,
                    fontSize: '0.95em',
                    minWidth: 110,
                    maxWidth: 220,
                    width: 'auto',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flexShrink: 0,
                  }}
                />
              )}
              {canFollowPost && (
                <Button
                  variant={followed ? "contained" : "outlined"}
                  color={followed ? "secondary" : "primary"}
                  size="small"
                  startIcon={
                    followed ? (
                      <FontAwesomeIcon icon={faStarSolid} />
                    ) : (
                      <FontAwesomeIcon icon={faStarRegular} />
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    minWidth: 0,
                    width: 'auto',
                    whiteSpace: 'nowrap',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    lineHeight: 1.2,
                    textAlign: 'center',
                    px: 1,
                    maxWidth: 180,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  disabled={followLoading}
                  onClick={handleFollowToggle}
                >
                  {followed ? "Obserwujesz" : "Obserwuj post"}
                </Button>
              )}
            </Stack>
          )}
        </Stack>
        {isMobile && (
          <>
            {isOwnPost && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: '100%',
                  mb: 1,
                  mt: 0,
                  overflow: 'hidden',
                }}
              >
                <Chip
                  icon={<FontAwesomeIcon icon={faUser} style={{ fontSize: 16 }} />}
                  label="Twój post"
                  size="small"
                  sx={{
                    bgcolor: theme.palette.info.light,
                    color: theme.palette.info.dark,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    lineHeight: 1.2,
                    px: 1.5,
                    fontSize: '0.95em',
                    minWidth: 110,
                    maxWidth: 220,
                    width: 'auto',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flexShrink: 0,
                  }}
                />
              </Box>
            )}
            {canFollowPost && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  flexShrink: 0,
                  minWidth: 0,
                  width: '100%',
                  mt: 0.5,
                  mb: 1,
                  overflow: 'hidden',
                  maxWidth: '100%',
                }}
              >
                <Button
                  variant={followed ? "contained" : "outlined"}
                  color={followed ? "secondary" : "primary"}
                  size="small"
                  startIcon={
                    followed ? (
                      <FontAwesomeIcon icon={faStarSolid} />
                    ) : (
                      <FontAwesomeIcon icon={faStarRegular} />
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    minWidth: 0,
                    width: '100%',
                    whiteSpace: 'nowrap',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    lineHeight: 1.2,
                    textAlign: 'center',
                    px: 1,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  disabled={followLoading}
                  onClick={handleFollowToggle}
                >
                  {followed ? "Obserwujesz" : "Obserwuj post"}
                </Button>
              </Box>
            )}
          </>
        )}
        {(age || gender) && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={isMobile ? 'flex-start' : 'flex-end'}
            sx={{
              minWidth: 0,
              width: isMobile ? '100%' : 'auto',
              mt: 1,
              mb: 1,
              flexWrap: 'wrap',
              gap: 1,
              maxWidth: '100%',
              flexShrink: 0,
            }}
          >
            {age && (
              <Chip
                label={`Wiek: ${age}`}
                size="small"
                sx={{
                  bgcolor: theme.palette.secondary.light,
                  color: theme.palette.secondary.dark,
                  fontWeight: 600,
                  whiteSpace: isMobile ? 'normal' : 'nowrap',
                  wordBreak: isMobile ? 'break-word' : 'normal',
                  overflowWrap: isMobile ? 'anywhere' : 'normal',
                  lineHeight: 1.2,
                  px: 1.5,
                  fontSize: '0.95em',
                  minWidth: isMobile ? 0 : 90,
                  maxWidth: isMobile ? '100%' : 120,
                  overflow: 'hidden',
                  textOverflow: isMobile ? 'unset' : 'ellipsis',
                }}
              />
            )}
            {gender && (
              <Chip
                label={`Płeć: ${gender}`}
                size="small"
                sx={{
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.dark,
                  fontWeight: 600,
                  whiteSpace: isMobile ? 'normal' : 'nowrap',
                  wordBreak: isMobile ? 'break-word' : 'normal',
                  overflowWrap: isMobile ? 'anywhere' : 'normal',
                  lineHeight: 1.2,
                  px: 1.5,
                  fontSize: '0.95em',
                  minWidth: isMobile ? 0 : 140,
                  maxWidth: isMobile ? '100%' : 140,
                  overflow: 'hidden',
                  textOverflow: isMobile ? 'unset' : 'ellipsis',
                }}
              />
            )}
          </Stack>
        )}

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
              <IconButton
                size="small"
                sx={{
                  color: vote === 1 ? theme.palette.success.dark : theme.palette.success.main,
                  bgcolor: vote === 1 ? theme.palette.success.light : 'transparent',
                  borderRadius: 1,
                  transition: 'background 0.15s, color 0.15s',
                }}
                onClick={() => handleVote(1)}
                disabled={loadingVote}
              >
                <FontAwesomeIcon icon={faChevronUp} />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" fontWeight={700} sx={{ color: theme.palette.text.primary }}>
              {voteCount}
            </Typography>
            <Tooltip title="Głosuj w dół">
              <IconButton
                size="small"
                sx={{
                  color: vote === -1 ? theme.palette.error.dark : theme.palette.error.main,
                  bgcolor: vote === -1 ? theme.palette.error.light : 'transparent',
                  borderRadius: 1,
                  transition: 'background 0.15s, color 0.15s',
                }}
                onClick={() => handleVote(-1)}
                disabled={loadingVote}
              >
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
                lineHeight: 1.2,
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
                textAlign: 'center',
                px: 1,
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