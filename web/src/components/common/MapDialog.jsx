"use client";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import palette from "@/styles/theme/palette";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getTranslationField } from "@/helper/UnitsHelper";

export default function MapDialog({
  open,
  onClose,
  currentLat,
  currentLng,
  destLat,
  destLng,
  locations, // Array of location objects with lat, lng, and optional name
  backgroundColor = palette.secondary.main,
}) {
  const t = useTranslations("mission");
  const locale = useLocale();
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(null);

  // Reset selected location when dialog opens with new locations
  useEffect(() => {
    if (open) {
      setSelectedLocationIndex(null);
    }
  }, [open]);

  // Determine if we have multiple locations to show selector
  const hasMultipleLocations = locations && Array.isArray(locations) && locations.length > 1;

  // Resolve the current location object (for address display)
  const currentLocation = (() => {
    if (!locations || !Array.isArray(locations) || locations.length === 0) return null;
    if (locations.length === 1) return locations[0];
    if (selectedLocationIndex !== null) return locations[selectedLocationIndex];
    // "Nearest" mode — find the location whose lat/lng matches destLat/destLng
    const match = locations.find(loc => loc.lat === destLat && loc.lng === destLng);
    return match ?? locations[0];
  })();

  // Get current destination (use selected location if user manually selected one, otherwise use destLat/destLng)
  const currentDestLat =
    selectedLocationIndex !== null && hasMultipleLocations
      ? locations[selectedLocationIndex].lat
      : destLat;
  const currentDestLng =
    selectedLocationIndex !== null && hasMultipleLocations
      ? locations[selectedLocationIndex].lng
      : destLng;

  // If no current position, show destination only
  const hasCurrentPosition = currentLat && currentLng;

  const mapUrl = hasCurrentPosition
    ? `https://maps.google.com/maps?saddr=${currentLat},${currentLng}&daddr=${currentDestLat},${currentDestLng}&output=embed`
    : `https://maps.google.com/maps?q=${currentDestLat},${currentDestLng}&output=embed`;

  const googleMapsUrl = hasCurrentPosition
    ? `https://www.google.com/maps/dir/?api=1&origin=${currentLat},${currentLng}&destination=${currentDestLat},${currentDestLng}`
    : `https://www.google.com/maps/search/?api=1&query=${currentDestLat},${currentDestLng}`;

  const openInGoogleMaps = () => {
    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
  };

  const handleLocationChange = event => {
    const value = event.target.value;
    // If empty string (Nearest Location), set to null
    setSelectedLocationIndex(value === "" ? null : value);
  };

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
          zIndex: 1,
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
          border: `3px solid #E9E1D1`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {hasMultipleLocations && (
          <Box sx={{ p: 2, pb: 0, width: "100%" }}>
            <FormControl fullWidth>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
                {t("select_location")}
              </Typography>
              <Select
                value={selectedLocationIndex ?? ""}
                onChange={handleLocationChange}
                displayEmpty
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: palette.colors.c6,
                  },
                }}
              >
                <MenuItem value="">{t("nearest_location")}</MenuItem>
                {locations.map((location, index) => (
                  <MenuItem key={index} value={index}>
                    {location[getTranslationField("name", locale, "camelCase")]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <Box p={2} pb={0}>
          <Box
            component="iframe"
            key={`${currentDestLat}-${currentDestLng}`}
            src={mapUrl}
            sx={{
              width: "100%",
              height: "350px",
              border: "none",
              borderRadius: 2,
            }}
            title="Google Maps Navigation"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Box>

        <Box
          sx={{
            p: 1,
            pb: 0,
          }}
        >
          {currentLocation?.[getTranslationField("address", locale, "camelCase")] && (
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              {currentLocation[getTranslationField("address", locale, "camelCase")]}
            </Typography>
          )}
        </Box>

        <Box sx={{ p: 2, pt: 1, width: "100%" }}>
          <Button
            variant="contained"
            fullWidth
            onClick={openInGoogleMaps}
            endIcon={<OpenInNewIcon />}
          >
            {t("view_on_google_maps")}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
