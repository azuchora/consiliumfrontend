import {
  Drawer,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  useTheme,
  CircularProgress,
  Slide,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ChatList, MessageList, Input } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import useAuth from "../../hooks/useAuth";
import useConversations from "../../hooks/useConversations";
import useMessages from "../../hooks/useMessages";
import { BACKEND_URL } from "../../api/axios";
import { useEffect } from "react";

const ChatMenu = ({ open, onClose, mobile }) => {
  const theme = useTheme();
  const { auth } = useAuth();

  const {
    conversations,
    loadingConvs,
    selectConversation,
    fetchConversations,
    selectedConv,
    setSelectedConv,
  } = useConversations(auth);

  const {
    messages,
    hasMore,
    fetchMessages,
    fetchMoreMessages,
    msgInput,
    setMsgInput,
    sending,
    handleSend,
    chatScrollableRef,
    messagesEndRef,
    setMessages,
    setHasMore,
  } = useMessages(selectedConv);

  useEffect(() => {
    if (open && auth?.id) fetchConversations();
  }, [open, fetchConversations, auth?.id]);

  useEffect(() => {
    if (selectedConv && auth?.id) {
      fetchMessages({ reset: true });
      setHasMore(true);
    } else if (auth?.id) {
      setMessages([]);
    }
  }, [selectedConv, fetchMessages, setMessages, setHasMore, auth?.id]);

  if (!auth?.id) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  const chatListItems = conversations?.map((conv) => {
    const otherId = conv.user1Id === auth.id ? conv.user2Id : conv.user1Id;
    const otherUser =
      (conv.user1 && conv.user2)
        ? (conv.user1Id === auth.id ? conv.user2 : conv.user1)
        : { username: `Użytkownik #${otherId}` };

    const lastMessage = conv.messages?.[0]?.content || "";

    return {
      id: conv?.id,
      avatar: otherUser?.files?.[0]?.filename
        ? `${BACKEND_URL}/static/${otherUser.files[0].filename}`
        : undefined,
      alt: otherUser?.username,
      title:
        `${otherUser?.name || ""} ${otherUser?.surname || ""}`.trim() ||
        otherUser?.username ||
        `Użytkownik #${otherId}`,
      subtitle: lastMessage,
      dateString: conv.lastMessageAt ? 
        formatDistanceToNow(new Date(conv.lastMessageAt), { locale: pl, addSuffix: true })
        : null,
      unread: false,
    };
  });

  const messageListItems = messages.map((msg) => ({
    position: msg.senderId === auth.id ? "right" : "left",
    type: "text",
    text: msg.content,
    title: undefined,
    status: msg.read ? "read" : "waiting",
    date: new Date(msg.createdAt),
    dateString: formatDistanceToNow(new Date(msg.createdAt), { locale: pl, addSuffix: true }),
  }));

  const chatContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden",
      }}
    >
      <AppBar
        position="sticky"
        color="primary"
        elevation={1}
        sx={{
          top: 0,
          zIndex: 1301,
          borderRadius: 0,
          bgcolor: theme.palette.primary.main,
          marginTop: !mobile ? { xs: '56px', sm: '64px' } : 0,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 56,
            px: 2,
            bgcolor: theme.palette.primary.main,
            display: "flex",
            alignItems: "center",
          }}
        >
          {selectedConv ? (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setSelectedConv(null)}
              sx={{
                mr: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                width: 40,
              }}
              aria-label="Powrót do listy rozmów"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </IconButton>
          ) : null}
          <Typography variant="h6" sx={{ flex: 1, color: "#fff", fontWeight: 600 }}>
            {selectedConv
              ? (() => {
                  const otherId = selectedConv.user1Id === auth.id ? selectedConv.user2Id : selectedConv.user1Id;
                  const otherUser =
                    (selectedConv.user1 && selectedConv.user2)
                      ? (selectedConv.user1Id === auth.id ? selectedConv.user2 : selectedConv.user1)
                      : { username: `Użytkownik #${otherId}` };
                  return (
                    `${otherUser?.name} ${otherUser?.surname}`.trim()
                  );
                })()
              : "Twoje rozmowy"}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            sx={{
              ml: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              width: 40,
            }}
            aria-label="Zamknij czat"
          >
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </Toolbar>
      </AppBar>
      {selectedConv ? (
        <Box
          id="chat-scrollable"
          ref={chatScrollableRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 1, sm: 2 },
            bgcolor: "#f5f5f5",
            display: "flex",
            flexDirection: "column-reverse",
            minHeight: 0,
            width: "100%",
            maxWidth: "100vw",
            overflowX: "hidden",
          }}
        >
          <InfiniteScroll
            dataLength={messages.length}
            next={fetchMoreMessages}
            hasMore={hasMore}
            inverse={true}
            loader={
              <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                <CircularProgress size={20} />
              </Box>
            }
            scrollableTarget="chat-scrollable"
            style={{ display: "flex", flexDirection: "column-reverse", width: "100%" }}
          >
            <MessageList
              className="message-list"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={messageListItems}
              style={{ width: "100%", maxWidth: "100vw", overflowX: "hidden" }}
            />
            <div ref={messagesEndRef} />
          </InfiniteScroll>
        </Box>
      ) : (
        <Box sx={{
          flex: 1,
          overflowY: "auto",
          p: { xs: 1, sm: 2 },
          bgcolor: "#f5f5f5",
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
        }}>
          {loadingConvs ? (
            <CircularProgress />
          ) : conversations.length === 0 ? (
            <Typography sx={{ color: "#888", textAlign: "center", mt: 4 }}>
              Brak rozmów. Zacznij nową rozmowę z użytkownikiem!
            </Typography>
          ) : (
            <ChatList
              className="chat-list"
              dataSource={chatListItems}
              onClick={(item) => {
                const conv = conversations.find((c) => c.id === item.id);
                if (conv) selectConversation(conv);
              }}
              style={{ width: "100%", maxWidth: "100vw", overflowX: "hidden" }}
            />
          )}
        </Box>
      )}
      {selectedConv && (
        <Box sx={{
          p: { xs: 1, sm: 2 },
          borderTop: "1px solid #eee",
          bgcolor: "#fff",
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
        }}>
          <Input
            placeholder="Napisz wiadomość..."
            multiline={false}
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            rightButtons={
              <IconButton
                color="primary"
                disabled={sending || !msgInput.trim()}
                onClick={handleSend}
              >
                <span style={{ fontWeight: 700 }}>Wyślij</span>
              </IconButton>
            }
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            style={{ width: "100%", maxWidth: "100vw" }}
          />
        </Box>
      )}
    </Box>
  );

  if (mobile) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose} 
        fullScreen 
        PaperProps={{ sx: { zIndex: 2000 } }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
      >
        {chatContent}
      </Dialog>
    );
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      disableScrollLock
      PaperProps={{
        sx: { width: 400, maxWidth: "100vw", p: 0, bgcolor: "#fff" },
      }}
    >
      {chatContent}
    </Drawer>
  );
};

export default ChatMenu;