import { Box, useTheme } from "@mui/material";

/**
 * Bottom color bar component
 * @param {Object} props
 * @param {string} props.color - Background color of the bar
 * @param {number} [props.height=24] - Height of the bar in pixels
 * @param {number} [props.zIndex=999] - Z-index value
 * @param {string|boolean} [props.maxWidth] - Max width value (e.g., 'lg', 'md', 'sm', 'xl', 'xs', or false for full width)
 */
export default function BottomColorBar({ color, height = 24, zIndex = 999, maxWidth = false }) {
  const theme = useTheme();

  // Get the actual container width from theme breakpoints
  const getContainerWidth = () => {
    if (!maxWidth) return "100%";
    if (maxWidth === false) return "100%";

    // Get the breakpoint value from theme
    const breakpointValue = theme.breakpoints.values[maxWidth];
    return breakpointValue ? `${breakpointValue}px` : "100%";
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        width: getContainerWidth(),
        maxWidth: getContainerWidth(),
        height: height,
        backgroundColor: color,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        zIndex: zIndex,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    />
  );
}
