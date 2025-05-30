import { Box, Avatar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../api/axios";

const AuthorInfo = ({ user, avatar, initial, date, theme, isMobile }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Link to={`/users/${user.username}`}>
      <Avatar
        src={avatar ? `${BACKEND_URL}/static/${avatar}` : undefined}
        alt={user.username}
        sx={{
          width: 40,
          height: 40,
          bgcolor: theme.palette.primary.main,
          color: "#fff",
          fontWeight: 700,
          border: `2px solid ${theme.palette.secondary.main}`,
          flexShrink: 0,
        }}
      >
        {!avatar && initial}
      </Avatar>
    </Link>
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography
        variant="subtitle1"
        component={Link}
        to={`/users/${user.username}`}
        sx={{
          textDecoration: "none",
          color: theme.palette.text.primary,
          fontWeight: 600,
          "&:hover": { color: theme.palette.primary.main },
          wordBreak: 'break-word',
          fontSize: '1.1em',
        }}
      >
        {`${user.name} ${user.surname}`}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.8em' }}>
        {date}
      </Typography>
    </Box>
  </Box>
);

export default AuthorInfo;
