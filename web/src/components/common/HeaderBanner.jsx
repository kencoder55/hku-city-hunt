import { Box, Typography } from "@mui/material";

export default function HeaderBanner({
  title,
  leftIcon,
  rightIcon,
  backgroundColor = "white",
  fullWidth = false,
  leftIconProps = {},
  rightIconProps = {},
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 1.5,
          borderBottomRightRadius: 16,
          borderBottomLeftRadius: 16,
          backgroundColor: backgroundColor,
          position: "relative",
          px: fullWidth ? 2 : 8,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          width: fullWidth ? "100%" : "auto",
        }}
      >
        {leftIcon && (
          <Box
            component={"img"}
            src={leftIcon}
            sx={{
              position: "absolute",
              height: 60,
              bottom: -10,
              left: fullWidth ? 16 : 2,
              ...leftIconProps,
            }}
          />
        )}

        <Typography variant="h5" color="white">
          {title}
        </Typography>

        {rightIcon && (
          <Box
            component={"img"}
            src={rightIcon}
            sx={{
              position: "absolute",
              height: 50,
              bottom: -10,
              right: fullWidth ? 16 : 2,
              ...rightIconProps,
            }}
          />
        )}
      </Box>
    </Box>
  );
}
