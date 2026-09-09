"use client";
import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Navigation";
import {
  obtainLocation,
  obtainLocationAndDistance,
  handleGeolocationError,
} from "@/helper/GeolocationHelper";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import MapDialog from "./MapDialog";

export default function NavigationButton({
  destLat,
  destLng,
  locations, // Support passing location array, will automatically navigate to nearest location
  buttonText = "Navigate",
  variant = "contained",
  color = "primary",
  ...buttonProps
}) {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [destination, setDestination] = useState(null);
  const [sortedLocations, setSortedLocations] = useState(null);
  const t = useTranslations();
  const router = useRouter();

  const handleNavigate = async () => {
    setLoading(true);
    let userPosition = null;

    try {
      const { position } = await obtainLocation({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
      userPosition = position;
      setCurrentPosition(position);
    } catch (error) {
      // If GPS permission is denied or location unavailable, continue without current position
      console.log("Unable to get current position, showing destination only");
      setCurrentPosition(null);
    }

    try {
      // If locations array is provided, find the nearest location (if we have user position)
      if (locations && Array.isArray(locations) && locations.length > 0) {
        if (userPosition) {
          const result = obtainLocationAndDistance(userPosition, locations);
          if (result && result.location) {
            setDestination({
              lat: result.location.lat,
              lng: result.location.lng,
            });

            // Sort locations with nearest first
            const nearestLocation = result.location;
            const reorderedLocations = [
              nearestLocation,
              ...locations.filter(loc => loc !== nearestLocation),
            ];
            setSortedLocations(reorderedLocations);
          } else {
            // If no nearest location found, use the first one
            setDestination({
              lat: locations[0].lat,
              lng: locations[0].lng,
            });
            setSortedLocations(locations);
          }
        } else {
          // No user position, just use the first location
          setDestination({
            lat: locations[0].lat,
            lng: locations[0].lng,
          });
          setSortedLocations(locations);
        }
      } else {
        // Use the directly provided destination
        setDestination({
          lat: destLat,
          lng: destLng,
        });
        setSortedLocations(null);
      }

      setDialogOpen(true);
    } catch (error) {
      await handleGeolocationError(error, t, router);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  // Check if there is a valid destination
  const hasValidDestination =
    (destLat && destLng) || (locations && Array.isArray(locations) && locations.length > 0);

  return (
    <>
      <Button
        variant={variant}
        color={color}
        onClick={handleNavigate}
        disabled={loading || !hasValidDestination}
        startIcon={loading ? <CircularProgress size={20} /> : <NavigationIcon />}
        {...buttonProps}
      >
        {buttonText}
      </Button>

      {destination && (
        <MapDialog
          open={dialogOpen}
          onClose={handleClose}
          currentLat={currentPosition?.lat}
          currentLng={currentPosition?.lng}
          destLat={destination.lat}
          destLng={destination.lng}
          locations={locations}
        />
      )}
    </>
  );
}
