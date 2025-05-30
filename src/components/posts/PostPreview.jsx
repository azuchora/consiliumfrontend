import { useEffect, useState } from 'react';
import useFormatDate from '../../hooks/useFormatDate';
import useFileTypeCheck from '../../hooks/useFileTypeCheck';
import PreviewModal from './PreviewModal';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faStar as faStarSolid, faUser, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import {
  Box,
  Button,
  Paper,
  Divider,
  Stack,
  Chip,
  useMediaQuery,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import OptionsMenu from '../menus/OptionsMenu';
import useVoting from '../../hooks/useVoting';
import FilePreviews from './FilePreviews';
import AuthorInfo from '../user/AuthorInfo';
import VotingBar from '../menus/VotingBar';
import useFollow from '../../hooks/useFollow';
import useDeleteEntity from '../../hooks/useDeleteEntity';

const genderMap = {
  male: 'Mężczyzna',
  female: 'Kobieta'
};

const PostPreview = ({ post, isPage = false, onDelete }) => {
  const { auth } = useAuth();
  const currentUserId = auth?.id;

  const totalVotes = post.post_votes?.reduce((sum, v) => sum + v.value, 0) || 0;
  const userVote = post.post_votes?.find(v => v.userId === currentUserId)?.value || 0;

  const [previewFile, setPreviewFile] = useState(null);

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

  const { followed, followLoading, handleFollowToggle, setFollowed } = useFollow(post, "post");

  useEffect(() => {
    setFollowed(post.isFollowed || false);
  }, [post.isFollowed, post.id, setFollowed]);

  const { vote, voteCount, loading: loadingVote, handleVote } = useVoting({
    initialVote: userVote,
    initialCount: totalVotes,
    onVote: async (value) => axiosPrivate.put(`/posts/${post.id}/vote`, { value }),
  });

  const {
    deleteDialogOpen,
    setDeleteDialogOpen,
    deleteLoading,
    handleDelete,
  } = useDeleteEntity({
    entityId: post.id,
    entityType: "post",
    onDelete,
  });
  
  if (!post?.id) return null;

  const authorAvatar = post?.users?.files?.[0]?.filename;
  const authorInitial = post.users.username?.[0]?.toUpperCase() || '?';

  const isOwnPost = currentUserId && post.users?.id === currentUserId;
  const canFollowPost = currentUserId && !isOwnPost;

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
          position: 'relative',
          '&:hover': {
            boxShadow: '0 8px 32px 0 rgba(42,63,84,0.18)',
            borderColor: theme.palette.secondary.main
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 3,
            right: 3,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 0.5,
          }}
        >
          <OptionsMenu
            isOwner={isOwnPost}
            loading={deleteLoading}
            deleteDialogOpen={deleteDialogOpen}
            setDeleteDialogOpen={setDeleteDialogOpen}
            deleteTitle="Usuń post"
            deleteText="Czy na pewno chcesz usunąć ten post? Tej operacji nie można cofnąć."
            onDeleteConfirm={handleDelete}
          >
            <FontAwesomeIcon icon={faTrash} style={{ marginRight: 8 }} />
            Usuń post
          </OptionsMenu>
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          mb={1}
          sx={{
            minHeight: 48,
            width: '100%',
            flexWrap: 'nowrap',
            overflow: 'visible',
          }}
        >
          <AuthorInfo
            user={post.users}
            avatar={authorAvatar}
            initial={authorInitial}
            date={formatDate(post.createdAt)}
            theme={theme}
            isMobile={isMobile}
          />
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
                  gap: 1,
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

        <FilePreviews
          imageFiles={imageFiles}
          otherFiles={otherFiles}
          setPreviewFile={setPreviewFile}
          theme={theme}
        />

        <Divider sx={{ my: 2, borderColor: theme.palette.primary.light, opacity: 0.5 }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <VotingBar
            vote={vote}
            voteCount={voteCount}
            loading={loadingVote}
            onVote={handleVote}
            theme={theme}
          />
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
