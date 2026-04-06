import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Form, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { DollarSign, Clock, Calendar, Search } from 'lucide-react';

const ProviderPayments = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters & Sorting
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest
    const [statusFilter, setStatusFilter] = useState('all'); // all, pending, paid

    useEffect(() => {
        fetchPayments();
        const interval = setInterval(() => {
            fetchPayments(true);
        }, 10000); // 10s auto-refresh
        
        return () => clearInterval(interval);
    }, []);

    const fetchPayments = async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const res = await axios.get('/api/provider/bookings', { withCredentials: true });
            // Only care about completed bookings that HAVE a payment status
            const completedBookings = res.data.filter(b => b.status === 'completed');
            setBookings(completedBookings);
        } catch (err) {
            console.error("Failed to fetch payments", err);
        } finally {
            if (!isSilent) setLoading(false);
        }
    };

    // Filter and Sort Logic
    const processedBookings = bookings.filter(b => {
        if (dateFrom && new Date(b.createdAt) < new Date(dateFrom)) return false;
        if (dateTo && new Date(b.createdAt) > new Date(new Date(dateTo).setHours(23, 59, 59))) return false;
        if (statusFilter === 'paid' && b.paymentStatus !== 'paid' && b.isPaid !== true) return false;
        if (statusFilter === 'pending' && (b.paymentStatus === 'paid' || b.isPaid === true)) return false;
        return true;
    }).sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'highest') return b.amount - a.amount;
        if (sortBy === 'lowest') return a.amount - b.amount;
        return 0;
    });

    const totalEarnings = bookings.filter(b => b.paymentStatus === 'paid' || b.isPaid === true).reduce((sum, b) => sum + (b.amount * 0.9), 0);
    const pendingEarnings = bookings.filter(b => b.paymentStatus !== 'paid' && b.isPaid !== true).reduce((sum, b) => sum + (b.amount * 0.9), 0);

    return (
        <Container className="py-4">
            <div className="d-flex align-items-center gap-2 mb-4">
                <DollarSign className="text-success" size={28} />
                <h2 className="fw-bold mb-0">Payment History</h2>
            </div>

            <Row className="mb-4 g-3">
                <Col md={6}>
                    <Card className="border-0 shadow-sm rounded-4 h-100" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' }}>
                        <Card.Body className="p-4 d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-success fw-bold text-uppercase mb-1" style={{ letterSpacing: '0.5px' }}>Total Earnings</h6>
                                <h2 className="fw-bold text-dark mb-0">₹{totalEarnings.toFixed(2)}</h2>
                            </div>
                            <div className="bg-white p-3 rounded-circle shadow-sm">
                                <DollarSign size={24} className="text-success" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="border-0 shadow-sm rounded-4 h-100" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
                        <Card.Body className="p-4 d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-warning fw-bold text-uppercase mb-1" style={{ letterSpacing: '0.5px' }}>Pending Payouts</h6>
                                <h2 className="fw-bold text-dark mb-0">₹{pendingEarnings.toFixed(2)}</h2>
                            </div>
                            <div className="bg-white p-3 rounded-circle shadow-sm">
                                <Clock size={24} className="text-warning" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm rounded-4 mb-4 bg-white">
                <Card.Body className="p-4">
                    <Row className="g-3 align-items-end">
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="small text-muted fw-semibold">From Date</Form.Label>
                                <Form.Control type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="small text-muted fw-semibold">To Date</Form.Label>
                                <Form.Control type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="small text-muted fw-semibold">Status</Form.Label>
                                <Form.Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                    <option value="all">All Payments</option>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="small text-muted fw-semibold">Sort By</Form.Label>
                                <Form.Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="highest">Highest Amount</option>
                                    <option value="lowest">Lowest Amount</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {loading ? (
                <div className="text-center py-5 text-muted">Loading payments...</div>
            ) : processedBookings.length === 0 ? (
                <div className="text-center py-5 bg-light rounded-4 border border-dashed">
                    <p className="text-muted mb-0">No payment records found.</p>
                </div>
            ) : (
                <div className="table-responsive rounded-4 shadow-sm">
                    <Table hover className="bg-white mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th className="py-3 px-4">Booking ID</th>
                                <th className="py-3">Customer</th>
                                <th className="py-3">Date</th>
                                <th className="py-3">Status</th>
                                <th className="py-3 text-end px-4">Amount (90%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedBookings.map(b => (
                                <tr key={b._id}>
                                    <td className="px-4 py-3 text-muted small font-monospace">#{b._id.toString().slice(-6).toUpperCase()}</td>
                                    <td>
                                        <div className="fw-semibold">{b.customer?.name}</div>
                                        <div className="small text-muted text-truncate" style={{ maxWidth: '150px' }}>{b.customer?.email}</div>
                                    </td>
                                    <td>
                                        <div className="small">{new Date(b.createdAt).toLocaleDateString()}</div>
                                        <div className="small text-muted">{new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td>
                                        {b.paymentStatus === 'paid' || b.isPaid === true ? (
                                            <Badge bg="success" pill className="px-3">Paid</Badge>
                                        ) : (
                                            <Badge bg="warning" text="dark" pill className="px-3">Pending</Badge>
                                        )}
                                    </td>
                                    <td className="text-end px-4 fw-bold text-success">
                                        ₹{(b.amount * 0.9).toFixed(2)}
                                        <div className="small text-muted fw-normal">Total: ₹{b.amount}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </Container>
    );
};

export default ProviderPayments;
