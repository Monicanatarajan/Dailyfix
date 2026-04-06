import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { login } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer', idProof: '', location: null });
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleGetLocation = () => {
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            pos => {
                setFormData({ ...formData, location: { lat: pos.coords.latitude, lng: pos.coords.longitude } });
                setLocating(false);
            },
            () => {
                setError('Location access denied. Using default location (Bangalore).');
                setFormData({ ...formData, location: { lat: 12.9716, lng: 77.5946 } });
                setLocating(false);
            }
        );
    };

    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            // First send OTP
            const res = await axios.post('/api/auth/send-otp', { email: formData.email }, { withCredentials: true });
            setMessage(res.data.message || 'OTP sent to your email!');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            // Include OTP in the register payload
            const payload = { ...formData, otp };
            const res = await axios.post('/api/auth/register', payload);
            login(res.data.user);
            // Redirect based on role
            if (res.data.user.role === 'admin') navigate('/admin/dashboard');
            else if (res.data.user.role === 'provider') navigate('/provider/dashboard');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Invalid OTP?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: 420 }} className="shadow-lg border-0 rounded-4">
                <Card.Body className="p-4">
                    <h2 className="text-center fw-bold mb-1">
                        {step === 1 ? '🚀 Create Account' : '🔒 Verify OTP'}
                    </h2>
                    <p className="text-center text-muted small mb-4">
                        {step === 1 ? 'Join as a customer or service provider' : `Enter the 6-digit OTP sent to ${formData.email}`}
                    </p>
                    {error && <Alert variant="danger" className="py-2">{error}</Alert>}
                    {message && <Alert variant="success" className="py-2">{message}</Alert>}

                    {step === 1 ? (
                        <Form onSubmit={handleSendOtp}>
                            <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control type="text" name="name" placeholder="John Doe" onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control type="email" name="email" placeholder="you@example.com" onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" placeholder="Min. 6 characters" onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Aadhaar / Photo ID Number</Form.Label>
                                <Form.Control type="text" name="idProof" placeholder="E.g. 1234 5678 9012" onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="d-flex justify-content-between">
                                    Location {formData.location && <span className="text-success small fw-bold"><CheckCircle size={14} /> Captured</span>}
                                </Form.Label>
                                <Button variant={formData.location ? "outline-success" : "outline-primary"} className="w-100 d-flex align-items-center justify-content-center gap-2"
                                    onClick={handleGetLocation} disabled={locating} type="button">
                                    {locating ? 'Locating...' : formData.location ? 'Location Updated' : <><MapPin size={18} /> Get Current Location</>}
                                </Button>
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>I want to join as</Form.Label>
                                <div className="d-flex gap-3">
                                    {['customer', 'provider'].map(r => (
                                        <Form.Check key={r} type="radio" id={`role-${r}`} name="role" value={r}
                                            label={r === 'customer' ? '🧑 Customer' : '🔧 Service Provider'}
                                            checked={formData.role === r} onChange={handleChange} />
                                    ))}
                                </div>
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100 py-2" disabled={loading}>
                                {loading ? 'Sending OTP...' : 'Continue →'}
                            </Button>
                            <div className="text-center mt-3 small">
                                Already have an account? <Link to="/login">Login</Link>
                            </div>
                        </Form>
                    ) : (
                        <Form onSubmit={handleVerifyAndRegister}>
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
                            <Button type="submit" variant="success" className="w-100 py-2" disabled={loading}>
                                {loading ? 'Registering...' : 'Verify & Register'}
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

export default Register;
