import ReactSwal from "@/helper/AlertHelper";
import { calculateDistance } from "@/helper/UnitsHelper";

// Promise wrapper for navigator.geolocation.getCurrentPosition
// DO NOT use this directly in most cases; prefer obtainLocation() which uses accuracy-gated watchPosition
export const getCurrentPosition = options => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ code: 0, message: "Geolocation not supported" });
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

// Accuracy-gated position: uses watchPosition to keep polling until
// coords.accuracy <= accuracyThreshold (meters) or totalTimeout (ms) is reached.
// Falls back to the best position seen so far on timeout.
// This fixes Chrome on Samsung/Android which may return stale network-based
// positions even with enableHighAccuracy:true.
//
// accuracyThreshold: accept position once accuracy is within this value (default 1000m)
// totalTimeout:      hard ceiling for the whole watch (default 10000ms); after this,
//                    resolve with the best position seen so far, or reject if none.
// options:           forwarded to watchPosition (maximumAge is always overridden to 0)
export const getAccuratePosition = (
  accuracyThreshold = 1000,
  totalTimeout = 10000,
  options = {},
) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ code: 0, message: "Geolocation not supported" });
      return;
    }

    let watchId = null;
    let timeoutId = null;
    let bestPosition = null;
    let settled = false;

    const cleanup = () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    watchId = navigator.geolocation.watchPosition(
      position => {
        if (settled) return;
        // Keep the most accurate position seen so far
        if (bestPosition === null || position.coords.accuracy < bestPosition.coords.accuracy) {
          bestPosition = position;
        }
        if (position.coords.accuracy <= accuracyThreshold) {
          settled = true;
          cleanup();
          resolve(position);
        }
      },
      err => {
        if (settled) return;
        // Only reject on fatal errors (permission denied, position unavailable).
        // For timeout (code 3) from watchPosition, ignore and let our own timer handle it.
        if (err && err.code !== 3) {
          settled = true;
          cleanup();
          reject(err);
        }
      },
      // maximumAge: 0 forces fresh GPS fix; per-update timeout matches the hard ceiling so
      // watchPosition has the full budget to deliver at least one update.
      {
        enableHighAccuracy: true,
        ...options,
        maximumAge: 0,
        timeout: Math.max(totalTimeout, 15000),
      },
    );

    // Hard timeout: resolve with best position seen, or reject if nothing at all
    timeoutId = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      if (bestPosition !== null) {
        console.warn(
          `getAccuratePosition: timed out, best accuracy=${bestPosition.coords.accuracy}m`,
        );
        resolve(bestPosition);
      } else {
        reject({ code: 3, message: "Timeout" });
      }
    }, totalTimeout);
  });
};

// Obtain the user's geolocation (position only). Returns { position: {lat,lng} }
// Uses accuracy-gated watchPosition internally (fixes Chrome on Samsung/Android
// returning stale network-based positions).
// Options:
//   accuracyThreshold (default 100m)   – accept position once accuracy is within this value
//   accuracyTimeout   (default 15000ms) – hard ceiling for the accuracy-wait phase;
//                                          after this resolves with best seen, or rejects.
//                                          15 s is needed on Android where GPS cold-start
//                                          can take 10+ seconds.
//   All other standard PositionOptions (e.g. timeout, enableHighAccuracy) are forwarded
//   to the underlying watchPosition call.
export async function obtainLocation(options = {}) {
  // permissions API check if available
  if (navigator.permissions) {
    try {
      const permissionStatus = await navigator.permissions.query({ name: "geolocation" });
      if (permissionStatus.state === "denied") {
        throw { code: 1, message: "Permission denied" };
      }
    } catch (err) {
      // ignore; some browsers may reject query or not support it
      console.debug("Permissions API check skipped or failed", err);
    }
  }

  // accuracyTimeout controls how long we wait for a good-accuracy fix (default 15 s).
  // 15 s is necessary on Android where GPS cold-start can take 10+ seconds.
  // The caller's `timeout` is forwarded as the watchPosition per-update timeout but does NOT
  // gate how long we keep trying for accuracy.
  const { accuracyThreshold = 1000, accuracyTimeout = 15000, ...posOptions } = options;
  const positionResult = await getAccuratePosition(accuracyThreshold, accuracyTimeout, posOptions);
  const userLat = positionResult.coords.latitude;
  const userLng = positionResult.coords.longitude;

  return { position: { lat: userLat, lng: userLng } };
}

// Compute minimum distance (meters) between a `position` and a `locations` list.
// `locations` can be an array or a JSON string.
// Returns an object `{ distance, location }` where `distance` is rounded meters
// and `location` is the location object from the list that is nearest.
// Returns `null` when no locations are provided.
export function obtainLocationAndDistance(position, locations) {
  if (!position || !locations) return null;

  let locs = locations;
  if (typeof locs === "string") {
    try {
      locs = JSON.parse(locs);
    } catch (e) {
      throw { code: 4, message: "Invalid location format", originalError: e };
    }
  }

  if (!Array.isArray(locs) || locs.length === 0) return null;

  let minDistance = Infinity;
  let nearestLoc = null;
  locs.forEach(loc => {
    const d = calculateDistance(position.lat, position.lng, loc.lat, loc.lng);
    if (d < minDistance) {
      minDistance = d;
      nearestLoc = loc;
    }
  });

  if (nearestLoc === null) return null;

  return { distance: Math.round(minDistance), location: nearestLoc };
}

// Unified geolocation error handler.
// err: error object from geolocation or custom thrown errors (should include `code`)
// t: translation function from `useTranslations()`
// router: optional next/router or next/navigation push function (if provided)
export async function handleGeolocationError(err, t, router) {
  console.error("Geolocation error (unified):", err);

  let errorMessage = t("error.gps.unknown_error");
  if (err && err.code === 1) errorMessage = t("error.gps.permission_denied");
  else if (err && err.code === 2) errorMessage = t("error.gps.position_unavailable");
  else if (err && err.code === 3) errorMessage = t("error.gps.timeout");
  else if (err && err.code === 4) errorMessage = t("error.gps.invalid_location_format");

  const result = await ReactSwal.fire({
    icon: "error",
    title: errorMessage,
    showCancelButton: true,
    confirmButtonText: t("error.gps.view_solution"),
    cancelButtonText: t("layout.ok"),
  });

  if (result.isConfirmed) {
    // prefer provided router, fallback to next/router
    try {
      if (router && typeof router.push === "function") {
        router.push("/gps-guide");
      } else {
        window.location.href = "/gps-guide";
      }
    } catch (e) {
      window.location.href = "/gps-guide";
    }
  }

  return result;
}
