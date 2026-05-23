import { useState, useEffect, useCallback } from "react";
import axios from "axios";

/**
 * Custom hook to get the user's geolocation and reverse-geocode it.
 * Extracted from App.jsx to keep it clean and reusable.
 */
export const useGeolocation = () => {
  const [location, setLocation] = useState(null);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const address = response.data.address;
          if (response.data.display_name) {
            address.display_name = response.data.display_name;
          }
          setLocation(address);
        } catch {
          // Silently fail — user can manually enter address
        }
      },
      () => {
        // Permission denied — user can manually enter address
        // Using toast is handled in the component layer if needed
      }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return { location, setLocation, getLocation };
};
