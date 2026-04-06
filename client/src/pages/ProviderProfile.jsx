import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import { Star, MapPin, Calendar, Clock, MessageSquare, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChatModal from '../components/ChatModal';

const ProviderProfile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { state: navState } = useLocation();

    // Use passed state instantly — no loading flash
    const [provider, setProvider] = useState(navState || null);
    const [reviews, setReviews] = useState([]);
    const [showBooking, setShowBooking] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [bookingData, setBookingData] = useState({ date: '', time: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (navState) {
            // Data already available — just fetch reviews in background
            if (navState?.user?._id) fetchReviews(navState.user._id);
        } else {
            // Fallback: direct URL access, fetch from API
            fetchProvider();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProvider = async () => {
        try {
            const res = await axios.get(`/api/booking/provider/${id}`);
            setProvider(res.data);
            if (res.data?.user?._id) {
                fetchReviews(res.data.user._id);
            }
        } catch (err) { console.error(err); }
    };

    const fetchReviews = async (userId) => {
        try {
            const res = await axios.get(`/api/reviews/${userId}`);
            setReviews(res.data);
        } catch (err) { console.error(err); }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        const startTime = new Date(`${bookingData.date}T${bookingData.time}`);
        try {
            await axios.post('/api/booking/book', {
                providerId: provider.user._id,
                startTime,
                amount: provider.hourlyRate * 2
            }, { withCredentials: true });
            setShowBooking(false);
            alert('🎉 Booking Requested! Waiting for provider to accept.');
            navigate('/bookings');
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally { setLoading(false); }
    };

    if (!provider) return (
        <Container className="py-5 text-center">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3 text-muted">Loading provider profile...</p>
        </Container>
    );

    return (
        <Container className="py-4">
            <Row className="g-4">
                <Col lg={8}>
                    <Card className="shadow-sm border-0 rounded-4 mb-4">
                        <Card.Body className="p-4">
                            <div className="d-flex flex-column flex-sm-row gap-4 align-items-center align-items-sm-start">
                                <img 
                                    src={provider.user?.profileImage?.startsWith('/uploads') 
                                        ? `http://localhost:5001${provider.user.profileImage}` 
                                        : (provider.user?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')} 
                                    alt={provider.user?.name}
                                    className="rounded-4 object-fit-cover shadow-sm border border-2 border-white"
                                    style={{ width: '120px', height: '120px' }}
                                />
                                <div className="flex-grow-1">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                                        <div>
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <h2 className="fw-bold mb-0">{provider.user?.name}</h2>
                                                {provider.user?.isVerified && (
                                                    <Badge bg="primary" className="d-flex align-items-center gap-1 rounded-pill">
                                                        <UserCheck size={14} /> Verified
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <Badge bg="secondary" className="px-3 py-1">{provider.category}</Badge>
                                                {provider.experience > 0 && (
                                                    <Badge bg="info" className="px-3 py-1">{provider.experience} years experience</Badge>
                                                )}
                                            </div>
                                            <div className="d-flex align-items-center text-muted small gap-3">
                                                {provider.user?.address?.city && (
                                                    <div className="d-flex align-items-center">
                                                        <MapPin size={14} className="text-danger me-1" />
                                                        {provider.user.address.city}, {provider.user.address.state}
                                                    </div>
                                                )}
                                                {provider.user?.phone && (
                                                    <div className="d-flex align-items-center">
                                                        <span className="fw-bold me-1">📞</span> {provider.user.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <h3 className="text-primary fw-bold mb-0">₹{provider.hourlyRate}/hr</h3>
                                            <div className="d-flex align-items-center justify-content-end gap-1 text-warning">
                                                <Star size={16} style={{ fill: '#ffc107' }} />
                                                <span className="text-dark fw-bold">{Number(provider.rating).toFixed(1)}</span>
                                                <span className="text-muted small">({provider.reviewCount} reviews)</span>
                                            </div>
                                            <div className="mt-3">
                                                <Button 
                                                    variant="outline-primary" 
                                                    className="d-flex align-items-center gap-2 rounded-pill px-4"
                                                    onClick={() => setShowChat(true)}
                                                >
                                                    <MessageSquare size={18} /> Chat with Provider
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className="my-4" />
                            <h5 className="fw-bold mb-3">Professional Biography</h5>
                            <p className="text-muted">{provider.bio || 'This provider has not added a bio yet.'}</p>
                        </Card.Body>
                    </Card>

                    {/* Services Offered Section (Urban Company Style Carousel) */}
                    {provider.services && provider.services.length > 0 && (
                        <div className="mb-5 px-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">Most Booked</h5>
                                <Button variant="link" className="text-decoration-none text-primary fw-semibold p-0 small">See all</Button>
                            </div>
                            
                            <div className="service-scroll-container">
                                {provider.services.map((service, index) => (
                                    <div key={index} className="service-mobile-card">
                                        <div className="service-image-container">
                                            <img 
                                                src={service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=2070&auto=format&fit=crop'} 
                                                alt={service.name}
                                            />
                                        </div>
                                        <div className="p-2 flex-grow-1 d-flex flex-column justify-content-between">
                                            <div>
                                                <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>{service.name}</h6>
                                                <div className="d-flex align-items-center gap-1 mb-1">
                                                    <Star size={10} className="text-warning fill-warning" />
                                                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{service.rating || '4.8'}</span>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mt-auto">
                                                <h6 className="fw-bold mb-0 text-primary" style={{ fontSize: '1rem' }}>₹{service.price}</h6>
                                                <Button variant="outline-primary" className="btn-add-circle border-2 fw-bold">
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Scroll Indicators */}
                            <div className="scroll-indicator-container">
                                {provider.services.length > 0 && provider.services.map((_, idx) => (
                                    <div key={idx} className={`scroll-indicator-dot ${idx === 0 ? 'active' : ''}`}></div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Card className="shadow-sm border-0 rounded-4">
                        <Card.Body className="p-4">
                            <h5 className="fw-semibold mb-3">Customer Reviews ({reviews.length})</h5>
                            {reviews.length === 0 ? (
                                <p className="text-muted">No reviews yet for this provider.</p>
                            ) : reviews.map(r => (
                                <div key={r._id} className="mb-3 p-3 bg-white border shadow-sm rounded-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <img
                                                src={r.customer?.profileImage?.startsWith('/uploads') ? `http://localhost:5001${r.customer.profileImage}` : (r.customer?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')}
                                                alt={r.customer?.name}
                                                className="rounded-circle object-fit-cover shadow-sm border"
                                                style={{ width: '40px', height: '40px' }}
                                            />
                                            <div>
                                                <strong className="d-block mb-0" style={{ lineHeight: '1.2' }}>{r.customer?.name}</strong>
                                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(r.createdAt).toLocaleDateString()}</small>
                                            </div>
                                        </div>
                                        <div className="text-warning d-flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} style={{ fill: i < r.rating ? '#ffc107' : 'none', stroke: '#ffc107' }} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="mb-0 small text-dark mt-2 ms-5 ps-1">{r.comment}</p>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="shadow border-0 rounded-4 bg-primary text-white sticky-top" style={{ top: '80px' }}>
                        <Card.Body className="p-4">
                            <h4 className="fw-bold mb-2">Book a 2-Hour Slot</h4>
                            <p className="opacity-75 small mb-3">Total: ₹{provider.hourlyRate * 2} for 2 hours</p>
                            {user?.role === 'customer' ? (
                                <Button variant="light" size="lg" className="w-100 fw-bold text-primary" onClick={() => setShowBooking(true)}>
                                    <Calendar size={18} className="me-2" /> Book Now
                                </Button>
                            ) : (
                                <div className="alert alert-warning text-dark small p-2 rounded-3">
                                    Please <a href="/login" className="fw-bold">login as a customer</a> to book.
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Booking Modal */}
            <Modal show={showBooking} onHide={() => { setShowBooking(false); setError(''); }} centered>
                <Modal.Header closeButton><Modal.Title>Select Appointment Slot</Modal.Title></Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleBooking}>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" min={new Date().toISOString().split('T')[0]} required onChange={e => setBookingData({ ...bookingData, date: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control 
                                type="time" 
                                lang="en-US"
                                required 
                                onChange={e => setBookingData({ ...bookingData, time: e.target.value })} 
                            />
                        </Form.Group>
                        <Alert variant="info" className="d-flex align-items-center py-2 small">
                            <Clock size={16} className="me-2" /> This books a fixed 2-hour slot.
                        </Alert>
                        <Button variant="primary" type="submit" className="w-100 py-2" disabled={loading}>
                            {loading ? 'Checking availability...' : 'Confirm Booking'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>


            {/* Chat Overlay */}
            {provider && provider.user && (
                <ChatModal 
                    show={showChat} 
                    handleClose={() => setShowChat(false)} 
                    provider={provider.user} 
                />
            )}

        </Container>
    );
};

export default ProviderProfile;
