import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const res = await axios.post('/api/auth/forgot-password', { email });
            setMessage(res.data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally { setLoading(false); }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await axios.post('/api/auth/reset-password', { email, code: otp, newPassword });
            alert('Password reset successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed');
        } finally { setLoading(false); }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: 420 }} className="shadow-lg border-0 rounded-4">
                <Card.Body className="p-4">
                    <h2 className="text-center fw-bold mb-1">🔐 Reset Password</h2>
                    <p className="text-center text-muted small mb-4">
                        {step === 1 ? 'Enter your email to receive a reset OTP' : 'Enter the OTP and set a new password'}
                    </p>
                    {error && <Alert variant="danger" className="py-2">{error}</Alert>}
                    {message && <Alert variant="success" className="py-2">{message}</Alert>}

                    {step === 1 ? (
                        <Form onSubmit={handleForgotSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100 py-2" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset OTP'}
                            </Button>
                        </Form>
                    ) : (
                        <Form onSubmit={handleResetSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>OTP Code</Form.Label>
                                <Form.Control type="text" placeholder="6-digit OTP" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                            </Form.Group>
                            <Button type="submit" variant="success" className="w-100 py-2" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ForgotPassword;
