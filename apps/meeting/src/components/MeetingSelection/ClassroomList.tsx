import React from "react";
import { withAuth } from "react-oidc-context";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./ClassroomList.css";
import { useAppState } from "../../providers/AppStateProvider";

declare var process: any;

interface Classroom {
    _id: string;
    name: string;
    roomName: string;
    scheduledDates: string[];
    updatedAt: string;
}

interface ApiResult {
    results: Classroom[];
    total: number;
    skip: number;
    limit: number;
}

const fetchClassrooms = async (token: string): Promise<ApiResult> => {
    const { data } = await axios.get<ApiResult>(process.env.REACT_APP_URL + "/classroom?limit=10&page=0", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

const ClassroomList: React.FC = () => {
    const { auth, profile } = useAuthContext();
    const { setMeetingId, setLocalUserName } = useAppState();
    const token = auth.user?.access_token ?? '';

    const { data, error, isLoading } = useQuery({
        queryKey: ["classrooms"],
        queryFn: () => fetchClassrooms(token),
        enabled: !!token,
    });

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error.</div>;
    }

    return (
        <div className="classroom-container">
            {data?.results.length === 0 ? (
                <div className="no-classrooms">No classes available.</div>
            ) : (
                <ul className="classroom-list">
                    {data?.results.map((classroom) => (
                        <li key={classroom._id} className="classroom-item" onClick={() => {
                            console.log(profile);
                            setLocalUserName(profile.firstName);
                            setMeetingId(classroom.roomName);
                        }}>
                            <div className="classroom-info">
                                <strong>{classroom.name}</strong>
                                <span>{classroom.roomName}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default withAuth(ClassroomList);
