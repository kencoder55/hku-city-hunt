"use client";
import { getAuthCookieName } from "@/helper/GlobalValueHelper";
import { useRouter } from "@/i18n/navigation";
import palette from "@/styles/theme/palette";
import { Box, ButtonBase, Typography } from "@mui/material";
import { getCookie } from "cookies-next/client";
import { useEffect, useState } from "react";

export default function UserInfoView({ onClose }) {
  const router = useRouter();
  const [member, setMember] = useState(null);

  useEffect(() => {
    initialMember();
  }, []);

  const initialMember = () => {
    try {
      const userCookie = getCookie(getAuthCookieName());

      if (userCookie) {
        const cookieMember = JSON.parse(userCookie);
        console.log("cookieMember", cookieMember);

        setMember(cookieMember);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return (
    <ButtonBase
      onClick={() => {
        onClose();
        router.push("/members/profile");
      }}
      sx={{
        display: member ? "flex" : "none",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        px: 2,
        py: 1,
        gap: 2,
      }}
    >
      <Box
        sx={{
          p: 0.5,
          backgroundColor: palette.colors.c10,
          borderRadius: "50%",
          aspectRatio: "1 / 1",
          width: 56,
          height: 56,
        }}
      >
        <Box
          component={"img"}
          sx={{
            width: 48,
            height: 48,
          }}
          src={`/assets/icons/avatar/${member?.avatarId || 1}.png`}
        />
      </Box>

      <Box>
        <Typography variant="h6">{member?.name}</Typography>
      </Box>
    </ButtonBase>
  );
}
