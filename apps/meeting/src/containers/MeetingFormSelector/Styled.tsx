// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import styled from 'styled-components';

export const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  @media (min-width: 600px) and (min-height: 600px) {
    min-height: 35.75rem;
    max-width: 30rem;
    border-radius: 16px;
  }
`;

export const StyledDiv = styled.div`
  padding: 2rem;
  flex: 1;

  @media (min-width: 600px) and (min-height: 600px) {
    padding: 3rem 3rem 2rem;
  }
`;
