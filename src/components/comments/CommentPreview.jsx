import { useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  Paper,
  Stack,
  Tooltip,
  useTheme,
  useMediaQuery,
  IconButton,
  Typography,
} from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loader from "../messages/Loader";
import useFileTypeCheck from "../../hooks/useFileTypeCheck";
import AddCommentForm from "../forms/AddCommentForm";
import useFormatDate from "../../hooks/useFormatDate";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid, faTrash } from "@fortawesome/free-solid-svg-icons";
import OptionsMenu from "../menus/OptionsMenu";
import useVoting from "../../hooks/useVoting";
import FilePreviews from "../posts/FilePreviews";
import AuthorInfo from "../user/AuthorInfo";
import VotingBar from "../menus/VotingBar";
import PreviewModal from "../posts/PreviewModal";
import useCommentReplies from "../../hooks/useCommentReplies";
import useDeleteEntity from "../../hooks/useDeleteEntity";

const CommentPreview = ({ comment, onDelete }) => {
  const axiosPrivate = useAxiosPrivate();
  const { isImage } = useFileTypeCheck();
  const [previewFile, setPreviewFile] = useState(null);
  const [isReplying, setIsReplying] = useState(false);

  const formatDate = useFormatDate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { auth } = useAuth();
  const currentUserId = auth?.id;

  const initialTotalVotes = comment.comment_votes?.reduce((sum, v) => sum + v.value, 0) || 0;
  const initialUserVote = comment.comment_votes?.find(v => v.userId === currentUserId)?.value || 0;

  const { vote, voteCount, loading: loadingVote, handleVote } = useVoting({
    initialVote: initialUserVote,
    initialCount: initialTotalVotes,
    onVote: async (value) => axiosPrivate.put(`/comments/${comment.id}/vote`, { value }),
  });

  const [isHelpful, setIsHelpful] = useState(comment.isHelpful || false);
  const [loadingHelpful, setLoadingHelpful] = useState(false);

  const isParentComment = comment.commentId === null;
  const isPostOwner = currentUserId && comment.posts?.userId === currentUserId;
  const isOwnComment = currentUserId && comment.users?.id === currentUserId;

  const {
    replies,
    hasMoreReplies,
    isRepliesVisible,
    repliesErr,
    isLoadingReplies,
    handleToggleReplies,
    handleReplyAdded,
    handleReplyDeleted,
    fetchReplies,
  } = useCommentReplies(comment.id, isParentComment);

  const {
    deleteDialogOpen,
    setDeleteDialogOpen,
    deleteLoading,
    handleDelete,
  } = useDeleteEntity({
    entityId: comment.id,
    entityType: "comment",
    onDelete,
  });

  const imageFiles = comment.files?.filter((file) => isImage(file.filename)) || [];
  const otherFiles = comment.files?.filter((file) => !isImage(file.filename)) || [];
  const closePreview = () => setPreviewFile(null);

  const authorAvatar = comment?.users?.files?.[0]?.filename;

  const handleHelpful = async () => {
    if (loadingHelpful) return;
    setLoadingHelpful(true);
    try {
      await axiosPrivate.put(`/comments/${comment.id}/helpful`, { isHelpful: !isHelpful });
      setIsHelpful((prev) => !prev);
    } finally {
      setLoadingHelpful(false);
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        bgcolor: theme.palette.background.default,
        borderRadius: 3,
        width: "100%",
        border: `1.5px solid ${theme.palette.primary.main}`,
        boxShadow: '0 2px 12px 0 rgba(42,63,84,0.07)',
        overflow: "hidden",
        position: "relative"
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 0.5,
        }}
      >
        <OptionsMenu
          isOwner={isOwnComment}
          loading={deleteLoading}
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          deleteTitle="Usuń komentarz"
          deleteText="Czy na pewno chcesz usunąć ten komentarz? Tej operacji nie można cofnąć."
          onDeleteConfirm={handleDelete}
        >
          <FontAwesomeIcon icon={faTrash} style={{ marginRight: 8 }} />
          Usuń komentarz
        </OptionsMenu>
      </Box>

      <Stack
        direction="row"
        spacing={2}
        alignItems="flex-start"
        mb={1}
        sx={{
          flexWrap: isMobile ? "wrap" : "nowrap",
          alignItems: isMobile ? "flex-start" : "center",
        }}
      >
        <AuthorInfo
          user={comment.users}
          avatar={authorAvatar}
          initial={comment.users.username?.[0]?.toUpperCase()}
          date={formatDate(comment.createdAt)}
          theme={theme}
          isMobile={isMobile}
        />
        <Box
          sx={{
            ml: "auto",
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexShrink: 0,
            minWidth: isMobile ? 40 : "unset",
            mt: isMobile ? 1 : 0,
          }}
        >
          <Tooltip title="Oznaczony jako pomocny">
            <span style={{ display: "flex", alignItems: "center" }}>
              {isHelpful && (
                <FontAwesomeIcon icon={faStarSolid} style={{ color: theme.palette.warning.main, fontSize: 22 }} />
              )}
              {isPostOwner && (
                <IconButton
                  size="small"
                  onClick={handleHelpful}
                  disabled={loadingHelpful}
                  sx={{
                    color: isHelpful ? theme.palette.warning.main : theme.palette.action.active,
                    ml: 1,
                  }}
                >
                  <FontAwesomeIcon icon={faStarSolid} />
                </IconButton>
              )}
            </span>
          </Tooltip>
        </Box>
      </Stack>
      <Typography variant="body1" sx={{ mb: 1, wordBreak: "break-word", color: theme.palette.text.primary }}>
        {comment.content}
      </Typography>
      <FilePreviews
        imageFiles={imageFiles}
        otherFiles={otherFiles}
        setPreviewFile={setPreviewFile}
        theme={theme}
      />

      <VotingBar
        vote={vote}
        voteCount={voteCount}
        loading={loadingVote}
        onVote={handleVote}
        theme={theme}
      />

      {isParentComment && (
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={2}
          mt={1}
          sx={{
            width: "100%",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: isMobile ? "flex-start" : "flex-start",
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={handleToggleReplies}
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              fontWeight: 600,
              width: isMobile ? "100%" : "auto",
              "&:hover": {
                bgcolor: theme.palette.secondary.main,
                color: "#fff",
                borderColor: theme.palette.secondary.main,
              },
            }}
          >
            {isRepliesVisible ? "Ukryj odpowiedzi" : "Pokaż odpowiedzi"}
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setIsReplying((v) => !v)}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: "#fff",
              fontWeight: 600,
              width: isMobile ? "100%" : "auto",
              "&:hover": {
                bgcolor: theme.palette.secondary.main,
                color: "#fff",
              },
            }}
          >
            {isReplying ? "Anuluj" : "Odpowiedz"}
          </Button>
        </Stack>
      )}
      {isReplying && isParentComment && (
        <Box mt={2}>
          <AddCommentForm
            postId={comment.postId}
            parentCommentId={comment.id}
            onCommentAdded={handleReplyAdded}
          />
        </Box>
      )}
      {isParentComment && isRepliesVisible && (
        <Box mt={2} pl={2} borderLeft={`2px dashed ${theme.palette.primary.light}`}>
          {replies.length === 0 && !isLoadingReplies && (
            <Typography variant="body2" color={theme.palette.text.secondary}>
              Brak odpowiedzi
            </Typography>
          )}
          <List disablePadding>
            {replies.map((reply) => (
              <ListItem key={reply.id} disableGutters sx={{ display: "block", px: 0 }}>
                <CommentPreview
                  comment={reply}
                  onDelete={handleReplyDeleted}
                />
              </ListItem>
            ))}
          </List>
          {repliesErr && (
            <Typography variant="body2" color="error">
              {repliesErr}
            </Typography>
          )}
          {isLoadingReplies && <Loader />}
          {!isLoadingReplies && hasMoreReplies && (
            <Button
              variant="outlined"
              size="small"
              onClick={fetchReplies}
              sx={{
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                fontWeight: 600,
                "&:hover": {
                  bgcolor: theme.palette.secondary.main,
                  color: "#fff",
                  borderColor: theme.palette.secondary.main,
                },
                width: isMobile ? "100%" : "auto",
                mt: isMobile ? 1 : 0,
              }}
            >
              Załaduj więcej odpowiedzi
            </Button>
          )}
          {!hasMoreReplies && replies.length > 0 && (
            <Typography variant="caption" color={theme.palette.text.secondary}>
              To już wszystkie odpowiedzi.
            </Typography>
          )}
        </Box>
      )}
      <PreviewModal previewFile={previewFile} onClose={closePreview} />
    </Paper>
  );
};

export default CommentPreview;
