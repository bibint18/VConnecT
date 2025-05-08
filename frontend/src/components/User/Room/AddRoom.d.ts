import React from 'react';
import './AddRoom.css';
export interface RoomFormData {
    title: string;
    limit: number;
    premium: string;
    type: string;
    description: string;
}
declare const AddRoom: React.FC;
export default AddRoom;
