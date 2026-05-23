import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

/**
 * ProtectedRoute — wraps routes that require authentication.
 * Redirects unauthenticated users to the home page with a redirect param.
 */
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    // Clerk is still initializing — show nothing briefly
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
        fontSize: "1rem",
        color: "#6b7280"
      }}>
        Checking authentication...
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
