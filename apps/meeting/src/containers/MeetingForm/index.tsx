// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Checkbox,
  DeviceLabels,
  Flex,
  FormField,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Select,
  useMeetingManager,
} from 'amazon-chime-sdk-component-library-react';
import { DefaultBrowserBehavior, MeetingSessionConfiguration } from 'amazon-chime-sdk-js';

import { getErrorContext } from '../../providers/ErrorProvider';
import routes from '../../constants/routes';
import Card from '../../components/Card';
import Spinner from '../../components/icons/Spinner';
import DevicePermissionPrompt from '../DevicePermissionPrompt';
import RegionSelection from './RegionSelection';
import { createGetAttendeeCallback, createMeetingAndAttendee } from '../../utils/api';
import { useAppState } from '../../providers/AppStateProvider';
import { MeetingMode, VideoFiltersCpuUtilization } from '../../types';
import { MeetingManagerJoinOptions } from 'amazon-chime-sdk-component-library-react/lib/providers/MeetingProvider/types';
import meetingConfig from '../../meetingConfig';

const collapseStyles: React.CSSProperties = {
  border: '1px solid var(--mdc-theme-surface-3, rgba(0, 0, 0, 0.12))',
  borderRadius: '16px', // Aumentado para bordas mais arredondadas (Material 3)
  marginTop: '1rem',
  overflow: 'hidden',
  fontFamily: 'var(--mdc-typography-font-family, Syne, sans-serif)', // Usando Syne do tema
  backgroundColor: 'var(--mdc-theme-surface, #fff)', // Compatível com tema dark
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '24px',
  cursor: 'pointer',
  backgroundColor: 'var(--mdc-theme-surface, #fff)', // Compatível com tema dark
  color: 'var(--mdc-theme-on-surface, #000)', // Ajustado para on-surface
  fontSize: 'var(--mdc-typography-subtitle1-font-size, 1rem)',
  fontWeight: 500,
  transition: 'background-color 0.2s ease',
  borderRadius: '16px 16px 0 0', // Arredondamento apenas no topo quando aberto
};

const contentStyles: React.CSSProperties = {
  padding: '0 1rem', // Padding inicial zero para animação suave
  backgroundColor: 'var(--mdc-theme-background, #fafafa)', // Compatível com tema dark
  maxHeight: '0',
  overflow: 'hidden',
  transition: 'max-height 0.3s ease, padding 0.3s ease',
};

const contentOpenStyles: React.CSSProperties = {
  maxHeight: '600px', // Ajustado para acomodar mais campos
  padding: '1rem', // Padding restaurado quando aberto
};

const iconStyles: React.CSSProperties = {
  transition: 'transform 0.3s ease',
  fontSize: '24px', // Tamanho padrão para ícones Material
  color: 'var(--mdc-theme-on-surface, #000)', // Cor compatível com tema
};

const iconOpenStyles: React.CSSProperties = {
  transform: 'rotate(180deg)', // Rotação do ícone quando aberto
};

// Estilo para ocultar campos
const hiddenFieldStyles: React.CSSProperties = {
  display: 'none',
};

// Opções de filtro de vídeo (mantidas como no original)
const VIDEO_TRANSFORM_FILTER_OPTIONS = [
  { value: VideoFiltersCpuUtilization.Disabled, label: 'Disable Video Filter' },
  { value: VideoFiltersCpuUtilization.CPU10Percent, label: 'Video Filter CPU 10%' },
  { value: VideoFiltersCpuUtilization.CPU20Percent, label: 'Video Filter CPU 20%' },
  { value: VideoFiltersCpuUtilization.CPU40Percent, label: 'Video Filter CPU 40%' },
];

interface CollapseProps {
  title: string;
  children: React.ReactNode;
}

const Collapse: React.FC<CollapseProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => setIsOpen(!isOpen);

  return (
    <div style={collapseStyles}>
      <div style={headerStyles} onClick={toggleCollapse}>
        <span>{title}</span>
        <span
          style={{ ...iconStyles, ...(isOpen ? iconOpenStyles : {}) }}
          className="material-symbols-outlined" // Classe do Material Icons
        >
          expand_more
        </span>
      </div>
      <div style={{ ...contentStyles, ...(isOpen ? contentOpenStyles : {}) }}>
        {children}
      </div>
    </div>
  );
};

