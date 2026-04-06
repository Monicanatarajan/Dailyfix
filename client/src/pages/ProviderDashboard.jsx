import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Form, Button, Row, Col, Table, Badge, Card, Offcanvas } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Check, X, Play, CheckCircle, Clock, MapPin, Star, MessageSquare } from 'lucide-react';
import ChatModal from '../components/ChatModal';
import ChatWindow from '../components/ChatWindow';

const STATUS_COLORS = {
    pending: 'warning', accepted: 'info', 'in-progress': 'primary', completed: 'success', declined: 'secondary', cancelled: 'danger'
};

const ProviderDashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({ category: 'Plumber', hourlyRate: 0, bio: '', location: { type: 'Point', coordinates: [0, 0] } });
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [activeBookingChat, setActiveBookingChat] = useState(null); // { bookingId, customer }
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (user) {
            fetchProfile();
            fetchBookings();
            fetchCategories();
            fetchReviews();
            fetchConversations();

            // Set up auto-refresh (Polling every 10 seconds)
            const interval = setInterval(() => {
                refreshData();
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [user]);

    const refreshData = async () => {
        try {
            // Fetch bookings and check for new ones
            const res = await axios.get('/api/provider/bookings', { withCredentials: true });
            
            // If we have more bookings than before, show an alert
            if (res.data.length > bookings.length && bookings.length > 0) {
                // Play notification sound or show alert
                alert("🔔 New booking arrived!");
            }
            
            setBookings(res.data);
            fetchConversations();
        } catch (err) {
            console.error("Auto-refresh failed", err);
        }
    };

    const fetchConversations = async () => {
        try {
            const res = await axios.get('/api/chat/conversations/list', { withCredentials: true });
            setConversations(res.data);
        } catch (err) { console.error("Failed to fetch conversations", err); }
    };

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/api/provider/profile/me', { withCredentials: true });
            if (res.data) setProfile(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchBookings = async () => {
        try {
            const res = await axios.get('/api/provider/bookings', { withCredentials: true });
            setBookings(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchReviews = async () => {
        try {
            const userId = user?.id || user?._id;
            if (userId) {
                const res = await axios.get(`/api/reviews/${userId}`);
                setReviews(res.data);
            }
        } catch (err) { console.error(err); }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/admin/categories', { withCredentials: true });
            setCategories(res.data);
        } catch (err) { console.error(err); }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/provider/profile', profile, { withCredentials: true });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) { alert('Update failed'); }
        finally { setLoading(false); }
    };

    const detectLocation = () => {
        navigator.geolocation.getCurrentPosition(pos => {
            setProfile(p => ({ ...p, location: { type: 'Point', coordinates: [pos.coords.longitude, pos.coords.latitude] } }));
        }, () => alert('Location access denied.'));
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(`/api/provider/bookings/${id}`, { status }, { withCredentials: true });
            fetchBookings();
        } catch (err) { console.error(err); }
    };

    const completedBookings = bookings.filter(b => b.status === 'completed');
    const totalEarnings = completedBookings.filter(b => b.paymentStatus === 'paid' || b.isPaid === true).reduce((sum, b) => sum + (b.amount * 0.9), 0);
    const pendingEarnings = completedBookings.filter(b => b.paymentStatus !== 'paid' && b.isPaid !== true).reduce((sum, b) => sum + (b.amount * 0.9), 0);

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center my-4 flex-wrap gap-3">
                <h2 className="fw-bold mb-0">🔧 Provider Dashboard</h2>
                {profile.user?.address && (
                    <div className="d-flex align-items-center text-muted bg-white border px-3 py-2 rounded-4 shadow-sm">
                        <MapPin size={18} className="me-2 text-danger" />
                        <span className="small fw-bold text-dark">
                            {[profile.user.address.area, profile.user.address.city].filter(Boolean).join(', ') || 'Location not set'}
                        </span>
                    </div>
                )}
            </div>

            <Row className="mb-4 g-3">
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 h-100 bg-white border-start border-4 border-primary">
                        <Card.Body className="p-3">
                            <h6 className="text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Total Jobs Completed</h6>
                            <h3 className="fw-bold text-dark mb-0">{completedBookings.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 h-100 bg-white border-start border-4 border-success">
                        <Card.Body className="p-3">
                            <h6 className="text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Total Earnings</h6>
                            <h3 className="fw-bold text-success mb-0">₹{totalEarnings.toFixed(2)}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 h-100 bg-white border-start border-4 border-warning">
                        <Card.Body className="p-3">
                            <h6 className="text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Pending Payments</h6>
                            <h3 className="fw-bold text-warning mb-0">₹{pendingEarnings.toFixed(2)}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Tabs defaultActiveKey="bookings" className="mb-4">
                <Tab eventKey="bookings" title={`📋 All Jobs (${bookings.length})`}>
                    {bookings.length === 0 ? (
                        <div className="text-center py-5 text-muted">No incoming jobs yet. Make sure your profile is set and you are verified.</div>
                    ) : (
                        <Table responsive hover className="bg-white rounded-4 shadow-sm overflow-hidden">
                            <thead className="table-dark">
                                <tr><th>Customer</th><th>Schedule</th><th>Payout (90%)</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b._id}>
                                        <td className="align-middle">{b.customer?.name}<br /><span className="text-muted small">{b.customer?.email}</span></td>
                                        <td className="align-middle">{new Date(b.startTime).toLocaleString()}<br /><span className="text-muted small">2 hour slot</span></td>
                                        <td className="align-middle fw-bold text-success">
                                            ₹{(b.amount * 0.9).toFixed(2)}
                                            <br /><span className="text-muted fw-normal small">Total: ₹{b.amount}</span>
                                        </td>
                                        <td className="align-middle">
                                            <Badge bg={STATUS_COLORS[b.status] || 'secondary'}>{b.status}</Badge>
                                            {(b.paymentStatus === 'paid' || b.isPaid === true)
                                                ? <Badge bg="success" className="ms-1">Paid</Badge>
                                                : b.status === 'completed' && <Badge bg="danger" className="ms-1">Pending Payment</Badge>
                                            }
                                        </td>
                                        <td className="align-middle">
                                            <div className="d-flex gap-1 flex-wrap">
                                            {b.status === 'pending' && (
                                                <>
                                                    <Button size="sm" variant="success" onClick={() => updateStatus(b._id, 'accepted')}><Check size={14} /> Accept</Button>
                                                    <Button size="sm" variant="danger" onClick={() => updateStatus(b._id, 'declined')}><X size={14} /> Decline</Button>
                                                </>
                                            )}
                                            {b.status === 'accepted' && (
                                                <Button size="sm" variant="primary" onClick={() => updateStatus(b._id, 'in-progress')}><Play size={14} /> Start</Button>
                                            )}
                                            {b.status === 'in-progress' && (
                                                <Button size="sm" variant="success" onClick={() => updateStatus(b._id, 'completed')}><CheckCircle size={14} /> Complete</Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline-primary"
                                                title="Chat with Customer"
                                                onClick={() => setActiveBookingChat({ bookingId: b._id, customer: b.customer })}
                                            >
                                                <MessageSquare size={14} />
                                            </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Tab>
                <Tab eventKey="messages" title="💬 Messages">
                    <div className="mt-3 bg-white rounded-4 shadow-sm overflow-hidden" style={{ height: '620px' }}>
                        <Row className="g-0 h-100">
                            {/* Unified Sidebar: Direct Chats + Booking Chats */}
                            <Col md={4} className="border-end d-flex flex-column" style={{ background: '#f8f9fa' }}>
                                <div className="p-3 border-bottom bg-white">
                                    <h6 className="fw-bold mb-0">💬 All Messages</h6>
                                </div>
                                <div className="flex-grow-1 overflow-auto">

                                    {/* Section 1: Direct conversations (from ProviderProfile chat) */}
                                    {conversations.length > 0 && (
                                        <>
                                            <div className="px-3 py-2 bg-light border-bottom">
                                                <small className="text-muted fw-semibold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>Direct Messages</small>
                                            </div>
                                            {conversations.map(conv => {
                                                const isActive = activeBookingChat?.bookingId === null && activeBookingChat?.customer?._id === conv._id;
                                                return (
                                                    <div
                                                        key={`conv-${conv._id}`}
                                                        className={`p-3 border-bottom ${isActive ? 'bg-primary' : 'bg-white'}`}
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => setActiveBookingChat({ bookingId: null, customer: { _id: conv._id, name: conv.name, profileImage: conv.profileImage } })}
                                                    >
                                                        <div className="d-flex align-items-center gap-2">
                                                            <img
                                                                src={conv.profileImage?.startsWith('/uploads') ? `http://localhost:5001${conv.profileImage}` : (conv.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')}
                                                                alt={conv.name}
                                                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                                            />
                                                            <div className="flex-grow-1 overflow-hidden">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <h6 className={`mb-0 fw-bold text-truncate small ${isActive ? 'text-white' : ''}`}>{conv.name}</h6>
                                                                    {conv.unread > 0 && <Badge bg="danger" pill style={{ fontSize: '0.6rem' }}>{conv.unread}</Badge>}
                                                                </div>
                                                                <p className={`mb-0 text-truncate ${isActive ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>
                                                                    {conv.lastMessage}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )}

                                    {/* Section 2: Booking-based chats */}
                                    {bookings.length > 0 && (
                                        <>
                                            <div className="px-3 py-2 bg-light border-bottom">
                                                <small className="text-muted fw-semibold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>Booking Chats</small>
                                            </div>
                                            {bookings.map(b => {
                                                const isActive = activeBookingChat?.bookingId === b._id;
                                                return (
                                                    <div
                                                        key={`booking-${b._id}`}
                                                        className={`p-3 border-bottom ${isActive ? 'bg-primary' : 'bg-white'}`}
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => setActiveBookingChat({ bookingId: b._id, customer: b.customer })}
                                                    >
                                                        <div className="d-flex align-items-center gap-2">
                                                            <img
                                                                src={b.customer?.profileImage?.startsWith('/uploads') ? `http://localhost:5001${b.customer.profileImage}` : (b.customer?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')}
                                                                alt={b.customer?.name}
                                                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: isActive ? '2px solid white' : '2px solid #dee2e6' }}
                                                            />
                                                            <div className="flex-grow-1 overflow-hidden">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <h6 className={`mb-0 fw-bold text-truncate small ${isActive ? 'text-white' : ''}`}>{b.customer?.name || 'Customer'}</h6>
                                                                    <Badge bg={isActive ? 'light' : 'secondary'} text="dark" style={{ fontSize: '0.55rem' }}>{b.status}</Badge>
                                                                </div>
                                                                <p className={`mb-0 text-truncate ${isActive ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>
                                                                    Booking ₹{b.amount}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )}

                                    {/* Empty state */}
                                    {conversations.length === 0 && bookings.length === 0 && (
                                        <div className="text-center py-5 px-3">
                                            <MessageSquare size={40} className="text-muted mb-3 opacity-25" />
                                            <p className="text-muted small fw-semibold mb-1">No messages yet</p>
                                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Customers can message you via your Profile page</p>
                                        </div>
                                    )}
                                </div>
                            </Col>

                            {/* Right pane: Chat Window */}
                            <Col md={8} className="d-flex flex-column p-0">
                                {activeBookingChat ? (
                                    <ChatWindow
                                        partner={activeBookingChat.customer}
                                        bookingId={activeBookingChat.bookingId}
                                        height="620px"
                                        showHeader={true}
                                        onBack={() => setActiveBookingChat(null)}
                                    />
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center h-100 flex-column" style={{ background: '#f0f2f5' }}>
                                        <div className="text-center p-4">
                                            <div className="mb-3" style={{ fontSize: '3rem' }}>💬</div>
                                            <h5 className="fw-bold text-dark mb-2">Your Messages</h5>
                                            <p className="text-muted small mb-0">Select a conversation from the left to start chatting</p>
                                        </div>
                                    </div>
                                )}
                            </Col>
                        </Row>
                    </div>
                </Tab>


                <Tab eventKey="profile" title="⚙️ My Profile">
                    <Row className="mt-3">
                        <Col md={7}>
                            <Card className="shadow-sm border-0 rounded-4">
                                <Card.Body className="p-4">
                                    {saved && <div className="alert alert-success py-2">✓ Profile updated successfully!</div>}
                                    <Form onSubmit={handleProfileSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Service Category</Form.Label>
                                            <Form.Select value={profile.category} onChange={e => setProfile(p => ({ ...p, category: e.target.value }))} required>
                                                <option value="">Select Category</option>
                                                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Hourly Rate (₹)</Form.Label>
                                            <Form.Control type="number" min="1" value={profile.hourlyRate} onChange={e => setProfile(p => ({ ...p, hourlyRate: e.target.value }))} required />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Bio / Description</Form.Label>
                                            <Form.Control as="textarea" rows={3} placeholder="Describe your experience..." value={profile.bio || ''} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} />
                                        </Form.Group>
                                        <Form.Group className="mb-4">
                                            <Form.Label>Business Location (Geospatial)</Form.Label>
                                            <div className="d-flex gap-2">
                                                <Form.Control readOnly value={`Lon: ${Number(profile.location?.coordinates?.[0]).toFixed(4)}, Lat: ${Number(profile.location?.coordinates?.[1]).toFixed(4)}`} />
                                                <Button type="button" variant="secondary" onClick={detectLocation}><MapPin size={16} /></Button>
                                            </div>
                                            <Form.Text className="text-muted">Click the pin icon to auto-detect your current coordinates.</Form.Text>
                                        </Form.Group>
                                        <Button type="submit" variant="primary" className="w-100 py-2" disabled={loading}>
                                            {loading ? 'Saving...' : 'Update Profile'}
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={5}>
                            <Card className="border-0 rounded-4 h-100" style={{ background: user?.isVerified ? '#d1fae5' : '#fef9c3' }}>
                                <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center p-4">
                                    {user?.isVerified ? (
                                        <>
                                            <CheckCircle size={56} className="text-success mb-3" />
                                            <h5 className="fw-bold text-success">You are Verified!</h5>
                                            <p className="text-muted small">Your blue checkmark is visible to customers searching in your area.</p>
                                        </>
                                    ) : (
                                        <>
                                            <Clock size={56} className="text-warning mb-3" />
                                            <h5 className="fw-bold">Pending Verification</h5>
                                            <p className="text-muted small">An admin will review your profile and grant the blue verified badge.</p>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="reviews" title={`⭐ Reviews (${reviews.length})`}>
                    <div className="mt-3">
                        {reviews.length === 0 ? (
                            <div className="text-center py-5 text-muted">No reviews yet. Complete more jobs to gather customer feedback.</div>
                        ) : (
                            <Row>
                                {reviews.map(r => (
                                    <Col md={6} lg={4} key={r._id} className="mb-3">
                                        <Card className="shadow-sm border-0 rounded-4 h-100">
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <img
                                                            src={r.customer?.profileImage?.startsWith('/uploads') ? `http://localhost:5001${r.customer.profileImage}` : (r.customer?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')}
                                                            alt={r.customer?.name}
                                                            className="rounded-circle object-fit-cover shadow-sm border"
                                                            style={{ width: '40px', height: '40px' }}
                                                        />
                                                        <div>
                                                            <h6 className="fw-bold mb-0 d-block" style={{ lineHeight: '1.2' }}>{r.customer?.name}</h6>
                                                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(r.createdAt).toLocaleDateString()}</small>
                                                        </div>
                                                    </div>
                                                    <div className="text-warning d-flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={14} style={{ fill: i < r.rating ? '#ffc107' : 'none', stroke: '#ffc107' }} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="mb-0 small text-dark mt-2 ms-5 ps-1">{r.comment}</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </div>
                </Tab>
            </Tabs>

            {/* Legacy Messages tab modal */}
            {selectedCustomer && (
                <ChatModal
                    show={showChat}
                    handleClose={() => setShowChat(false)}
                    provider={selectedCustomer}
                />
            )}

            {/* Booking-specific Chat Offcanvas */}
            <Offcanvas
                show={!!activeBookingChat}
                onHide={() => setActiveBookingChat(null)}
                placement="end"
                style={{ width: '420px' }}
            >
                <Offcanvas.Body className="p-0">
                    {activeBookingChat && (
                        <ChatWindow
                            partner={activeBookingChat.customer}
                            bookingId={activeBookingChat.bookingId}
                            height="100vh"
                            onBack={() => setActiveBookingChat(null)}
                        />
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </Container>
    );
};

export default ProviderDashboard;
