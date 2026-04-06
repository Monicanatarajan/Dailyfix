import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, Lock } from 'lucide-react';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        // We can pass the selected role to the login/register page if needed, 
        // or just navigate to login. For now, we'll navigate to login.
        // If they need to register, they can click register on the login page.
        // Ideally we might pass role via state: navigate('/login', { state: { role } });
        // Let's just navigate to login
        navigate('/login', { state: { role } });
    };

    return (
        <Container fluid className="d-flex flex-column align-items-center justify-content-center min-vh-100 landing-page-bg">
            <div className="text-center mb-4">
                <div className="logo-container mb-3 mx-auto d-flex align-items-center justify-content-center rounded overflow-hidden" style={{ width: '120px', height: '120px', background: 'transparent', boxShadow: 'none' }}>
                    <img src="/logo.png" alt="DailyFix Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <h1 className="fw-bold mb-1" style={{ fontSize: '2.5rem', color: '#0d47a1' }}>DailyFix</h1>
                <p className="text-muted fs-5">Your Home Service Expert</p>
            </div>

            <Card className="glass-card shadow border-0 rounded-4" style={{ width: '100%', maxWidth: '400px' }}>
                <Card.Body className="p-4">
                    <h5 className="text-center fw-bold mb-4">Continue as</h5>

                    <div className="d-grid gap-3">
                        <Button
                            variant="outline-secondary"
                            size="lg"
                            className="d-flex align-items-center role-btn text-dark text-start border bg-white"
                            onClick={() => handleRoleSelect('customer')}
                        >
                            <User size={20} className="me-3 text-muted" />
                            <span className="flex-grow-1">Customer</span>
                        </Button>

                        <Button
                            variant="outline-secondary"
                            size="lg"
                            className="d-flex align-items-center role-btn text-dark text-start border bg-white"
                            onClick={() => handleRoleSelect('provider')}
                        >
                            <Briefcase size={20} className="me-3 text-muted" />
                            <span className="flex-grow-1">Service Provider</span>
                        </Button>

                        <Button
                            variant="outline-secondary"
                            size="lg"
                            className="d-flex align-items-center role-btn text-dark text-start border bg-white"
                            onClick={() => handleRoleSelect('admin')}
                        >
                            <Lock size={20} className="me-3 text-muted" />
                            <span className="flex-grow-1">Admin</span>
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Landing;
