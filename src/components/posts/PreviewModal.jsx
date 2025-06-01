import { Modal, Box, IconButton, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PreviewModal = ({ previewFile, onClose }) => {
  const theme = useTheme();

  if (!previewFile) return null;

  return (
    <Modal open={!!previewFile} onClose={onClose} disableScrollLock>
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: theme.palette.background.paper,
          borderRadius: 3,
          boxShadow: 24,
          p: 2,
          maxWidth: '95vw',
          maxHeight: '90vh',
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            alignSelf: 'flex-end',
            mb: 1,
            color: theme.palette.primary.main,
            bgcolor: theme.palette.background.default,
            '&:hover': {
              bgcolor: theme.palette.secondary.main,
              color: '#fff',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            width: { xs: '80vw', sm: '60vw', md: '50vw', lg: '40vw' },
            maxWidth: '90vw',
            maxHeight: '75vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
            p: 1,
            boxShadow: 1,
            overflow: 'auto',
          }}
        >
          {previewFile.type === 'image' && (
            <Box
              component="img"
              src={previewFile.url}
              alt="Preview"
              sx={{
                maxWidth: '100%',
                maxHeight: '70vh',
                borderRadius: 2,
                boxShadow: 2,
                display: 'block',
                mx: 'auto',
              }}
            />
          )}
          {previewFile.type === 'iframe' && (
            <Box
              component="iframe"
              src={previewFile.url}
              title="File Preview"
              sx={{
                width: '100%',
                height: { xs: '60vh', sm: '70vh' },
                border: 'none',
                borderRadius: 2,
                boxShadow: 2,
                background: '#fff',
              }}
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default PreviewModal;