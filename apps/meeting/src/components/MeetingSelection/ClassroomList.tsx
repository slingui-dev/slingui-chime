import React from "react";
import { withAuth } from "react-oidc-context";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./ClassroomList.css";
import { useAppState } from "../../providers/AppStateProvider";
import { Card } from "@rmwc/card";
import {
    List,
    ListItem,
    ListItemGraphic,
    ListItemText,
    ListItemPrimaryText,
    ListItemSecondaryText,
    ListItemMeta,
} from "@rmwc/list";
import { IconButton } from "@rmwc/icon-button";
import { Typography } from "@rmwc/typography";
import { format } from "date-fns";
import { Avatar, AvatarCount, AvatarGroup } from "@rmwc/avatar";
import '@rmwc/avatar/styles';

declare var process: any;

export interface Classroom {
    _id: string;
    name: string;
    roomName: string;
    scheduledDates: string[];
    updatedAt: string;
    closestDate?: number;
    participants: string[]; // Array of participant IDs
}

export interface ClassroomApiResult {
    results: Classroom[];
    total: number;
    skip: number;
    limit: number;
}

export function isClassroomAvailable(closestDate: number | string | undefined) {
    if (!closestDate) return false;
    const now = new Date();
    const scheduledDate = new Date(closestDate);
    const diffHours = Math.abs(scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours <= 8;
}

export function datePipe(date: number | string | undefined) {
    if (!date) return "";
    return format(new Date(date), "MMM dd, yyyy 'at' H:mm a");
}

// Function to generate avatar URL from participant ID
const generateAvatarUrl = (participantId: string): string => {
    return `https://public.slingui.com/avatars/${participantId}.png?d=124x124&cacheKey=10`;
};

const fetchClassrooms = async (token: string): Promise<ClassroomApiResult> => {
    const { data } = await axios.get<ClassroomApiResult>(
        process.env.REACT_APP_URL + "/classroom?limit=10&page=0",
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return data;
};

const ClassroomList: React.FC = () => {
    const { auth, profile } = useAuthContext();
    const { setMeetingId, setLocalUserName } = useAppState();
    const token = auth.user?.access_token ?? "";

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ["classrooms"],
        queryFn: () => fetchClassrooms(token),
        enabled: !!token,
    });

    const handleClassroomClick = (classroom: Classroom) => {
        if (isClassroomAvailable(classroom.closestDate)) {
            setLocalUserName(profile.firstName);
            setMeetingId(classroom.roomName);
        } else {
            console.log("Classroom is not available yet.");
        }
    };

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error.</div>;
    }

    return (
        <div className="classroom-container">
            <Card>
                <div className="card-header">
                    <Typography use="headline6" tag="h2">
                        Next classes:
                    </Typography>
                    <IconButton className="material-symbols-outlined" icon="refresh" onClick={() => refetch()} />
                </div>
                {data?.results.length === 0 ? (
                    <div className="no-classrooms">No classes available.</div>
                ) : (
                    <List twoLine>
                        {data?.results.map((classroom) => (
                            <ListItem
                                key={classroom._id}
                                onClick={() => handleClassroomClick(classroom)}
                                disabled={!isClassroomAvailable(classroom.closestDate)}
                            >
                                <ListItemGraphic icon="arrow_forward" className="material-symbols-outlined" />
                                <ListItemText>
                                    <ListItemPrimaryText>{classroom.name}</ListItemPrimaryText>
                                    <ListItemSecondaryText>
                                        {datePipe(classroom.closestDate)}
                                    </ListItemSecondaryText>
                                </ListItemText>
                                <ListItemMeta>
                                    <AvatarGroup dense>
                                        {classroom.participants.slice(0, 2).map((participantId, index) => (
                                            <Avatar
                                                key={index}
                                                src={generateAvatarUrl(participantId)}
                                                name={participantId} // Use ID as placeholder; replace with actual name if available
                                                size="xsmall"
                                                interactive
                                            />
                                        ))}
                                        {classroom.participants.length > 2 && (
                                            <AvatarCount
                                                size="xsmall"
                                                overflow
                                                value={classroom.participants.length - 2}
                                                interactive
                                            />
                                        )}
                                    </AvatarGroup>
                                </ListItemMeta>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Card>
        </div>
    );
};

export default withAuth(ClassroomList);