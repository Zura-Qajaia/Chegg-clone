import React, { useEffect, useState } from 'react';

const WebSocketComponent = ({ userId, role, questionId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'register', userId, role }));
      socket.send(JSON.stringify({ type: 'joinRoom', userId, questionId }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message' && data.questionId === questionId) {
        setMessages(prev => [...prev, { userId: data.userId, message: data.message }]);
      }
      if (data.type === 'error') {
        alert(data.message);
      }
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [userId, role, questionId]);

  const sendMessage = () => {
    ws.send(JSON.stringify({ type: 'message', message: input, userId, questionId }));
    setInput('');
  };

  return (
    <div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}><strong>{msg.userId}:</strong> {msg.message}</li>
        ))}
      </ul>
      {role === 'expert' && (
        <div>
          <input value={input} onChange={(e) => setInput(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default WebSocketComponent;
