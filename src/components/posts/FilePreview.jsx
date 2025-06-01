import { BACKEND_URL } from '../../api/axios';
import useFileTypeCheck from '../../hooks/useFileTypeCheck';
import { Box, Button, Typography, Paper, useTheme, useMediaQuery, Dialog } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useState } from 'react';

const FilePreview = ({ file, onPreview }) => {
  const { isPreviewable } = useFileTypeCheck();
  const fileUrl = `${BACKEND_URL}/static/${file.filename}`;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isMp4 = file.filename?.toLowerCase().endsWith('.mp4');
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <Paper
        elevation={1}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: isMobile ? 1 : 1.5,
          mb: 1,
          bgcolor: theme.palette.background.default,
          borderRadius: 2,
          border: `1.5px solid ${theme.palette.primary.light}`,
          boxShadow: '0 2px 8px 0 rgba(42,63,84,0.07)',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 0,
          transition: 'box-shadow 0.2s, border-color 0.2s',
          width: '100%',
          minWidth: 0,
          '&:hover': {
            boxShadow: '0 2px 16px 0 rgba(42,63,84,0.13)',
            borderColor: theme.palette.secondary.main,
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flexWrap: 'wrap' }}>
          <InsertDriveFileIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 500,
              wordBreak: 'break-all',
              flex: 1,
              minWidth: 0,
            }}
          >
            {file.filename}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
          {isPreviewable(file.filename) && (
            <Button
              variant="outlined"
              size="small"
              sx={{
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                fontWeight: 600,
                mr: 1,
                '&:hover': {
                  bgcolor: theme.palette.secondary.main,
                  color: '#fff',
                  borderColor: theme.palette.secondary.main,
                },
              }}
              onClick={() => onPreview({ type: 'iframe', url: fileUrl })}
            >
              Podgląd
            </Button>
          )}
          {isMp4 && (
            <Button
              variant="outlined"
              size="small"
              sx={{
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                fontWeight: 600,
                mr: 1,
                '&:hover': {
                  bgcolor: theme.palette.secondary.main,
                  color: '#fff',
                  borderColor: theme.palette.secondary.main,
                },
              }}
              startIcon={<PlayCircleOutlineIcon />}
              onClick={() => setVideoOpen(true)}
            >
              Odtwórz wideo
            </Button>
          )}
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<DownloadIcon />}
            href={fileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              bgcolor: theme.palette.primary.main,
              color: '#fff',
              '&:hover': {
                bgcolor: theme.palette.secondary.main,
                color: '#fff',
              },
            }}
          >
            Pobierz
          </Button>
        </Box>
      </Paper>
      {isMp4 && (
        <Dialog open={videoOpen} onClose={() => setVideoOpen(false)} maxWidth="md" fullWidth disableScrollLock>
          <Box sx={{ p: 2, bgcolor: "#000", display: "flex", justifyContent: "center" }}>
            <video
              src={fileUrl}
              controls
              style={{ width: "100%", maxHeight: "70vh", borderRadius: 8, background: "#000" }}
              preload="metadata"
            />
          </Box>
        </Dialog>
      )}
    </>
  );
};

export default FilePreview;