const MeetingForm: React.FC = () => {
  const meetingManager = useMeetingManager();
  const {
    region,
    meetingId,
    localUserName,
    meetingMode,
    enableSimulcast,
    priorityBasedPolicy,
    keepLastFrameWhenPaused,
    isWebAudioEnabled,
    videoTransformCpuUtilization,
    setJoinInfo,
    isEchoReductionEnabled,
    toggleEchoReduction,
    toggleWebAudio,
    toggleSimulcast,
    togglePriorityBasedPolicy,
    toggleKeepLastFrameWhenPaused,
    setMeetingMode,
    setMeetingId,
    setLocalUserName,
    setRegion,
    setCpuUtilization,
    skipDeviceSelection,
    toggleMeetingJoinDeviceSelection,
  } = useAppState();
  const [, setMeetingErr] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { errorMessage, updateErrorMessage } = useContext(getErrorContext());
  const navigate = useNavigate();
  const browserBehavior = new DefaultBrowserBehavior();
  useEffect(() => {
    if(meetingId.length > 0) {
      handleJoinMeeting();
    }
  }, [meetingId]);

  const handleJoinMeeting = async () => {
    const id = meetingId.trim().toLocaleLowerCase();
    const attendeeName = localUserName.trim();

    if (!id || !attendeeName) {
      if (!attendeeName) setNameErr(true);
      if (!id) setMeetingErr(true);
      return;
    }

    setIsLoading(true);
    meetingManager.getAttendee = createGetAttendeeCallback(id);

    try {
      const { JoinInfo } = await createMeetingAndAttendee(id, attendeeName, region, isEchoReductionEnabled);
      setJoinInfo(JoinInfo);
      const meetingSessionConfiguration = new MeetingSessionConfiguration(JoinInfo?.Meeting, JoinInfo?.Attendee);
      if (
        meetingConfig.postLogger &&
        meetingSessionConfiguration.meetingId &&
        meetingSessionConfiguration.credentials &&
        meetingSessionConfiguration.credentials.attendeeId
      ) {
        const existingMetadata = meetingConfig.postLogger.metadata;
        meetingConfig.postLogger.metadata = {
          ...existingMetadata,
          meetingId: meetingSessionConfiguration.meetingId,
          attendeeId: meetingSessionConfiguration.credentials.attendeeId,
        };
      }

      setRegion(JoinInfo.Meeting.MediaRegion);
      meetingSessionConfiguration.enableSimulcastForUnifiedPlanChromiumBasedBrowsers = enableSimulcast;
      if (priorityBasedPolicy) {
        meetingSessionConfiguration.videoDownlinkBandwidthPolicy = priorityBasedPolicy;
      }
      meetingSessionConfiguration.keepLastFrameWhenPaused = keepLastFrameWhenPaused;
      const options: MeetingManagerJoinOptions = {
        deviceLabels: meetingMode === MeetingMode.Spectator ? DeviceLabels.None : DeviceLabels.AudioAndVideo,
        enableWebAudio: isWebAudioEnabled,
        skipDeviceSelection,
      };

      await meetingManager.join(meetingSessionConfiguration, options);
      if (meetingMode === MeetingMode.Spectator) {
        await meetingManager.start();
        navigate(`${routes.MEETING}/${meetingId}`);
      } else {
        setMeetingMode(MeetingMode.Attendee);
        navigate(routes.DEVICE);
      }
    } catch (error) {
      updateErrorMessage((error as Error).message);
    }
  };

  const closeError = (): void => {
    updateErrorMessage('');
    setMeetingId('');
    setLocalUserName('');
    setIsLoading(false);
  };

  return (
    <form>
      <Collapse title="Advanced settings">
        
        <p style={{lineHeight: '150%', paddingBottom: '12px'}}>
          Select advanced settings below. If you have any questions or need specific advanced configurations, contact the Slingui team.
        </p>
        <div style={hiddenFieldStyles}>
          <FormField
            field={Input}
            label="Name"
            value={localUserName}
            fieldProps={{ name: 'name', placeholder: 'Enter Your Name' }}
            errorText="Please enter a valid name"
            error={nameErr}
            onChange={(e: ChangeEvent<HTMLInputElement>): void => {
              setLocalUserName(e.target.value);
              if (nameErr) setNameErr(false);
            }}
          />
        </div>
        <RegionSelection setRegion={setRegion} region={region} />
        <FormField
          field={Checkbox}
          label="Join w/o Audio and Video (spectator mode)"
          value=""
          checked={meetingMode === MeetingMode.Spectator}
          onChange={(): void => {
            setMeetingMode(meetingMode === MeetingMode.Spectator ? MeetingMode.Attendee : MeetingMode.Spectator);
          }}
        />
        <FormField
          field={Checkbox}
          label="Enable Web Audio"
          value=""
          checked={isWebAudioEnabled}
          onChange={toggleWebAudio}
          infoText="Enable Web Audio to use Voice Focus"
        />
        {isWebAudioEnabled && (
          <FormField
            field={Checkbox}
            label="Enable Echo Reduction"
            value=""
            checked={isEchoReductionEnabled}
            onChange={toggleEchoReduction}
            infoText="Enable Echo Reduction (new meetings only)"
          />
        )}
        <FormField
          field={Select}
          options={VIDEO_TRANSFORM_FILTER_OPTIONS}
          onChange={(e: ChangeEvent<HTMLSelectElement>): void => {
            setCpuUtilization(e.target.value);
          }}
          value={videoTransformCpuUtilization}
          label="Background Filters CPU Utilization"
        />
        {browserBehavior.isSimulcastSupported() && (
          <FormField
            field={Checkbox}
            label="Enable Simulcast"
            value=""
            checked={enableSimulcast}
            onChange={toggleSimulcast}
          />
        )}
        {browserBehavior.supportDownlinkBandwidthEstimation() && (
          <FormField
            field={Checkbox}
            label="Use Priority-Based Downlink Policy"
            value=""
            checked={priorityBasedPolicy !== undefined}
            onChange={togglePriorityBasedPolicy}
          />
        )}
        <FormField
          field={Checkbox}
          label="Keep Last Frame When Paused"
          value=""
          checked={keepLastFrameWhenPaused}
          onChange={toggleKeepLastFrameWhenPaused}
        />
        <FormField
          field={Checkbox}
          label="Skip meeting join device selection"
          value=""
          checked={skipDeviceSelection}
          onChange={toggleMeetingJoinDeviceSelection}
        />
      </Collapse>
      <Flex container layout="fill-space-centered" style={{ marginTop: '2.5rem' }}>
        {isLoading ? <Spinner /> : <></>}
      </Flex>
      {errorMessage && (
        <Modal size="md" onClose={closeError}>
          <ModalHeader title={`Meeting ID: ${meetingId}`} />
          <ModalBody>
            <Card
              title="Unable to join meeting"
              description="There was an issue finding that meeting. The meeting may have already ended, or your authorization may have expired."
              smallText={errorMessage}
            />
          </ModalBody>
        </Modal>
      )}
      <DevicePermissionPrompt />
    </form>
  );
};

export default MeetingForm;