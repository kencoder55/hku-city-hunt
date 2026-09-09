"use client";
import { Link } from "@/i18n/navigation";
import palette from "@/styles/theme/palette";
import { Box, Button, Dialog, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
export default function InfoDialog({
  open,
  onClose,
  image,
  title,
  message,
  confirmText = "OK",
  onConfirm,
  backgroundColor = palette.secondary.main,
  remark,
  linkText,
  link,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={"xs"}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            backgroundColor: backgroundColor,
          },
        },
      }}
    >
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: backgroundColor,
          p: 0,
        }}
        onClick={onClose}
      >
        <CloseIcon
          sx={{
            color: "white",
            fontSize: 32,
          }}
        />
      </IconButton>

      <Box
        sx={{
          backgroundColor: backgroundColor,
          color: "white",
          m: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          border: `3px solid #E9E1D1`,
          borderRadius: 2,
          p: 2,
        }}
      >
        {image && (
          <Box
            sx={{
              px: 4,
              pt: 2,
            }}
          >
            <Box
              component={"img"}
              src={image}
              alt={title}
              sx={{
                backgroundColor: "white",
                width: "100%",
                height: "auto",
                aspectRatio: 1 / 1,
                objectFit: "cover",
                borderRadius: 99,
                border: `4px solid ${palette.colors.c6}`,
              }}
            />
          </Box>
        )}

        <Box sx={{ pb: 2 }}>
          {title && (
            <Typography
              variant="h6"
              textAlign={"center"}
              gutterBottom
              sx={{
                textDecoration: "underline",
                textUnderlineOffset: 6,
                pb: 1,
                whiteSpace: "pre-line",
                lineHeight: 1.4,
              }}
            >
              {title}
            </Typography>
          )}
          {message && (
            <Typography variant="body1" textAlign={"left"} whiteSpace={"pre-line"}>
              {message}
            </Typography>
          )}
        </Box>

        {onConfirm && (
          <Button variant="contained" onClick={onConfirm}>
            {confirmText}
          </Button>
        )}

        {(remark || (linkText && link)) && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {remark && (
              <Typography variant="caption" textAlign={"center"} whiteSpace={"pre-line"}>
                {remark}
              </Typography>
            )}

            {linkText && link && (
              <Box
                component={Link}
                sx={{
                  textDecoration: "underline",
                }}
                target="_blank"
                href={link}
              >
                {linkText}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
