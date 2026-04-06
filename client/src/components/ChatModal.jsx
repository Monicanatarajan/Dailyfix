import React from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { X } from 'lucide-react';
import ChatWindow from './ChatWindow';

const ChatModal = ({ show, handleClose, provider }) => {
    if (!provider) return null;

    return (
        <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: '400px' }}>
            <Offcanvas.Body className="p-0 bg-light">
                <ChatWindow 
                    partner={provider} 
                    height="100vh" 
                    onBack={handleClose}
                />
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ChatModal;
