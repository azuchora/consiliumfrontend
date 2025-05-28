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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  useEffect(() => {
    if (!anchorEl || isMobile) return;

    const handleScroll = (e) => {
      if (
        notificationsScrollRef.current &&
        notificationsScrollRef.current.contains(e.target)
      ) {
        return;
      }
      setAnchorEl(null);
      markAllAsRead();
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [anchorEl, markAllAsRead, isMobile]);

  if (!isAuthed()) return null;

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
            notifications.map((n) => (
              <ListItem
                key={n.id}
                sx={{
                  borderBottom: "1px solid #eee",
                  bgcolor: n.read ? "#fff" : "#e3f2fd",
                  py: 1.5,
                  px: 2,
                  alignItems: "flex-start",
                }}
              >
                <ListItemText
                  primary={n.title || n.content || "Nowe powiadomienie"}
                  secondary={n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                  primaryTypographyProps={{
                    fontWeight: n.read ? 400 : 600,
                    color: n.read ? "#333" : "#1976d2",
                  }}
                  secondaryTypographyProps={{
                    fontSize: "0.85rem",
                    color: "#888",
                  }}
                />
              </ListItem>
            ))
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