import React, { useState, useEffect, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Send, Phone, Video, MoreVertical, ArrowLeft, CheckCheck } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ChatWindow = ({ partner, bookingId, height = '400px', showHeader = true, onBack }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        if (imagePath.startsWith('/uploads')) return `http://localhost:5001${imagePath}`;
        return imagePath;
    };

    // Initialize socket and join rooms
    useEffect(() => {
        if (!user || (!partner && !bookingId)) return;

        const newSocket = io('http://localhost:5001', { withCredentials: true });

        newSocket.on('connect', () => {
            // ALWAYS join personal user room — needed to receive direct messages
            newSocket.emit('join', user.id);

            // Also join booking-specific room when bookingId is provided
            if (bookingId) {
                newSocket.emit('joinBookingRoom', bookingId);
            }
        });

        newSocket.on('receiveMessage', (msg) => {
            // Accept messages that belong to this conversation
            const senderId = msg.senderId?._id || msg.senderId;
            const receiverId = msg.receiverId?._id || msg.receiverId;
            const isThisConversation = bookingId
                ? String(msg.bookingId) === String(bookingId)
                : (String(senderId) === String(partner?._id) || String(receiverId) === String(partner?._id));

            if (isThisConversation) {
                setMessages(prev => [...prev, msg]);
            }
        });

        setSocket(newSocket);
        return () => newSocket.close();
    }, [user, partner, bookingId]);

    // Fetch message history
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                if (bookingId) {
                    const res = await axios.get(`/api/chat/booking/${bookingId}`, { withCredentials: true });
                    setMessages(res.data);
                } else if (partner) {
                    const res = await axios.get(`/api/chat/${partner._id}`, { withCredentials: true });
                    setMessages(res.data);
                }
            } catch (err) {
                console.error('Failed to load chat history', err);
            }
        };
        fetchHistory();
    }, [partner, bookingId, user]);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !partner) return;

        const msgData = {
            senderId: user.id,
            receiverId: partner._id,
            bookingId: bookingId || null,
            message: newMessage
        };

        socket.emit('sendMessage', msgData);
        setNewMessage('');
    };

    if (!partner) return (
        <div className="d-flex align-items-center justify-content-center h-100 text-muted flex-column">
            <Send size={48} className="mb-3 opacity-25" />
            <p className="fw-semibold">Select a conversation to start chatting</p>
        </div>
    );

    return (
        <div className="d-flex flex-column bg-white overflow-hidden" style={{ height }}>
            {/* Header */}
            {showHeader && (
                <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-white shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                        <ArrowLeft size={20} className="text-muted" style={{ cursor: 'pointer' }} onClick={onBack} />
                        <div className="position-relative">
                            <img
                                src={getImageUrl(partner.profileImage)}
                                alt={partner.name}
                                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div className="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle" style={{ width: '12px', height: '12px' }} />
                        </div>
                        <div>
                            <h6 className="fw-bold mb-0">{partner.name}</h6>
                            <small className="text-success fw-semibold" style={{ fontSize: '0.75rem' }}>Online</small>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-4 text-muted">
                        <Phone size={20} style={{ cursor: 'pointer' }} />
                        <Video size={20} style={{ cursor: 'pointer' }} />
                        <MoreVertical size={20} style={{ cursor: 'pointer' }} />
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-grow-1 p-3 overflow-auto" style={{ backgroundColor: '#f0f2f5' }}>
                {messages.length === 0 && (
                    <div className="text-center text-muted mt-5">
                        <p className="small">No messages yet. Say hi! 👋</p>
                    </div>
                )}
                {messages.map((msg, idx) => {
                    const senderId = msg.senderId?._id || msg.senderId;
                    const isMe = String(senderId) === String(user.id);
                    const senderName = msg.senderId?.name || (isMe ? 'You' : partner.name);
                    return (
                        <div key={msg._id || idx} className={`d-flex mb-3 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                            {!isMe && (
                                <img
                                    src={getImageUrl(partner.profileImage)}
                                    alt={senderName}
                                    className="me-2 align-self-end"
                                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            )}
                            <div style={{ maxWidth: '75%' }}>
                                {!isMe && <small className="text-muted ms-1 d-block mb-1">{senderName}</small>}
                                <div
                                    className="p-3 rounded-4 shadow-sm"
                                    style={{
                                        backgroundColor: isMe ? '#0948b3' : '#ffffff',
                                        color: isMe ? '#fff' : '#111827',
                                        borderTopRightRadius: isMe ? '4px' : '20px',
                                        borderTopLeftRadius: !isMe ? '4px' : '20px',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    {msg.message}
                                    <div className="d-flex align-items-center justify-content-end gap-1 mt-1" style={{ opacity: 0.65, fontSize: '0.7rem' }}>
                                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        {isMe && <CheckCheck size={14} />}
                                    </div>
                                </div>
                            </div>
                            {isMe && (
                                <img
                                    src={getImageUrl(user.profileImage)}
                                    alt="Me"
                                    className="ms-2 align-self-end"
                                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white border-top">
                <Form onSubmit={handleSend} className="d-flex align-items-center gap-2">
                    <Form.Control
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="rounded-pill bg-light border-0 py-2 px-4 shadow-none"
                        style={{ fontSize: '0.95rem' }}
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        className="rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm"
                        style={{ width: '45px', height: '45px', minWidth: '45px', backgroundColor: '#0948b3', border: 'none' }}
                    >
                        <Send size={18} style={{ marginLeft: '2px' }} />
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default ChatWindow;
