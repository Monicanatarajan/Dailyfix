import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/send-otp', { email }, { withCredentials: true });
            setMessage(res.data.message || 'OTP sent successfully!');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/verify-otp', { email, otp }, { withCredentials: true });
            login(res.data.user);
            // Redirect to homepage for all users as per requirements
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: 420 }} className="shadow-lg border-0 rounded-4">
                <Card.Body className="p-4">
                    <h2 className="text-center fw-bold mb-1">
                        {step === 1 ? '👋 Welcome Back' : '🔒 Verify OTP'}
                    </h2>
                    <p className="text-center text-muted small mb-4">
                        {step === 1 ? 'Enter your email to receive an OTP' : `Enter the 6-digit OTP sent to ${email}`}
                    </p>
                    {error && <Alert variant="danger" className="py-2">{error}</Alert>}
                    {message && <Alert variant="success" className="py-2">{message}</Alert>}

                    {step === 1 ? (
                        <Form onSubmit={handleSendOtp}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="you@example.com" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    required 
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100 py-2" disabled={loading}>
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </Button>
                            <div className="text-center mt-3 small">
                                <Link to="/register">Create Account</Link>
                            </div>
                        </Form>
                    ) : (
                        <Form onSubmit={handleVerifyOtp}>
                            <Form.Group className="mb-3">
                                <Form.Label>OTP</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter 6-digit OTP" 
                                    value={otp} 
                                    onChange={e => setOtp(e.target.value)} 
                                    required 
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100 py-2" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </Button>
                            <Button 
                                variant="link" 
                                className="w-100 mt-2 text-decoration-none" 
                                onClick={handleSendOtp} 
                                disabled={loading}
                            >
                                Resend OTP
                            </Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
