import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Tabs, Tab, Form } from 'react-bootstrap';
import axios from 'axios';
import { Users, DollarSign, Briefcase, TrendingUp, CheckCircle, Shield, Plus, Trash2, FileText, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    FaBroom, FaBolt, FaWrench, FaHammer, FaSnowflake, FaPaintRoller,
    FaCut, FaTree, FaCar, FaDog, FaHome, FaShower, FaCouch, FaToolbox,
    FaTruck, FaFireExtinguisher, FaPlug, FaLeaf, FaKey, FaCamera
} from 'react-icons/fa';

const ICON_OPTIONS = [
    { key: 'FaBroom',           label: 'Cleaning',      Component: FaBroom },
    { key: 'FaBolt',            label: 'Electricity',   Component: FaBolt },
    { key: 'FaWrench',          label: 'Plumber',       Component: FaWrench },
    { key: 'FaHammer',          label: 'Carpenter',     Component: FaHammer },
    { key: 'FaSnowflake',       label: 'AC / Cooling',  Component: FaSnowflake },
    { key: 'FaPaintRoller',     label: 'Painter',       Component: FaPaintRoller },
    { key: 'FaCut',             label: 'Salon/Beauty',  Component: FaCut },
    { key: 'FaTree',            label: 'Gardening',     Component: FaTree },
    { key: 'FaCar',             label: 'Car Service',   Component: FaCar },
    { key: 'FaDog',             label: 'Pet Care',      Component: FaDog },
    { key: 'FaHome',            label: 'Home Repair',   Component: FaHome },
    { key: 'FaShower',          label: 'Bathroom',      Component: FaShower },
    { key: 'FaCouch',           label: 'Furniture',     Component: FaCouch },
    { key: 'FaToolbox',         label: 'General Works', Component: FaToolbox },
    { key: 'FaTruck',           label: 'Moving/Packers',Component: FaTruck },
    { key: 'FaFireExtinguisher',label: 'Safety',        Component: FaFireExtinguisher },
    { key: 'FaPlug',            label: 'Appliances',    Component: FaPlug },
    { key: 'FaLeaf',            label: 'Eco Services',  Component: FaLeaf },
    { key: 'FaKey',             label: 'Locksmith',     Component: FaKey },
    { key: 'FaCamera',          label: 'Security/CCTV', Component: FaCamera },
];

const getCategoryIcon = (iconKey, size = 20, color = '#555') => {
    const found = ICON_OPTIONS.find(o => o.key === iconKey);
    if (!found) return <FaWrench size={size} color={color} />;
    const Comp = found.Component;
    return <Comp size={size} color={color} />;
};

// Auto-guess best icon from category name
const ICON_RULES = [
    { keywords: ['clean', 'maid', 'sweep'],                               icon: 'FaBroom' },
    { keywords: ['electric', 'wiring', 'light', 'switch', 'fan'],         icon: 'FaBolt' },
    { keywords: ['plumb', 'pipe', 'tap', 'drain'],                        icon: 'FaWrench' },
    { keywords: ['carpen', 'wood', 'furniture', 'door', 'shelf'],         icon: 'FaHammer' },
    { keywords: ['ac', 'air', 'cool', 'refriger', 'appliance'],           icon: 'FaSnowflake' },
    { keywords: ['paint', 'colour', 'color', 'wall'],                     icon: 'FaPaintRoller' },
    { keywords: ['salon', 'beauty', 'hair', 'spa', 'mehndi', 'mehandi', 'henna', 'cut'], icon: 'FaCut' },
    { keywords: ['garden', 'lawn', 'plant', 'tree', 'grass'],             icon: 'FaTree' },
    { keywords: ['car', 'vehicle', 'auto', 'bike', 'motor'],              icon: 'FaCar' },
    { keywords: ['pet', 'dog', 'cat', 'animal'],                          icon: 'FaDog' },
    { keywords: ['home repair', 'general repair'],                        icon: 'FaHome' },
    { keywords: ['bathroom', 'shower', 'toilet', 'bath'],                 icon: 'FaShower' },
    { keywords: ['sofa', 'couch', 'interior', 'decor'],                   icon: 'FaCouch' },
    { keywords: ['handyman', 'mainten'],                                  icon: 'FaToolbox' },
    { keywords: ['mov', 'packer', 'shift', 'truck', 'transport'],         icon: 'FaTruck' },
    { keywords: ['fire', 'safety', 'extinguish', 'securit'],              icon: 'FaFireExtinguisher' },
    { keywords: ['plug', 'socket'],                                       icon: 'FaPlug' },
    { keywords: ['eco', 'green', 'leaf', 'organic'],                      icon: 'FaLeaf' },
    { keywords: ['lock', 'key'],                                          icon: 'FaKey' },
    { keywords: ['cctv', 'camera', 'surveil'],                            icon: 'FaCamera' },
    { keywords: ['chef', 'cook', 'food', 'kitchen'],                      icon: 'FaToolbox' },
];

