import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

declare var process: any;

export const useAuthContext = () => {
  const auth = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading && !auth.error) {
      auth.signinRedirect();
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.error]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (auth.isAuthenticated && auth.user?.access_token) {
        try {
          const response = await fetch(process.env.REACT_APP_URL + "/auth/me", {
            headers: {
              Authorization: `Bearer ${auth.user.access_token}`,
            },
          });
          if (!response.ok) throw new Error("Erro ao buscar perfil");
          const data = await response.json();
          setProfile(data);
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
        }
      }
    };

    fetchUserProfile();
  }, [auth.isAuthenticated, auth.user]);

  return {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    user: auth.user,
    profile,
    auth,
    login: auth.signinRedirect,
    logout: auth.signoutRedirect,
  };
};
