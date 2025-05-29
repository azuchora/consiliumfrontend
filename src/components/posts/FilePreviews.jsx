import { Box } from "@mui/material";
import FilePreview from "./FilePreview";
import { BACKEND_URL } from "../../api/axios";

const FilePreviews = ({ imageFiles, otherFiles, setPreviewFile, theme }) => (
  <>
    {imageFiles.length > 0 && (
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
        {imageFiles.map((file) => (
          <Box
            key={file.id || file.filename}
            component="img"
            src={`${BACKEND_URL}/static/${file.filename}`}
            alt={file.filename}
            sx={{
              width: 100,
              height: "auto",
              cursor: "pointer",
              borderRadius: 1,
              boxShadow: 1,
              border: `2px solid ${theme.palette.primary.light}`,
              background: theme.palette.background.default,
            }}
            onClick={() =>
              setPreviewFile({
                type: "image",
                url: `${BACKEND_URL}/static/${file.filename}`,
              })
            }
          />
        ))}
      </Box>
    )}
    {otherFiles.length > 0 && (
      <Box sx={{ mb: 1 }}>
        {otherFiles.map((file) => (
          <FilePreview
            key={file.id || file.filename}
            file={file}
            onPreview={setPreviewFile}
          />
        ))}
      </Box>
    )}
  </>
);

export default FilePreviews;
