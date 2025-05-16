// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@rmwc/button';
import { Typography } from '@rmwc/typography';
import '@rmwc/button/styles';
import '@rmwc/typography/styles';
import { useMeetingManager } from 'amazon-chime-sdk-component-library-react';

import routes from '../constants/routes';
import Card from '../components/Card';
import { useAppState } from '../providers/AppStateProvider';
import { Modal, ModalBody, ModalHeader } from 'amazon-chime-sdk-component-library-react';
import { Icon } from 'rmwc';

const MeetingJoinDetails = () => {
  const meetingManager = useMeetingManager();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { meetingId, localUserName } = useAppState();

  const handleJoinMeeting = async () => {
    setIsLoading(true);

    try {
      await meetingManager.start();
      setIsLoading(false);
      navigate(`${routes.MEETING}/${meetingId}`);
    } catch (error) {
      setIsLoading(false);
      setError((error as Error).message);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '1rem' }}>
        <Typography use="body1" tag="p" style={{ marginTop: "24px" }}>
          Joining classroom as <b>{localUserName}</b>
        </Typography>
        <div>

        <Button
          unelevated
          onClick={handleJoinMeeting}
          disabled={isLoading}
          icon={<Icon className="material-symbols-outlined" icon="arrow_forward" />}
        >
          {isLoading ? 'Loading...' : 'Join class'}
        </Button>
        </div>
      </div>
      {error && (
        <Modal size="md" onClose={() => setError('')}>
          <ModalHeader title={`Meeting ID: ${meetingId}`} />
          <ModalBody>
            <Card
              title="Unable to join meeting"
              description="There was an issue in joining this meeting. Check your connectivity and try again."
              smallText={error}
            />
          </ModalBody>
        </Modal>
      )}
    </>
  );
};

export default MeetingJoinDetails;