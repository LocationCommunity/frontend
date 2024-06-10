import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './ChatRoomDetail.css';
import { AuthContext } from '../Context/AuthContext';
import SendMessageForm from './SendMessageForm';

function ChatRoomDetail() {
  const [roomDetail, setRoomDetail] = useState(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [error, setError] = useState(null);
  const { memberId, nickname } = useContext(AuthContext);
  const location = useLocation();
  const roomIdFromLocation = location.state ? location.state.roomId : null;

  console.log(nickname);

  useEffect(() => {
    if (!roomIdFromLocation) {
      return;
    }

    const fetchRoomDetail = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`/chat/room/${roomIdFromLocation}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setUnreadMessageCount(response.data.data.unread);
        setRoomDetail(response.data.data);
      
      } catch (error) {
        setError('채팅방 정보를 불러오는데 실패했습니다.');
      }
    };

    fetchRoomDetail();
  }, [roomIdFromLocation]);

  const handleNewMessage = (message) => {
    setRoomDetail(prevRoomDetail => ({
      ...prevRoomDetail,
      messages: [...prevRoomDetail.messages, message]
    }));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!roomDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-room-detail">
      <div className="chat-room-detail__header">
        <h1>Chat Room Detail</h1>
      </div>
      <div className="chat-room-detail__info">
        <p>Room ID: {roomDetail.id}</p>
        <p>Matched Member 1: {roomDetail.matchedMember1.nickname}</p>
        <p>Matched Member 2: {roomDetail.matchedMember2.nickname}</p>
        <p>Unread Messages: {unreadMessageCount}</p>
      </div>
      <div className="chat-room-detail__messages">
        <h2>Messages</h2>
        <ul>
          {roomDetail.messages.map((message, index) => {
            const isNewMessage = message.senderId !== undefined;
            const senderId = isNewMessage ? message.senderId : message.sender.id;
            const messageText = message.message;
            const sendTime = message.sendTime;
            const nickname = isNewMessage ? message.userNickname : message.sender.nickname;

            const dateObject = new Date(sendTime);
            const hours = dateObject.getHours().toString().padStart(2, '0');
            const minutes = dateObject.getMinutes().toString().padStart(2, '0');
            

            const formattedSendTime = `${hours}:${minutes}`
            return (
              <li key={index} className={`message ${senderId === memberId ? 'sent-message' : 'received-message'}`}>
                <p className="message__text"> {senderId === memberId ? '' : `${nickname} `}{messageText} </p>
                <p className="message__time">{formattedSendTime}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <SendMessageForm roomId={roomIdFromLocation} memberId={memberId} roomDetail={roomDetail} nickname={nickname} onNewMessage={handleNewMessage} />
    </div>
  );
}

export default ChatRoomDetail;
