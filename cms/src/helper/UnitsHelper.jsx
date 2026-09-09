import Resizer from "react-image-file-resizer";

export const resizeFile = ({
  file,
  maxWidth = 1080,
  maxHeight = 1080,
  extension = "webp", // "WEBP" | "JPEG" | "PNG"
  outputType = "file", // "file" | "base64" | "blob"
}) =>
  new Promise(resolve => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      extension,
      100,
      0,
      uri => {
        resolve(uri);
      },
      outputType,
    );
  });

export const getTranslationField = (field, lang) => {
  switch (lang) {
    case "zh-HK":
      return `${field}Zh`;
    case "en":
      return `${field}En`;
    default:
      return `${field}Zh`;
  }
};

export const getPlaceHolderImage = () => {
  return "/assets/images/product_placeholder.jpg";
};
