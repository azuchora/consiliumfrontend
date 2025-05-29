import { Stack, IconButton, Tooltip, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const VotingBar = ({ vote, voteCount, loading, onVote, theme }) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    <Tooltip title="Głosuj w górę">
      <span>
        <IconButton
          size="small"
          sx={{
            color: vote === 1 ? theme.palette.success.dark : theme.palette.success.main,
            bgcolor: vote === 1 ? theme.palette.success.light : 'transparent',
            borderRadius: 1,
            transition: 'background 0.15s, color 0.15s',
          }}
          onClick={() => onVote(1)}
          disabled={loading}
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </IconButton>
      </span>
    </Tooltip>
    <Typography variant="body2" fontWeight={700} sx={{ color: theme.palette.text.primary }}>
      {voteCount}
    </Typography>
    <Tooltip title="Głosuj w dół">
      <span>
        <IconButton
          size="small"
          sx={{
            color: vote === -1 ? theme.palette.error.dark : theme.palette.error.main,
            bgcolor: vote === -1 ? theme.palette.error.light : 'transparent',
            borderRadius: 1,
            transition: 'background 0.15s, color 0.15s',
          }}
          onClick={() => onVote(-1)}
          disabled={loading}
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </IconButton>
      </span>
    </Tooltip>
  </Stack>
);

export default VotingBar;
