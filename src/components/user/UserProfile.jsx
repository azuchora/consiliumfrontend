import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { BACKEND_URL } from "../../api/axios";
import {
  Box,
  Avatar,
  Typography,
  Paper,
  Button,
  Stack,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  List,
  ListItem,
  Dialog,
  DialogContent,
  IconButton,
  Collapse,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PostPreview from "../posts/PostPreview";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../constants/roles";
import usePostsFetcher from "../../hooks/usePostsFetcher";
import InfiniteScroll from "react-infinite-scroll-component";
import EditProfile from "./EditProfile";
import useFollow from "../../hooks/useFollow";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ChatMenu from "../chat/ChatMenu";

const getRoleDisplay = (roleIds) => {
  if (!Array.isArray(roleIds)) return { label: "Nieznany", color: "default", textColor: undefined };

  const idToName = Object.entries(ROLES).reduce((acc, [name, id]) => {
    acc[id] = name;
    return acc;
  }, {});

  const roles = roleIds.map((id) => idToName[id] || id);

  if (roles.includes("Admin")) {
    return { label: "Administrator", color: "error", textColor: "#fff" };
  }
  if (roles.includes("Verified")) {
    return { label: "Zweryfikowany", color: "success", textColor: undefined };
  }
  if (roles.includes("User")) {
    return { label: "Niezweryfikowany", color: "warning", textColor: undefined };
  }
  return { label: roles.join(", "), color: "default", textColor: undefined };
};

const UserProfile = () => {
  const { username } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { auth, isAdmin } = useAuth();
  const navigate = useNavigate();

  const { user, loading, fetchUser } = useUser(username);

  const [editOpen, setEditOpen] = useState(false);
  const [showPosts, setShowPosts] = useState(false);

  const {
    posts,
    hasMore,
    isLoading,
    fetchPosts,
    resetPosts,
    setPosts,
  } = usePostsFetcher({ username });
  
  const { followed, followLoading, handleFollowToggle, setFollowed } = useFollow(user, "user");

  const axiosPrivate = useAxiosPrivate();
  const [chatOpen, setChatOpen] = useState(false);
  const [initialConversation, setInitialConversation] = useState(null);

  useEffect(() => {
    resetPosts();
    fetchPosts(null, true);
  }, [username]);

  useEffect(() => {
    setFollowed(user?.isFollowed || false);
  }, [user?.isFollowed, user?.id, setFollowed]);

  const handleProfileUpdated = () => {
    setEditOpen(false);
    fetchUser();
  };

  const loadMorePosts = () => {
    const lastTimestamp = posts.length > 0 ? posts[posts.length - 1].createdAt : null;
    fetchPosts(lastTimestamp, false);
  };

  const roleDisplay = useMemo(() => getRoleDisplay(user?.roles), [user]);

  const authedUsername = auth?.username;
  const authedId = auth?.id;
  const canEdit = (authedUsername && authedUsername === user?.username) || isAdmin();
  const canFollow = authedUsername && user && authedUsername !== user.username;
  const canChat = authedId && user && authedId !== user.id;

  const avatarUrl =
    user?.files && user.files.length > 0
      ? `${BACKEND_URL}/static/${user.files[0].filename}`
      : undefined;

  const handlePostDeleted = (deletedId) => {
    setPosts(prev => prev.filter(p => p.id !== deletedId));
  };

  const handleStartChat = async () => {
    try {
      const res = await axiosPrivate.post("/conversations", { userId: user.id });
      setInitialConversation(res.data.conversation);
      setChatOpen(true);
    } catch (e) {
      
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Typography variant="h5" color="error">
          Nie znaleziono użytkownika.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        mt: 4,
        px: { xs: 1, sm: 2 },
        width: "100%",
      }}
    >
      <Box sx={{ mb: 1 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            color: "primary.main",
            mb: 1,
          }}
          aria-label="Powrót"
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          background: theme.palette.background.default,
          border: `1.5px solid ${theme.palette.primary.main}`,
          boxShadow: "0 2px 12px 0 rgba(42,63,84,0.07)",
          mb: 4,
        }}
      >
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={4}
          alignItems="center"
          justifyContent="flex-start"
        >
          <Avatar
            src={avatarUrl}
            alt={user.username}
            sx={{
              width: 100,
              height: 100,
              bgcolor: theme.palette.primary.main,
              color: "#fff",
              fontWeight: 700,
              fontSize: 40,
              border: `3px solid ${theme.palette.secondary.main}`,
              mb: isMobile ? 2 : 0,
            }}
          >
            {!avatarUrl && user.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h5"
              fontWeight={700}
              color={theme.palette.primary.main}
              sx={{ mb: 1, wordBreak: "break-word" }}
            >
              {user.name} {user.surname}
            </Typography>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.secondary}
              sx={{ mb: 1, wordBreak: "break-word" }}
            >
              @{user.username}
            </Typography>
            <Stack direction="row" sx={{ mb: 1, flexWrap: "wrap", gap: 1 }}>
              <Chip
                label={`ID: ${user.id}`}
                size="small"
                sx={{
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.dark,
                  fontWeight: 600,
                }}
              />
              <Chip
                label={`Dołączył: ${new Date(user.createdAt).toLocaleDateString()}`}
                size="small"
                sx={{
                  bgcolor: theme.palette.secondary.light,
                  color: theme.palette.secondary.dark,
                  fontWeight: 600,
                }}
              />
              <Chip
                label={roleDisplay.label}
                size="small"
                color={roleDisplay.color !== "default" ? roleDisplay.color : undefined}
                sx={{
                  bgcolor:
                    roleDisplay.color === "error"
                      ? theme.palette.error.main
                      : roleDisplay.color === "success"
                      ? theme.palette.success.light
                      : roleDisplay.color === "warning"
                      ? theme.palette.warning.light
                      : theme.palette.info.light,
                  color:
                    roleDisplay.textColor
                      ? roleDisplay.textColor
                      : roleDisplay.color === "error"
                      ? "#fff"
                      : roleDisplay.color === "success"
                      ? theme.palette.success.dark
                      : roleDisplay.color === "warning"
                      ? theme.palette.warning.dark
                      : theme.palette.info.dark,
                  fontWeight: 700,
                  border: roleDisplay.color === "error" ? `2px solid ${theme.palette.error.dark}` : undefined,
                }}
              />
            </Stack>
            <Stack
              direction={"row"}
              alignItems="center"
              justifyContent="flex-start"
              sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}
            >
              {canEdit && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: theme.palette.secondary.main,
                      color: "#fff",
                      borderColor: theme.palette.secondary.main,
                    },
                  }}
                  onClick={() => setEditOpen(true)}
                >
                  Edytuj profil
                </Button>
              )}

              {canFollow && (
                <Button
                  variant={followed ? "contained" : "outlined"}
                  color={followed ? "secondary" : "primary"}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    minWidth: 120,
                  }}
                  disabled={followLoading}
                  onClick={handleFollowToggle}
                >
                  {followed ? "Obserwujesz" : "Obserwuj"}
                </Button>
              )}

              {canChat && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    minWidth: 120,
                  }}
                  onClick={handleStartChat}
                >
                  Rozpocznij czat
                </Button>
              )}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: "#fff",
          border: `1.5px solid ${theme.palette.primary.light}`,
          boxShadow: "0 2px 8px 0 rgba(42,63,84,0.07)",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            color={theme.palette.primary.main}
          >
            Posty użytkownika
          </Typography>
          <IconButton
            onClick={() => setShowPosts((prev) => !prev)}
            aria-label={showPosts ? "Ukryj posty" : "Pokaż posty"}
            sx={{
              color: theme.palette.primary.main,
              ml: 1,
              transition: "transform 0.2s",
              transform: showPosts ? "rotate(0deg)" : "rotate(-90deg)",
            }}
          >
            {showPosts ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Collapse in={showPosts}>
          <List sx={{ width: "100%" }}>
            <InfiniteScroll
              dataLength={posts.length}
              next={loadMorePosts}
              hasMore={hasMore}
              loader={
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                  <CircularProgress />
                </Box>
              }
              endMessage={
                posts.length > 0 && (
                  <Box
                    sx={{
                      textAlign: "center",
                      color: "#888",
                      fontSize: "1.1rem",
                      mt: 4,
                      mb: 2,
                      fontStyle: "italic",
                      opacity: 0.8,
                    }}
                  >
                    To już wszystkie posty.
                  </Box>
                )
              }
              scrollThreshold={0.95}
              style={{ overflow: "visible" }}
            >
              {posts.length === 0 && !isLoading ? (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{ py: 4 }}
                >
                  Użytkownik nie dodał jeszcze żadnych postów.
                </Typography>
              ) : (
                posts.map((post) => (
                  <ListItem key={post.id ?? post.createdAt} disablePadding sx={{ mb: 2 }}>
                    <PostPreview post={post} onDelete={handlePostDeleted}/>
                  </ListItem>
                ))
              )}
            </InfiniteScroll>
          </List>
        </Collapse>
      </Paper>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth disableScrollLock>
        <DialogContent
          sx={{
            p: 1,
            pt: 2,
            pb: 2,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <EditProfile user={user} onClose={() => setEditOpen(false)} onUpdated={handleProfileUpdated} />
        </DialogContent>
      </Dialog>

      <ChatMenu
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        mobile={isMobile}
        initialConversation={initialConversation}
      />
    </Box>
  );
};

export default UserProfile;