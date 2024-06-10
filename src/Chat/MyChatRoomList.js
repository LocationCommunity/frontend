import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MyChatRoomList.css';
import { AuthContext } from '../Context/AuthContext';

function MyChatRoomList() {
    const { memberId } = useContext(AuthContext);
    const [chatRooms, setChatRooms] = useState([]);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [error, setError] = useState(null);

    

    useEffect(() => {
        async function fetchChatRooms() {
            try {
                const response = await axios.get(`/chat/room/list?memberId=${memberId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                setUnreadMessageCount(response.data.data.unread);
                setChatRooms(response.data.data);
                console.log(response.data.data);
            } catch (error) {
                console.error('Error fetching chat rooms:', error);
                setError('채팅방을 불러오는 동안 오류가 발생했습니다.');
            }
        }
        fetchChatRooms();
    }, [memberId]);

    return (
        <div className="chat-room-container">
            <h2 className="chat-room-header">채팅방 목록</h2>
            {error && <div className="error-message">{error}</div>}
            <ul className="chat-room-list">
                {chatRooms.map(room => (
                    <li key={room.id} className="chat-room-item">
                        <Link to={`/chat/room/${room.id}`} state={{ roomId: room.id }}>
                            {room.matchedMember2.nickname} : 님과의 채팅방 {room.unread}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MyChatRoomList;
