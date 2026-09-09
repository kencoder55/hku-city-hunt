import { Box } from "@mui/material";

export default function RegularStamp({ index, stampColors }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <Box
        component="img"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 99,
          zIndex: 2,
        }}
        src={`/assets/icons/avatar/${Math.floor(Math.random() * 12) + 1}.png`}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: stampColors[index],
          mask: "url(/assets/icons/plain-sticker.svg) center/contain no-repeat",
          WebkitMask: "url(/assets/icons/plain-sticker.svg) center/contain no-repeat",
          zIndex: 1,
        }}
      />
    </Box>
  );
}
