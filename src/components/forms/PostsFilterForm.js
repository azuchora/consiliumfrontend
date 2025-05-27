import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useMediaQuery,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";

const PostFilterForm = ({ handleSearchSubmit, handleInputChange, filters }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="form"
      onSubmit={handleSearchSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mb: 3,
        p: 2,
        borderRadius: 3,
        background: "#fff",
        boxShadow: "0 2px 12px 0 rgba(60, 72, 88, 0.10)",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={2}
        sx={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextField
          name="search"
          label="Szukaj słów kluczowych"
          value={filters.search}
          onChange={handleInputChange}
          size="small"
          sx={{
            minWidth: isMobile ? "100%" : 180,
            flex: 1,
            maxWidth: isMobile ? "100%" : 220,
          }}
          autoComplete="off"
        />

        <TextField
          name="username"
          label="Nazwa użytkownika"
          value={filters.username}
          onChange={handleInputChange}
          size="small"
          inputProps={{ min: 1, max: 125 }}
          sx={{
            minWidth: isMobile ? "100%" : 120,
            flex: 1,
            maxWidth: isMobile ? "100%" : 140,
          }}
        />

        <FormControl size="small" sx={{
          minWidth: isMobile ? "100%" : 140,
          flex: 1,
          maxWidth: isMobile ? "100%" : 180,
        }}>
          <InputLabel id="post-status-label">Status</InputLabel>
          <Select
            labelId="post-status-label"
            name="postStatusId"
            value={filters.postStatusId}
            label="Status"
            onChange={handleInputChange}
            MenuProps={{ disableScrollLock: true }}
          >
            <MenuItem value="">Wszystkie statusy</MenuItem>
            <MenuItem value="1">Pilne</MenuItem>
            <MenuItem value="2">OK</MenuItem>
            <MenuItem value="3">Inne</MenuItem>
          </Select>
        </FormControl>

        <TextField
          name="age"
          label="Wiek pacjenta"
          type="number"
          value={filters.age}
          onChange={handleInputChange}
          size="small"
          inputProps={{ min: 1, max: 125 }}
          sx={{
            minWidth: isMobile ? "100%" : 120,
            flex: 1,
            maxWidth: isMobile ? "100%" : 140,
          }}
        />

        <FormControl size="small" sx={{
          minWidth: isMobile ? "100%" : 120,
          flex: 1,
          maxWidth: isMobile ? "100%" : 140,
        }}>
          <InputLabel id="gender-label">Płeć</InputLabel>
          <Select
            labelId="gender-label"
            name="gender"
            value={filters.gender}
            label="Płeć"
            onChange={handleInputChange}
            MenuProps={{ disableScrollLock: true }}
          >
            <MenuItem value="">Wszystkie</MenuItem>
            <MenuItem value="male">Mężczyzna</MenuItem>
            <MenuItem value="female">Kobieta</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Box sx={{ width: isMobile ? "100%" : 180 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          sx={{
            width: "100%",
            height: 40,
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(60,72,88,0.07)",
          }}
        >
          Szukaj
        </Button>
      </Box>
    </Box>
  );
};

export default PostFilterForm;