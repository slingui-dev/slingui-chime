import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

export const useAuthContext = () => {
    const auth = useAuth();
  
    useEffect(() => {
      if (!auth.isAuthenticated && !auth.isLoading && !auth.error) {
        auth.signinRedirect();
      }
    }, [auth.isAuthenticated, auth.isLoading, auth.error]);
  
    return {
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      error: auth.error,
      user: auth.user,
      auth,
      login: auth.signinRedirect,
      logout: auth.signoutRedirect,
    };
  };
  