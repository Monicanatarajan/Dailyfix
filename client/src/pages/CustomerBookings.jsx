import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Form, Offcanvas } from 'react-bootstrap';
import axios from 'axios';
import { MessageSquare, Star, Lock, FileText, CreditCard, Smartphone, Building, QrCode, Heart, Trash2, MapPin, Banknote } from 'lucide-react';
import { Row, Col, Card } from 'react-bootstrap';
import ChatWindow from '../components/ChatWindow';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const STATUS_COLORS = {
    pending: 'warning', accepted: 'info', 'in-progress': 'primary', completed: 'success', declined: 'secondary', cancelled: 'danger'
};

const CustomerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [showReview, setShowReview] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [activeBooking, setActiveBooking] = useState(null);
    const [activeBookingChat, setActiveBookingChat] = useState(null); // { bookingId, provider }
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    
    // Advanced Payment Simulator State
    const [paymentStep, setPaymentStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentDetails, setPaymentDetails] = useState({ id: '', bank: '' });
    
    const [existingReviewId, setExistingReviewId] = useState(null);
    const [fetchReviewLoading, setFetchReviewLoading] = useState(false);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchBookings();
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/api/profile', { withCredentials: true });
            setProfile(res.data);
        } catch (err) { console.error('Failed to fetch profile', err); }
    };

    const fetchBookings = async () => {
        try {
            // Fetch the logged-in customer's bookings
            const res = await axios.get('/api/booking/my-bookings', { withCredentials: true });
            setBookings(res.data);
        } catch (err) { console.error(err); }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (existingReviewId) {
                await axios.put(`/api/reviews/${existingReviewId}`, {
                    rating,
                    comment
                }, { withCredentials: true });
                alert('Review updated successfully!');
            } else {
                await axios.post('/api/reviews', {
                    bookingId: selectedBooking._id,
                    rating,
                    comment
                }, { withCredentials: true });
                alert('Review submitted!');
            }
            setShowReview(false);
            setComment(''); setRating(5); setExistingReviewId(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit review');
        } finally { setLoading(false); }
    };

    const openReviewModal = async (b) => {
        setSelectedBooking(b);
        setRating(5);
        setComment('');
        setExistingReviewId(null);
        setFetchReviewLoading(true);
        setShowReview(true);
        try {
            const res = await axios.get(`/api/reviews/booking/${b._id}`, { withCredentials: true });
            if (res.data) {
                setExistingReviewId(res.data._id);
                setRating(res.data.rating);
                setComment(res.data.comment);
            }
        } catch (err) {
            // Not found, ignore
        } finally {
            setFetchReviewLoading(false);
        }
    };

    const handleSimulatedPayment = async () => {
        // Validation based on method
        if (paymentMethod === 'UPI' || paymentMethod === 'GPay') {
            if (!paymentDetails.id) return alert('Please enter your UPI ID');
        } else if (paymentMethod === 'NetBanking') {
            if (!paymentDetails.bank) return alert('Please select a bank');
        }

        setPaymentProcessing(true);
        try {
            // Simulate network delay for real feel
            setTimeout(async () => {
                try {
                    await axios.post(`/api/booking/payment-confirm/${activeBooking._id}`, {
                        razorpay_signature: 'mock_signature', // Bypasses crypto in our backend
                        razorpay_payment_id: `txn_sim_${Date.now()}`
                    }, { withCredentials: true });

                    setShowPayment(false);
                    // Reset Payment State
                    setPaymentStep(1); 
                    setPaymentMethod(''); 
                    setPaymentDetails({ id: '', bank: '' });
                    
                    alert(`🎉 Payment Successful via ${paymentMethod}! Please write a review for the provider.`);
                    fetchBookings();
                    // Auto-open review modal
                    openReviewModal(activeBooking);
                } catch (err) {
                    alert('Simulated Payment Failed');
                } finally {
                    setPaymentProcessing(false);
                }
            }, 2000);
        } catch (err) {
            console.error('Checkout error:', err);
            setPaymentProcessing(false);
        }
    };

    const handleOpenPayment = (b) => {
        setActiveBooking(b); 
        setShowPayment(true);
        setPaymentStep(1);
        setPaymentMethod('');
        setPaymentDetails({ id: '', bank: '' });
    };

    const generateBill = (booking) => {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.setTextColor(40);
        doc.text("DailyFix - Payment Receipt", 105, 20, null, null, "center");

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Receipt No: ${booking._id.substring(0, 8).toUpperCase()}`, 20, 40);
        doc.text(`Date: ${new Date(booking.startTime).toLocaleDateString()}`, 20, 48);
        doc.text(`Provider: ${booking.provider?.name}`, 20, 56);
        doc.text(`Status: Paid`, 20, 64);

        autoTable(doc, {
            startY: 75,
            head: [['Service Description', 'Amount']],
            body: [
                ['Professional Service Fee', `Rs. ${booking.amount}`],
                ['Total Paid', `Rs. ${booking.amount}`]
            ],
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] }
        });

        doc.setFontSize(10);
        doc.text("Thank you for using DailyFix!", 105, doc.lastAutoTable.finalY + 20, null, null, "center");

        doc.save(`DailyFix_Receipt_${booking._id.substring(0, 6)}.pdf`);
    };

    return (
        <>
        <Container>
            <div className="d-flex justify-content-between align-items-center my-4 flex-wrap gap-3">
                <h2 className="fw-bold mb-0">📋 My Bookings</h2>
                {profile?.user?.address && (
                    <div className="d-flex align-items-center text-muted bg-white border px-3 py-2 rounded-4 shadow-sm">
                        <MapPin size={18} className="me-2 text-danger" />
                        <span className="small fw-bold text-dark">
                            {[profile.user.address.area, profile.user.address.city].filter(Boolean).join(', ') || 'Location not set'}
                        </span>
                    </div>
                )}
            </div>
            {bookings.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <p>No bookings yet. <a href="/search">Find a service provider</a> to get started.</p>
                </div>
            ) : (
                <Table responsive hover className="bg-white rounded-4 shadow-sm">
                    <thead className="table-dark">
                        <tr><th>Provider</th><th>Date & Time</th><th>Amount</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        {bookings.map(b => (
                            <tr key={b._id}>
                                <td className="align-middle fw-semibold">{b.provider?.name}</td>
                                <td className="align-middle small">{new Date(b.startTime).toLocaleString()}</td>
                                <td className="align-middle fw-bold">₹{b.amount}</td>
                                <td className="align-middle">
                                    <div className="d-flex flex-column gap-1">
                                        <Badge bg={STATUS_COLORS[b.status] || 'secondary'}>{b.status}</Badge>
                                        {(b.isPaid || b.paymentStatus === 'paid') ? (
                                            <Badge bg="success" style={{ fontSize: '0.7rem' }}>✓ Paid</Badge>
                                        ) : (
                                            <Badge bg="danger" style={{ fontSize: '0.7rem' }}>Pending Payment</Badge>
                                        )}
                                    </div>
                                </td>
                                <td className="align-middle">
                                    <div className="d-flex gap-2 flex-wrap">
                                    {b.paymentStatus === 'unpaid' && ['accepted', 'in-progress', 'completed'].includes(b.status) && (
                                        <Button size="sm" variant="success" onClick={() => handleOpenPayment(b)}>
                                            <Lock size={14} className="me-1" /> Pay Now
                                        </Button>
                                    )}
                                    {b.status === 'completed' && b.paymentStatus === 'paid' && (
                                        <>
                                            <Button size="sm" variant="outline-primary" onClick={() => openReviewModal(b)}>
                                                <Star size={14} className="me-1" /> Review
                                            </Button>
                                            <Button size="sm" variant="outline-success" onClick={() => generateBill(b)}>
                                                <FileText size={14} className="me-1" /> Bill
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        title="Chat with Provider"
                                        onClick={() => setActiveBookingChat({ bookingId: b._id, provider: b.provider })}
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

            <Modal show={showReview} onHide={() => setShowReview(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{existingReviewId ? `⭐ Update Review for ${selectedBooking?.provider?.name}` : `⭐ Leave a Review for ${selectedBooking?.provider?.name}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {fetchReviewLoading ? (
                        <div className="text-center py-4 text-muted">Checking previous reviews...</div>
                    ) : (
                        <Form onSubmit={submitReview}>
                            {existingReviewId && (
                                <div className="alert alert-success mb-3 py-2 small d-flex align-items-center">
                                    <Star size={16} className="me-2 text-success" /> You have already reviewed this order. You can edit it below.
                                </div>
                            )}
                            <Form.Group className="mb-3">
                                <Form.Label>Rating</Form.Label>
                                <div className="d-flex gap-2">
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <Button key={n} size="sm" variant={rating >= n ? 'warning' : 'outline-warning'} onClick={() => setRating(n)} type="button">
                                            <Star size={16} style={{ fill: rating >= n ? '#fff' : 'none' }} />
                                        </Button>
                                    ))}
                                    <span className="ms-2 fw-bold align-self-center">{rating}/5</span>
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control as="textarea" rows={4} placeholder="Share your experience..." value={comment} onChange={e => setComment(e.target.value)} required />
                            </Form.Group>
                            <Button type="submit" variant={existingReviewId ? "success" : "primary"} className="w-100 py-2" disabled={loading}>
                                {loading ? 'Submitting...' : (existingReviewId ? 'Update Review' : 'Submit Review')}
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            {/* Simulated Razorpay Modal */}
            <Modal show={showPayment} backdrop="static" keyboard={false} centered size="md">
                <Modal.Header className="bg-light">
                    <Modal.Title className="d-flex align-items-center text-primary fw-bold">
                        <Lock size={20} className="me-2" /> DailyFix Secure Checkout
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 py-4">
                    {paymentStep === 1 && (
                        <div>
                            <div className="text-center mb-4">
                                <h5 className="text-muted mb-1">Total Amount Payable</h5>
                                <h2 className="fw-bold mb-0">₹{activeBooking?.amount}</h2>
                                <p className="small text-muted mt-2">To {activeBooking?.provider?.name}</p>
                            </div>
                            
                            <p className="fw-semibold text-dark mb-3">Select Payment Method</p>
                            <div className="d-grid gap-2">
                                <Button variant="outline-dark" className="text-start p-3 d-flex align-items-center" onClick={() => { setPaymentMethod('GPay'); setPaymentStep(2); }}>
                                    <Smartphone size={20} className="me-3 text-success" /> Google Pay (GPay)
                                </Button>
                                <Button variant="outline-dark" className="text-start p-3 d-flex align-items-center" onClick={() => { setPaymentMethod('UPI'); setPaymentStep(2); }}>
                                    <QrCode size={20} className="me-3 text-primary" /> Any UPI App / QR Code
                                </Button>
                                <Button variant="outline-dark" className="text-start p-3 d-flex align-items-center" onClick={() => { setPaymentMethod('NetBanking'); setPaymentStep(2); }}>
                                    <Building size={20} className="me-3 text-info" /> Net Banking
                                </Button>
                                <Button variant="outline-dark" className="text-start p-3 d-flex align-items-center" onClick={() => { setPaymentMethod('Card'); setPaymentStep(2); }}>
                                    <CreditCard size={20} className="me-3 text-warning" /> Credit / Debit Card
                                </Button>
                                <Button variant="outline-dark" className="text-start p-3 d-flex align-items-center" onClick={() => { setPaymentMethod('Cash on Delivery'); setPaymentStep(2); }}>
                                    <Banknote size={20} className="me-3 text-success" /> Cash on Delivery (COD)
                                </Button>
                            </div>
                        </div>
                    )}

                    {paymentStep === 2 && (
                        <div className="text-center">
                            <h5 className="text-muted mb-3 d-flex align-items-center justify-content-center">
                                {paymentMethod === 'GPay' && <Smartphone size={20} className="me-2 text-success" />}
                                {paymentMethod === 'UPI' && <QrCode size={20} className="me-2 text-primary" />}
                                {paymentMethod === 'NetBanking' && <Building size={20} className="me-2 text-info" />}
                                {paymentMethod === 'Card' && <CreditCard size={20} className="me-2 text-warning" />}
                                {paymentMethod === 'Cash on Delivery' && <Banknote size={20} className="me-2 text-success" />}
                                Processing via {paymentMethod}
                            </h5>
                            
                            {/* Method Specific UI */}
                            {(paymentMethod === 'UPI' || paymentMethod === 'GPay') && (
                                <div className="mb-4">
                                    <div className="bg-white p-3 border rounded-4 d-inline-block shadow-sm mb-3">
                                        {/* Fake QR Code using an online generator for simulation */}
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=dailyfix@ybl&pn=DailyFix&am=${activeBooking?.amount}`} alt="Scan to Pay" />
                                        <p className="small text-muted mt-2 mb-0">Scan with any UPI App</p>
                                    </div>
                                    <p className="fw-bold mb-2">OR</p>
                                    <Form.Control type="text" placeholder="Enter UPI ID (e.g. name@okhdfc)" value={paymentDetails.id} onChange={e => setPaymentDetails({...paymentDetails, id: e.target.value})} />
                                </div>
                            )}

                            {paymentMethod === 'NetBanking' && (
                                <div className="mb-4 text-start">
                                    <Form.Label>Select Bank</Form.Label>
                                    <Form.Select value={paymentDetails.bank} onChange={e => setPaymentDetails({...paymentDetails, bank: e.target.value})}>
                                        <option value="">Choose your bank...</option>
                                        <option value="HDFC">HDFC Bank</option>
                                        <option value="SBI">State Bank of India</option>
                                        <option value="ICICI">ICICI Bank</option>
                                        <option value="Axis">Axis Bank</option>
                                    </Form.Select>
                                </div>
                            )}

                            {paymentMethod === 'Card' && (
                                <div className="mb-4 text-start">
                                    <Form.Label>Card Number</Form.Label>
                                    <Form.Control type="text" placeholder="XXXX XXXX XXXX XXXX" className="mb-2" />
                                    <div className="d-flex gap-2">
                                        <Form.Control type="text" placeholder="MM/YY" />
                                        <Form.Control type="password" placeholder="CVV" />
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'Cash on Delivery' && (
                                <div className="mb-4 text-center mt-4">
                                    <div className="bg-success bg-opacity-10 d-inline-block p-4 rounded-circle mb-3">
                                        <Banknote size={48} className="text-success" />
                                    </div>
                                    <p className="text-muted">You have selected to pay by cash physically exactly when the service is fully completed.</p>
                                    <p className="fw-bold fs-5 mb-0 text-dark">Please keep exact change ready: ₹{activeBooking?.amount}</p>
                                </div>
                            )}

                            <div className="bg-light rounded-3 p-3 mb-4 text-start border">
                                <div className="d-flex justify-content-between fw-bold text-dark"><span>Amount Payable</span><span>₹{activeBooking?.amount}</span></div>
                            </div>

                            <Button variant="primary" size="lg" className="w-100 py-3 fw-bold rounded-pill shadow-sm mb-3" onClick={handleSimulatedPayment} disabled={paymentProcessing}>
                                {paymentProcessing ? 'Processing Payment...' : (paymentMethod === 'Cash on Delivery' ? 'Confirm Delivery & Pay Cash' : `Complete Payment of ₹${activeBooking?.amount}`)}
                            </Button>
                            <Button variant="outline-secondary" className="w-100 py-2 rounded-pill" onClick={() => setPaymentStep(1)} disabled={paymentProcessing}>
                                Back to Payment Methods
                            </Button>
                        </div>
                    )}
                    
                    {paymentStep === 1 && (
                        <div className="text-center mt-3">
                            <Button variant="link" className="text-danger small text-decoration-none" onClick={() => setShowPayment(false)} disabled={paymentProcessing}>
                                Cancel Transaction
                            </Button>
                        </div>
                    )}
                    <div className="mt-4 pt-3 border-top d-flex justify-content-center align-items-center text-muted small">
                        <Lock size={12} className="me-1" /> Secured by Razorpay Simulation Engine
                    </div>
                </Modal.Body>
            </Modal>
        </Container>

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
                            partner={activeBookingChat.provider}
                            bookingId={activeBookingChat.bookingId}
                            height="100vh"
                            onBack={() => setActiveBookingChat(null)}
                        />
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default CustomerBookings;
