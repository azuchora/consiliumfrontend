const isImage = (filename) => /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(filename);
const isPreviewable = (filename) => /\.(txt|pdf)$/i.test(filename);

const useFileTypeCheck = () => {
  return { isImage, isPreviewable };
};

export default useFileTypeCheck;
