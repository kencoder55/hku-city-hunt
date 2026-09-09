import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import ImageUploading from "react-images-uploading";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function ImageUploader({
  images,
  onImageChange,
  maxNumber = 999,
  maxFileSize,
  editTitle = false,
  removeAllButton = true,
  data,
  setData = false,
  acceptType = ["jpg", "jpeg", "png", "webp", "svg"],
}) {
  const t = useTranslations();

  const onChange = (imageList, addUpdateIndex) => {
    onImageChange(imageList, parseInt(addUpdateIndex));
  };

  const onDragEnd = result => {
    const items = reorder(images, result.source.index, result.destination.index);

    onImageChange(items);
  };

  return (
    <Box component={"div"} className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        maxFileSize={maxFileSize}
        acceptType={acceptType}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          errors,
          dragProps,
        }) => (
          // write your building UI
          <Box components={"div"} className="upload__image-wrapper">
            {images?.length < maxNumber && (
              <Button
                fullWidth
                variant="outlined"
                color={isDragging ? "warning" : "primary"}
                sx={{ p: 10, mt: 2 }}
                onClick={onImageUpload}
                {...dragProps}
              >
                {t("layout.click_or_drag_image")}
              </Button>
            )}
            {errors && (
              <Box>
                {errors.maxNumber && (
                  <Typography color={"error"}>
                    Number of selected images exceed maxNumber
                  </Typography>
                )}
                {errors.acceptType && (
                  <Typography color={"error"}>Your selected file type is not allow</Typography>
                )}
                {errors.maxFileSize && (
                  <Typography color={"error"}>
                    Image size must be less than {maxFileSize / 1024 / 1024}MB
                  </Typography>
                )}
                {errors.resolution && <Typography color={"error"}>maxWidth </Typography>}
              </Box>
            )}
          </Box>
        )}
      </ImageUploading>
    </Box>
  );
}
