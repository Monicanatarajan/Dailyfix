import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Shield, Eye, EyeOff, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Use the existing user login endpoint
            const res = await axios.post('/api/auth/login', formData);
            
            // Check if the user is an admin
            if (res.data.user.role !== 'admin') {
                setError('Unauthorized access. Admin privileges required.');
                // Optionally log them out if they are not admin but somehow logged in here
                await axios.post('/api/auth/logout');
                return;
            }

            // Valid Admin
            login(res.data.user);
            navigate('/admin/dashboard');

        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6} xl={5}>
                    <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="bg-dark p-4 text-center">
                            <Shield size={48} className="text-danger mb-2" />
                            <h3 className="text-white fw-bold mb-0">Admin Portal Log In</h3>
                        </div>
                        <Card.Body className="p-4 p-md-5">
                            {error && (
                                <Alert variant="danger" className="border-0 rounded-3">
                                    {error}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold text-secondary">Admin Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="admin@example.com"
                                        className="form-control-lg bg-light"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold text-secondary">Admin Password</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="form-control-lg bg-light pe-5"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted text-decoration-none"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </Form.Group>

                                <Button
                                    variant="danger"
                                    type="submit"
                                    className="w-100 py-3 fw-bold rounded-3 mb-3 d-flex align-items-center justify-content-center gap-2 text-white"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        <>
                                            <LogIn size={20} />
                                            Access Dashboard
                                        </>
                                    )}
                                </Button>
                                
                                <div className="text-center mt-3">
                                    <Button variant="link" onClick={() => navigate('/')} className="text-secondary text-decoration-none small">
                                        Return to Main Site
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminLogin;
