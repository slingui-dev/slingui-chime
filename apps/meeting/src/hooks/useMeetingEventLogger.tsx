import { useEffect, useRef } from 'react';
import { useMeetingManager } from 'amazon-chime-sdk-component-library-react';

const API_ENDPOINT_URL = 'https://ck31zay0r8.execute-api.us-east-1.amazonaws.com/prod/meetingevents';

const useMeetingEventLogger = () => {
  const meetingManager = useMeetingManager();
  const meetingEventsRef = useRef<any[]>([]);
  const timeoutRef = useRef<any | null>(null);

  useEffect(() => {
    const observer = {
      eventDidReceive: (name: string, attributes: any) => {
        const { meetingHistory, ...otherAttributes } = attributes;
        const event: any = {
          name,
          attributes: {
            ...otherAttributes,
            meetingHistory: meetingHistory?.filter(({ timestampMs }: any) =>
              Date.now() - timestampMs < 5 * 60 * 1000
            ),
          },
        };
        meetingEventsRef.current.push(event);
      },
    };

    meetingManager.meetingSession?.eventController?.addObserver(observer);

    const sendEvents = () => {
      if (meetingEventsRef.current.length > 0) {
        fetch(API_ENDPOINT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(meetingEventsRef.current),
        });
        meetingEventsRef.current = [];
      }
      timeoutRef.current = setTimeout(sendEvents, 10000);
    };

    sendEvents();

    return () => {
      meetingManager.meetingSession?.eventController?.removeObserver(observer);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (meetingEventsRef.current.length > 0) {
        fetch(API_ENDPOINT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(meetingEventsRef.current),
        });
      }
    };
  }, [meetingManager]);

  return null;
};

export default useMeetingEventLogger;
