import React from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Search, LayoutDashboard, Calendar, Shield, Heart, DollarSign } from 'lucide-react';

const Navigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (location.pathname === '/role-selection') {
        return null;
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <img
                        alt="Daily Fix Logo"
                        src="/logo.png"
                        width="40"
                        height="40"
                        className="d-inline-block align-top me-2 rounded"
                    />
                    <span className="fw-bold text-primary fs-4">DailyFix</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/search">
                            <Search size={16} className="me-1" /> Find Services
                        </Nav.Link>
                        {user?.role === 'customer' && (
                            <>
                                <Nav.Link as={Link} to="/bookings">
                                    <Calendar size={16} className="me-1" /> My Bookings
                                </Nav.Link>
                                <Nav.Link as={Link} to="/favorites">
                                    <Heart size={16} className="me-1" /> Favorites
                                </Nav.Link>
                            </>
                        )}
                        {user?.role === 'provider' && (
                            <>
                                <Nav.Link as={Link} to="/provider/dashboard">
                                    <LayoutDashboard size={16} className="me-1" /> Dashboard
                                </Nav.Link>
                                <Nav.Link as={Link} to="/provider/payments">
                                    <DollarSign size={16} className="me-1" /> Payments
                                </Nav.Link>
                            </>
                        )}
                        {user?.role === 'admin' && (
                            <Nav.Link as={Link} to="/admin/dashboard">
                                <LayoutDashboard size={16} className="me-1" /> Admin Panel
                            </Nav.Link>
                        )}
                    </Nav>
                    <Nav className="align-items-center">
                        {user ? (
                            <>
                                <span className="text-light me-3 small">
                                    <UserIcon size={16} className="me-1" />
                                    {user.name}
                                    <Badge bg={user.role === 'admin' ? 'danger' : user.role === 'provider' ? 'success' : 'info'} className="ms-2">
                                        {user.role}
                                    </Badge>
                                </span>
                                <Button as={Link} to="/profile" variant="outline-light" size="sm" className="me-2 text-decoration-none">
                                    <UserIcon size={14} className="me-1" /> My Profile
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                                    <LogOut size={14} className="me-1" /> Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/admin/login" className="text-danger border border-danger rounded px-2 me-3 d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
                                    <Shield size={16} className="me-1" /> Admin Portal
                                </Nav.Link>
                                <Nav.Link as={Link} to="/login" className="text-light me-2">Login</Nav.Link>
                                <Button as={Link} to="/register" variant="primary" size="sm">
                                    Register
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
