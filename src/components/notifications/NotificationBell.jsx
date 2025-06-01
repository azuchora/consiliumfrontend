import { useEffect, useRef, useState } from "react";
import {
  IconButton,
  Badge,
  Popover,
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Slide,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTimes } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import useNotifications from "../../hooks/useNotifications";
import InfiniteScroll from "react-infinite-scroll-component";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../api/axios";
import useFormatDate from "../../hooks/useFormatDate";

const getNotificationMessage = (notification, onUsernameClick) => {
  const { type, metadata } = notification;
  const { username } = metadata || {};

  const usernameNode = (
    <Box
      component="span"
      sx={{ color: "#1976d2", cursor: "pointer", fontWeight: 600, display: "inline" }}
      onClick={e => {
        e.stopPropagation();
        onUsernameClick(username);
      }}
    >
      @{username}
    </Box>
  );

  const isPostFollower = metadata?.isFollower;
  
  switch (type) {
    case "new_comment":
      return isPostFollower ? (
        <>{usernameNode} skomentował(a) obserwowany post</>
      ) : (
        <>{usernameNode} skomentował(a) Twój post</>
      )
    case "comment_reply":
      return <>{usernameNode} odpowiedział(a) na Twój komentarz</>;
    case "new_post":
      return <>{usernameNode} dodał(a) nowy post</>;
    case "post_voted":
      return <>{usernameNode} zagłosował(a) na Twój post</>;
    default:
      return <>Nowa aktywność od {usernameNode}</>;
  }
};

const getAvatarUrl = (notification) => {
  const { metadata } = notification;
  if (!metadata?.avatarFilename) return undefined;
  return `${BACKEND_URL}/static/${metadata.avatarFilename}`;
};

const getNotificationUrl = (notification) => {
  const { type, metadata } = notification;
  switch (type) {
    case "comment_reply":
    case "new_comment":
      return `/posts/${metadata.postId}`;
    case "new_post":
      return `/posts/${metadata.postId}`;
    case "post_voted":
      return `/posts/${metadata.postId}`;
    default:
      return "/";
  }
};

const NotificationBell = ({ mobile = false }) => {
  const { isAuthed } = useAuth();
  const {
    notifications,
    unreadCount,
    hasMore,
    loading,
    fetchNotifications,
    markAllAsRead,
    before,
  } = useNotifications();

  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const notificationsScrollRef = useRef();

  const formatDate = useFormatDate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthed()) {
      fetchNotifications(null, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed]);

  const handleOpen = (event) => {
    if (isMobile) {
      setDialogOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
    fetchNotifications(null, true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDialogOpen(false);
    markAllAsRead();
  };

  const fetchMore = () => {
    if (notifications.length > 0 && hasMore && !loading && before) {
      fetchNotifications(before, false);
    }
  };

  if (!isAuthed()) return null;

  const handleUsernameClick = (username) => {
    handleClose();
    navigate(`/users/${username}`);
  };

  const NotificationList = (
    <Box
      id="notifications-scroll"
      ref={notificationsScrollRef}
      sx={{
        height: isMobile ? "calc(100vh - 56px)" : 340,
        overflowY: "auto",
        minHeight: 80,
        bgcolor: isMobile ? "#fff" : undefined,
      }}
    >
      <InfiniteScroll
        dataLength={notifications.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        }
        scrollableTarget="notifications-scroll"
        style={{ overflow: "visible" }}
        endMessage={
          notifications.length > 0 && (
            <Typography sx={{ p: 2, color: "#888", textAlign: "center" }}>
              To już wszystkie powiadomienia.
            </Typography>
          )
        }
      >
        <List disablePadding>
          {notifications.length === 0 && !loading ? (
            <Typography sx={{ p: 2, color: "#888", textAlign: "center" }}>
              Brak powiadomień
            </Typography>
          ) : (
            notifications.map((n) => {
              const avatarUrl = getAvatarUrl(n);
              const initial =
                n.metadata?.username?.[0]?.toUpperCase() || "?";
              if (n.type === "new_message") return null;
              return (
                <ListItem
                  key={n.id}
                  button
                  onClick={() => {
                    const url = getNotificationUrl(n);
                    handleClose();
                    navigate(url);
                  }}
                  sx={{
                    borderBottom: "1px solid #eee",
                    bgcolor: n.read ? "#fff" : "#e3f2fd",
                    py: 1.5,
                    px: 2,
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    "&:hover": { bgcolor: "#e3f2fd" },
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
                    <Avatar
                      src={avatarUrl}
                      alt={n.metadata?.username || ""}
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: theme.palette.primary.main,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 22,
                        border: `2px solid ${theme.palette.secondary.main}`,
                        flexShrink: 0,
                      }}
                    >
                      {!avatarUrl && initial}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={getNotificationMessage(n, handleUsernameClick)}
                    secondary={
                      n.createdAt
                        ? formatDate(n.createdAt)
                        : ""
                    }
                    primaryTypographyProps={{
                      fontWeight: n.read ? 400 : 600,
                      color: n.read ? "#333" : "#1976d2",
                      sx: { ml: 0 },
                    }}
                    secondaryTypographyProps={{
                      fontSize: "0.85rem",
                      color: "#888",
                      sx: { ml: 0 },
                    }}
                  />
                </ListItem>
              );
            })
          )}
        </List>
      </InfiniteScroll>
    </Box>
  );

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleOpen}
        sx={{ ml: 1, color: mobile ? "#fff" : undefined }}
        aria-label="Powiadomienia"
      >
        <Badge badgeContent={unreadCount} color="error">
          <FontAwesomeIcon icon={faBell} />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl) && !isMobile}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: mobile ? "left" : "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: mobile ? "left" : "right",
        }}
        PaperProps={{
          sx: {
            width: 340,
            maxHeight: 400,
            p: 0,
            borderRadius: 2,
            boxShadow: 4,
            overflow: "hidden",
          },
        }}
        disableScrollLock
        disableRestoreFocus
      >
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #eee",
            fontWeight: 700,
            fontSize: "1.1rem",
            bgcolor: "#f5f5f5",
          }}
        >
          Powiadomienia
        </Box>
        {NotificationList}
      </Popover>

      <Dialog
        fullScreen
        open={dialogOpen && isMobile}
        onClose={handleClose}
        disableScrollLock
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
        PaperProps={{
          sx: { bgcolor: "#fff" },
        }}
      >
        <AppBar position="sticky" color="primary" sx={{ boxShadow: 1 }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              Powiadomienia
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </Toolbar>
        </AppBar>
        {NotificationList}
        <Box sx={{ height: 16 }} />
      </Dialog>
    </>
  );
};

export default NotificationBell;