const guessIcon = (name) => {
    const lower = name.toLowerCase();
    for (const rule of ICON_RULES) {
        if (rule.keywords.some(kw => lower.includes(kw))) return rule.icon;
    }
    return 'FaWrench';
};

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, activeBookings: 0, grossVolume: 0, revenue: 0 });
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: 'FaWrench' });

    // Payment Filters
    const [paymentProviderSearch, setPaymentProviderSearch] = useState('');
    const [paymentDateFrom, setPaymentDateFrom] = useState('');
    const [paymentDateTo, setPaymentDateTo] = useState('');

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/admin/login');
        } else {
            fetchStats();
            fetchUsers();
            fetchTransactions();
            fetchCategories();
            fetchReviews();
        }
    }, [user, navigate]);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/admin/dashboard', { withCredentials: true });
            setStats(res.data);
        } catch (err) { console.error(err); }
    };
    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/admin/users', { withCredentials: true });
            setUsers(Array.isArray(res.data) ? res.data : (res.data.users || []));
        } catch (err) { console.error(err); }
    };
    const fetchTransactions = async () => {
        try {
            const res = await axios.get('/api/admin/transactions', { withCredentials: true });
            setTransactions(Array.isArray(res.data) ? res.data : (res.data.transactions || []));
        } catch (err) { console.error(err); }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/admin/categories', { withCredentials: true });
            setCategories(Array.isArray(res.data) ? res.data : (res.data.categories || []));
        } catch (err) { console.error(err); }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/categories', newCategory, { withCredentials: true });
            setNewCategory({ name: '', description: '', icon: 'FaWrench' });
            fetchCategories();
        } catch (err) { console.error(err); }
    };

    const handleCategoryNameChange = (e) => {
        const name = e.target.value;
        // Auto-suggest icon based on the name as admin types
        const suggested = guessIcon(name);
        setNewCategory(prev => ({ ...prev, name, icon: suggested }));
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`/api/admin/categories/${id}`, { withCredentials: true });
            fetchCategories();
        } catch (err) { console.error(err); }
    };

    const fetchReviews = async () => {
        try {
            const res = await axios.get('/api/admin/reviews', { withCredentials: true });
            setReviews(Array.isArray(res.data) ? res.data : (res.data.reviews || []));
        } catch (err) { console.error(err); }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await axios.delete(`/api/admin/reviews/${id}`, { withCredentials: true });
            fetchReviews();
        } catch (err) { console.error(err); }
    };

    const toggleVerify = async (id) => {
        try {
            await axios.patch(`/api/admin/verify-user/${id}`, {}, { withCredentials: true });
            fetchUsers();
        } catch (err) { console.error(err); }
    };

    const metrics = [
        { label: 'Total Users', value: stats.totalUsers, icon: <Users size={32} />, bg: 'primary' },
        { label: 'Active Jobs', value: stats.activeBookings, icon: <Briefcase size={32} />, bg: 'success' },
        { label: 'Gross Volume', value: `₹${Number(stats.grossVolume).toLocaleString()}`, icon: <DollarSign size={32} />, bg: 'info' },
        { label: 'Platform Revenue (10%)', value: `₹${Number(stats.revenue).toLocaleString()}`, icon: <TrendingUp size={32} />, bg: 'dark' },
    ];

    const filteredTransactions = transactions.filter(t => {
        let isValid = true;
        if (paymentProviderSearch && !t.provider?.name?.toLowerCase().includes(paymentProviderSearch.toLowerCase())) isValid = false;
        if (paymentDateFrom && new Date(t.createdAt) < new Date(paymentDateFrom)) isValid = false;
        if (paymentDateTo && new Date(t.createdAt) > new Date(new Date(paymentDateTo).setHours(23, 59, 59))) isValid = false;
        return isValid;
    });

    return (
        <Container>
            <h2 className="fw-bold my-4">🛡️ Admin Control Panel</h2>
            <Row className="g-4 mb-4">
                {metrics.map(m => (
                    <Col md={3} sm={6} key={m.label}>
                        <Card className={`bg-${m.bg} text-white text-center shadow border-0 rounded-4`}>
                            <Card.Body className="py-4">
                                <div className="mb-2 opacity-75">{m.icon}</div>
                                <h3 className="fw-bold">{m.value}</h3>
                                <p className="mb-0 small opacity-75">{m.label}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Tabs defaultActiveKey="users" className="mb-4">
                <Tab eventKey="users" title="👥 User / Provider Ledger">
                    <Table responsive hover className="bg-white rounded-4 shadow-sm mt-3">
                        <thead className="table-dark">
                            <tr><th>Name</th><th>Email</th><th>Role</th><th>Category</th><th>ID Proof</th><th>Verified</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td className="align-middle fw-semibold">{u.name}</td>
                                    <td className="align-middle text-muted">{u.email}</td>
                                    <td className="align-middle">
                                        <Badge bg={u.role === 'admin' ? 'danger' : u.role === 'provider' ? 'success' : 'info'}>
                                            {u.role}
                                        </Badge>
                                    </td>
                                    <td className="align-middle">
                                        {u.role === 'provider' ? <Badge bg="light" text="dark" className="border">{u.category || 'N/A'}</Badge> : <span className="text-muted">—</span>}
                                    </td>
                                    <td className="align-middle">
                                        {u.idProof ? <span className="small text-primary d-flex align-items-center gap-1"><FileText size={14} /> {u.idProof}</span> : <span className="text-muted small">N/A</span>}
                                    </td>
                                    <td className="align-middle">
                                        {(u.role === 'provider' ? u.is_verified : u.isVerified)
                                            ? <Badge bg="primary" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}><CheckCircle size={12} /> Verified</Badge>
                                            : <Badge bg="secondary">Unverified</Badge>}
                                    </td>
                                    <td className="align-middle">
                                        {u.role === 'provider' && (
                                            <Button size="sm" variant={u.is_verified ? 'outline-danger' : 'outline-primary'} onClick={() => toggleVerify(u._id)}>
                                                <Shield size={14} className="me-1" />
                                                {u.is_verified ? 'Revoke' : 'Verify'}
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="categories" title="🏷️ Manage Categories">
                    <Card className="border-0 shadow-sm mt-3 rounded-4">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-3">Add New Category</h5>
                            <Form onSubmit={handleAddCategory} className="row g-3 mb-4 align-items-end">
                                <Col md={3}>
                                    <Form.Label className="small fw-semibold text-muted">Category Name</Form.Label>
                                    <Form.Control placeholder="e.g. Electrician" value={newCategory.name} onChange={handleCategoryNameChange} required />
                                </Col>
                                <Col md={3}>
                                    <Form.Label className="small fw-semibold text-muted">Icon</Form.Label>
                                    <Form.Select value={newCategory.icon} onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })}>
                                        {ICON_OPTIONS.map(opt => (
                                            <option key={opt.key} value={opt.key}>{opt.label}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col md={1} className="text-center pb-2">
                                    <div style={{ fontSize: '1.5rem', color: '#555' }}>
                                        {getCategoryIcon(newCategory.icon, 24, '#0d6efd')}
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <Form.Label className="small fw-semibold text-muted">Description</Form.Label>
                                    <Form.Control placeholder="Short description" value={newCategory.description} onChange={e => setNewCategory({ ...newCategory, description: e.target.value })} />
                                </Col>
                                <Col md={2}>
                                    <Button type="submit" variant="primary" className="w-100">
                                        <Plus size={18} className="me-1" /> Add
                                    </Button>
                                </Col>
                            </Form>
                            <Table responsive hover>
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '50px' }}>Icon</th>
                                        <th>Category Name</th>
                                        <th>Description</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(c => (
                                        <tr key={c._id} className="align-middle">
                                            <td>
                                                <div className="d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f0f4ff' }}>
                                                    {getCategoryIcon(c.icon, 18, '#0d6efd')}
                                                </div>
                                            </td>
                                            <td className="fw-bold">{c.name}</td>
                                            <td className="text-muted small">{c.description || '—'}</td>
                                            <td><Button size="sm" variant="outline-danger" onClick={() => handleDeleteCategory(c._id)}><Trash2 size={14} /></Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>
                <Tab eventKey="payments" title="💳 Payment Management">
                    <Card className="border-0 shadow-sm mt-3 rounded-4 mb-3">
                        <Card.Body className="p-3">
                            <Row className="g-3">
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted fw-semibold mb-1">Search by Provider</Form.Label>
                                        <Form.Control type="text" placeholder="Provider name..." value={paymentProviderSearch} onChange={e => setPaymentProviderSearch(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted fw-semibold mb-1">From Date</Form.Label>
                                        <Form.Control type="date" value={paymentDateFrom} onChange={e => setPaymentDateFrom(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted fw-semibold mb-1">To Date</Form.Label>
                                        <Form.Control type="date" value={paymentDateTo} onChange={e => setPaymentDateTo(e.target.value)} />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Table responsive hover className="bg-white rounded-4 shadow-sm">
                        <thead className="table-dark">
                            <tr><th>Date</th><th>Provider</th><th>Customer</th><th>Total Service Amount</th><th>Provider Earnings (90%)</th><th>Admin Commission (10%)</th><th>Status</th><th>Txn ID</th></tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(t => (
                                <tr key={t._id}>
                                    <td className="align-middle small">{new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td className="align-middle fw-semibold text-primary">{t.provider?.name || 'N/A'}</td>
                                    <td className="align-middle">{t.customer?.name || 'N/A'}</td>
                                    <td className="align-middle fw-bold">₹{t.amount}</td>
                                    <td className="align-middle text-success fw-bold">₹{(t.amount * 0.9).toFixed(2)}</td>
                                    <td className="align-middle text-danger fw-bold">₹{(t.amount * 0.1).toFixed(2)}</td>
                                    <td className="align-middle">
                                        <Badge bg={t.paymentStatus === 'paid' ? 'success' : 'warning'}>
                                            {t.paymentStatus}
                                        </Badge>
                                    </td>
                                    <td className="align-middle small text-muted font-monospace">{t.transactionId || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="reviews" title="⭐ Manage Reviews">
                    <Table responsive hover className="bg-white rounded-4 shadow-sm mt-3">
                        <thead className="table-dark">
                            <tr><th>Date</th><th>Provider</th><th>Customer</th><th>Rating</th><th>Comment</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                            {reviews.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-4 text-muted">No reviews found.</td></tr>
                            ) : reviews.map(r => (
                                <tr key={r._id}>
                                    <td className="align-middle small">{new Date(r.createdAt).toLocaleDateString()}</td>
                                    <td className="align-middle fw-bold text-primary">{r.provider?.name || 'N/A'}</td>
                                    <td className="align-middle">{r.customer?.name || 'N/A'}</td>
                                    <td className="align-middle">
                                        <div className="text-warning d-flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < r.rating ? "#ffc107" : "transparent"} color="#ffc107" />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="align-middle text-muted small" style={{ maxWidth: '250px' }}>{r.comment}</td>
                                    <td className="align-middle text-center">
                                        <Button size="sm" variant="outline-danger" onClick={() => handleDeleteReview(r._id)}>
                                            <Trash2 size={14} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default AdminDashboard;
