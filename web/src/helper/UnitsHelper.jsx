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

export const getTranslationField = (field, lang, format = "snake_case") => {
  const suffix = lang === "en" ? "en" : "zh";

  if (format === "camelCase") {
    // Convert to camelCase: name -> nameZh, nameTc
    return `${field}${suffix.charAt(0).toUpperCase()}${suffix.slice(1)}`;
  }

  // Default snake_case: name -> name_zh, name_en
  return `${field}_${suffix}`;
};

export const getPlaceHolderImage = () => {
  return "/assets/images/product_placeholder.jpg";
};

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};
