// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { FC, PropsWithChildren } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import {
  NotificationProvider,
  GlobalStyles,
  LoggerProvider,
} from 'amazon-chime-sdk-component-library-react';

import { demoLightTheme, demoDarkTheme } from './theme/demoTheme';
import { AppStateProvider, useAppState } from './providers/AppStateProvider';
import ErrorProvider from './providers/ErrorProvider';
import Notifications from './containers/Notifications';
import MeetingProviderWrapper from './containers/MeetingProviderWrapper';
import meetingConfig from './meetingConfig';
import { useAuthContext } from './hooks/useAuthContext';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient()

const App: FC = () => {
  const { isAuthenticated, isLoading, error, auth } = useAuthContext();

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div>Signing you in...</div>;
    case "signoutRedirect":
      return <div>Signing you out...</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!isAuthenticated) {
    return <div>Authenticating...</div>;
  }
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <LoggerProvider logger={meetingConfig.logger}>
          <AppStateProvider>
            <Theme>
              <NotificationProvider>
                <Notifications />
                <ErrorProvider>
                  <MeetingProviderWrapper />
                </ErrorProvider>
              </NotificationProvider>
            </Theme>
          </AppStateProvider>
        </LoggerProvider>
      </QueryClientProvider>
    </Router>
  );
};
const Theme: React.FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useAppState();

  return (
    <ThemeProvider theme={theme === 'light' ? demoLightTheme : demoDarkTheme}>
      <GlobalStyles />
      <div className={theme}>
        {children}
      </div>
    </ThemeProvider>
  );
};

export default App;
