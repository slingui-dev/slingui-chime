// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { createRoot } from 'react-dom/client';
import React from 'react';
import { Icon } from '@rmwc/icon';

import './style.css';
import './theme.scss';
import App from './app';
import { AuthProvider } from 'react-oidc-context';
import { authConfig } from './config/auth-config';


// Configura ícones outlined como padrão
(Icon as any).defaultProps = {
  ...(Icon as any).defaultProps,
  strategy: 'className',
  basename: 'material-icons-outlined',
};

window.addEventListener('load', () => {
  const container = document.getElementById('root') as HTMLElement;
  const root = createRoot(container);
  root.render(
    <AuthProvider {...authConfig}>
      <div className="meeting-room">
        <App />
      </div>
    </AuthProvider>,
  );
});