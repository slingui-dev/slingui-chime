declare var process: any;
export const authConfig = {
    authority: process.env.REACT_APP_OIDC_AUTHORITY,
    client_id: process.env.REACT_APP_OIDC_CLIENT_ID,
    redirect_uri: window.location.origin,
    post_logout_redirect_uri: window.location.origin,
    response_type: "code",
    scope: "openid profile",
    silentRenew: true,
    useRefreshToken: true,
    onSigninCallback: () => {
        window.history.replaceState({}, document.title, window.location.pathname);
    },
};
