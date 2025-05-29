import { IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const OptionsMenu = ({
  isOwner,
  loading,
  onDeleteClick,
  deleteDialogOpen,
  setDeleteDialogOpen,
  deleteTitle,
  deleteText,
  onDeleteConfirm,
  children
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        aria-label="opcje"
        onClick={handleMenuOpen}
        disableScrollLock
        sx={{
          background: 'none',
          boxShadow: 'none',
          fontSize: 28,
          p: 1,
          '&:hover': { background: "action.hover" }
        }}
        size="large"
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        disableScrollLock
      >
        {isOwner && (
          <MenuItem
            onClick={() => {
              setDeleteDialogOpen(true);
              handleMenuClose();
            }}
            disabled={loading}
            sx={{ color: "error.main" }}
          >
            {children}
          </MenuItem>
        )}
      </Menu>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        disableScrollLock
      >
        <DialogTitle id="delete-dialog-title">{deleteTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{deleteText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
            Anuluj
          </Button>
          <Button
            onClick={onDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Usuwanie..." : "Usuń"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OptionsMenu;
