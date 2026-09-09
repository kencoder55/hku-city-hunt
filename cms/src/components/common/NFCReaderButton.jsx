import { HexToDecimal } from "@/helper/UnitsHelper";
import NfcIcon from "@mui/icons-material/Nfc";
import { Box, Dialog, IconButton, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export default function NFCReaderButton({ onReceive }) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const cardDataRef = useRef("");
  const lastInputTimeRef = useRef(Date.now());

  const onClose = () => {
    setOpen(false);
  };

  const showNfcReader = () => {
    setOpen(true);
  };

  const handleKeyDown = event => {
    const inputData = event.key;

    // Check if the input key is "Shift" and ignore it
    if (inputData === "Shift") {
      return;
    }

    if (lastInputTimeRef.current) {
      const timeDiff = event.timeStamp - lastInputTimeRef.current;

      if (timeDiff < 100) {
        // if the time difference is less than 100ms, it is considered as NFC input

        if (inputData === "Enter") {
          // if the input is "Enter", it is considered as a complete input
          // do something with the input data

          // hex to decimal
          const decimal = HexToDecimal(cardDataRef.current);
          console.log("NFC Card Data: ", decimal);
          onReceive(decimal);
          onClose();
          cardDataRef.current = "";
          return;
        }

        cardDataRef.current += inputData;
      } else {
        // if the time difference is more than 100ms, it is considered as a new input
        cardDataRef.current = inputData;
      }
    }

    lastInputTimeRef.current = event.timeStamp;
  };

  useEffect(() => {
    if (!open) {
      // remove listener if the dialog is closed
      document.removeEventListener("keydown", handleKeyDown);
      return;
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <Box>
      <IconButton onClick={showNfcReader} disabled={open}>
        <NfcIcon />
      </IconButton>
      <Dialog open={open} onClose={onClose}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            p: 8,
          }}
        >
          <Box
            component={"img"}
            src={"/assets/images/card-touch.png"}
            alt={"NFC Reader"}
            sx={{
              height: 300,
              objectFit: "contain",
            }}
          />
          <Typography variant={"h6"}>{t("layout.touch_nfc_card")}</Typography>
        </Box>
      </Dialog>
    </Box>
  );
}
