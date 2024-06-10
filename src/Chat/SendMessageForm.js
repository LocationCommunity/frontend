
import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';

function SendMessageForm({ roomId, memberId, nickname, roomDetail, onNewMessage }) {
  const [newMessage, setNewMessage] = useState('');
  const clientRef = useRef(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    clientRef.current = new Client({
      brokerURL: 'ws://localhost:8080/stomp/chat',
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`
      },
      onConnect: () => {
        clientRef.current.subscribe(`/exchange/chat.exchange/room.${roomId}`, message => {
          const receivedMessage = JSON.parse(message.body);
          onNewMessage(receivedMessage);
        });
      },
      onStompError: frame => {
        console.error(`Broker reported error: ${frame.headers['message']}`);
        console.error(`Additional details: ${frame.body}`);
      },
    });

    clientRef.current.activate();

    return () => {
      clientRef.current.deactivate();
    };
  }, [roomId, onNewMessage]);

  const sendMessage = () => {
    const receiverId = roomDetail.matchedMember1.id !== memberId ? roomDetail.matchedMember1.id : roomDetail.matchedMember2.id;
    const userNickname = roomDetail.matchedMember1.nickname !== nickname ? roomDetail.matchedMember1.nickname : roomDetail.matchedMember2.nickname;
    const message = {
      message: newMessage,
      senderId: memberId,
      receiverId: receiverId,
      userNickname:  userNickname,
      roomId: roomId,
      sendTime: new Date().toISOString()
    };

    const accessToken = localStorage.getItem('accessToken');

    clientRef.current.publish({
      destination: `/pub/chat.talk.${roomId}`,
      body: JSON.stringify(message),
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    setNewMessage('');
  };

  return (
    <div className="chat-room-detail__input">
      <input
        type="text"
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default SendMessageForm;

