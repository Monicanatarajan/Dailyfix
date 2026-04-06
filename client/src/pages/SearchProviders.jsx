import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge, Spinner, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Star, UserCheck, Search, MessageCircle, Heart } from 'lucide-react';
import ChatModal from '../components/ChatModal';
import {
    FaBroom, FaBolt, FaWrench, FaHammer, FaSnowflake, FaPaintRoller,
    FaCut, FaTree, FaCar, FaDog, FaHome, FaShower, FaCouch, FaToolbox,
    FaTruck, FaFireExtinguisher, FaPlug, FaLeaf, FaKey, FaCamera
} from 'react-icons/fa';

const ICON_MAP = {
    FaBroom, FaBolt, FaWrench, FaHammer, FaSnowflake, FaPaintRoller,
    FaCut, FaTree, FaCar, FaDog, FaHome, FaShower, FaCouch, FaToolbox,
    FaTruck, FaFireExtinguisher, FaPlug, FaLeaf, FaKey, FaCamera
};

const ICON_COLORS = ['#007bff','#ffc107','#17a2b8','#fd7e14','#6c757d','#6f42c1','#e83e8c','#28a745','#dc3545','#20c997'];
const ICON_BGS   = ['#e7f1ff','#fff8e1','#e0f7fa','#ffe8cc','#f8f9fa','#f3e5f5','#fce4ec','#d4edda','#fdecea','#d6f5ef'];

const getCategoryIcon = (iconKey, size = 20, color = '#555') => {
    const Comp = ICON_MAP[iconKey] || FaWrench;
    return <Comp size={size} color={color} />;
};

const SearchProviders = () => {
    const navigate = useNavigate();
    const [categories, setCategories]       = useState([]);
    const [allProviders, setAllProviders]   = useState([]);  // raw API result
    const [providers, setProviders]         = useState([]);  // filtered display list
    const [category, setCategory]           = useState('');
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const [loading, setLoading]             = useState(false);
    const [location, setLocation]           = useState(null);
    const [searched, setSearched]           = useState(false); // tracks if user has searched
    const [userFavourites, setUserFavourites] = useState([]);
    const [showChat, setShowChat]           = useState(false);
    const [chatProvider, setChatProvider]   = useState(null);
    const [expandedReviews, setExpandedReviews] = useState({});
    const [loadingReviews, setLoadingReviews]   = useState({});

    // ── filter helper: case-insensitive, both-way partial match ─────────────
    const applyFilter = useCallback((source, cat) => {
        if (!cat || cat === 'All Services') {
            setProviders(source);
            return;
        }
        const needle = cat.toLowerCase().trim();
        setProviders(
            source.filter(p => {
                const hay = (p.category || '').toLowerCase().trim();
                if (!hay) return false;
                // exact or partial match either direction
                return hay === needle || hay.includes(needle) || needle.includes(hay);
            })
        );
    }, []);

    // ── fetch from API then filter ────────────────────────────────────────────
    const fetchAndStore = useCallback(async (loc, cat) => {
        if (!loc) return;
        setLoading(true);
        try {
            const res = await axios.get('/api/booking/search', {
                params: { lat: loc.lat, lng: loc.lng, radius: 500 }
            });
            setAllProviders(res.data);
            applyFilter(res.data, cat);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    }, [applyFilter]);

    // ── on mount: only get location + categories, do NOT fetch providers ─────
    useEffect(() => {
        axios.get('/api/admin/categories', { withCredentials: true })
            .then(r => setCategories(r.data)).catch(console.error);

        axios.get('/api/user/me', { withCredentials: true })
            .then(r => { if (r.data?.favourites) setUserFavourites(r.data.favourites); })
            .catch(console.error);

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => setLocation({ lat: 8.7139, lng: 77.6933 })
            );
        } else {
            setLocation({ lat: 8.7139, lng: 77.6933 });
        }
    }, [fetchAndStore]);

    // ── Search button ─────────────────────────────────────────────────────────
    const handleSearch = () => {
        if (!category) {
            alert('Please select a category first.');
            return;
        }
        setSearched(true);
        fetchAndStore(location, category);
    };

    // ── Category click: select only, search on button click ──────────────────
    const handleCategoryClick = (catName) => {
        setCategory(catName);
        // reset results so user must click Search again for new category
        setProviders([]);
        setAllProviders([]);
        setSearched(false);
    };

    const toggleFavourite = async (providerId) => {
        try {
            const res = await axios.post(`/api/user/favourites/${providerId}`, {}, { withCredentials: true });
            setUserFavourites(res.data.favourites);
        } catch (err) { console.error(err); }
    };

    const openChat = (provider) => { setChatProvider(provider.user); setShowChat(true); };

    const toggleReviews = async (providerUserId) => {
        if (expandedReviews[providerUserId]) {
            const next = { ...expandedReviews };
            delete next[providerUserId];
            setExpandedReviews(next);
        } else {
            setLoadingReviews(prev => ({ ...prev, [providerUserId]: true }));
            try {
                const res = await axios.get(`/api/reviews/${providerUserId}`);
                setExpandedReviews(prev => ({ ...prev, [providerUserId]: res.data }));
            } catch (err) { console.error(err); }
            finally { setLoadingReviews(prev => ({ ...prev, [providerUserId]: false })); }
        }
    };

    const avgRating = () => {
        if (!providers.length) return 0;
        return (providers.reduce((a, p) => a + (p.rating || 0), 0) / providers.length).toFixed(1);
    };

    // ── render ────────────────────────────────────────────────────────────────
    return (
        <Container>
            <h2 className="mb-1 fw-bold">🔍 Find Service Providers</h2>
            <p className="text-muted mb-4">Powered by your live location and MongoDB geospatial search.</p>

            {/* Categories */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Categories</h5>
                    <Button variant="link" className="text-decoration-none p-0 text-primary small"
                        onClick={() => { setCategory(''); setCategorySearchTerm(''); applyFilter(allProviders, ''); }}>
                        Clear Selection
                    </Button>
                </div>

                <div className="mb-3">
                    <InputGroup className="shadow-sm rounded-pill overflow-hidden border bg-white">
                        <InputGroup.Text className="bg-white border-0 ps-4 pe-2 text-muted">
                            <Search size={18} />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search categories..."
                            value={categorySearchTerm}
                            onChange={e => setCategorySearchTerm(e.target.value)}
                            className="border-0 shadow-none py-2 pe-4"
                            style={{ backgroundColor: 'transparent' }}
                        />
                    </InputGroup>
                </div>

                <Row className="g-3">
                    {categories
                        .filter(cat => cat.name.toLowerCase().includes(categorySearchTerm.toLowerCase()))
                        .map((cat, idx) => {
                            const isSelected  = category === cat.name;
                            const colorIndex  = idx % ICON_COLORS.length;
                            const iconColor   = isSelected ? '#007bff' : ICON_COLORS[colorIndex];
                            const bgColor     = ICON_BGS[colorIndex];
                            return (
                                <Col xs={6} md={3} key={cat._id || idx}>
                                    <div
                                        onClick={() => handleCategoryClick(cat.name)}
                                        className="d-flex flex-column align-items-center justify-content-center p-3 text-center bg-white"
                                        style={{
                                            cursor: 'pointer', borderRadius: '16px',
                                            border: isSelected ? '2px solid #007bff' : '2px solid transparent',
                                            boxShadow: isSelected ? '0 4px 12px rgba(0,123,255,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                                            transition: 'all 0.2s ease-in-out',
                                            transform: isSelected ? 'translateY(-2px)' : 'none'
                                        }}
                                        onMouseOver={e => { if (!isSelected) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; } }}
                                        onMouseOut={e =>  { if (!isSelected) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; } }}
                                    >
                                        <div className="d-flex align-items-center justify-content-center mb-2"
                                            style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: bgColor }}>
                                            {getCategoryIcon(cat.icon || 'FaWrench', 22, iconColor)}
                                        </div>
                                        <span className="fw-semibold small text-dark" style={{ fontSize: '0.85rem' }}>{cat.name}</span>
                                    </div>
                                </Col>
                            );
                        })}
                </Row>
            </div>

            {/* Search button */}
            <div className="mb-4">
                <Button variant="primary" className="w-100 py-2 fw-semibold rounded-4" onClick={handleSearch} disabled={loading || !location}>
                    {loading ? <Spinner animation="border" size="sm" /> : <><Search size={16} className="me-1" /> Search Providers</>}
                </Button>
            </div>

            {/* Results header — only show after search */}
            {searched && (
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">
                    {loading ? 'Searching...' : `${providers.length} ${providers.length === 1 ? 'Provider' : 'Providers'} Available`}
                    {category && !loading && <span className="text-primary fs-6 fw-normal ms-2">in "{category}"</span>}
                </h4>
                {providers.length > 0 && (
                    <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-pill shadow-sm border">
                        <span className="text-muted small fw-medium">Avg. Rating:</span>
                        <div className="d-flex align-items-center text-warning fw-bold">
                            <Star size={16} fill="#ffc107" className="me-1" />
                            <span className="text-dark">{avgRating()}</span>
                        </div>
                    </div>
                )}
            </div>
            )}

            {/* Provider cards */}
            <Row className="g-4">
                {loading && (
                    <Col xs={12} className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted">Finding providers near you...</p>
                    </Col>
                )}
                {!loading && providers.length === 0 && (
                    <Col xs={12} className="text-center py-5 text-muted">
                        {!searched ? (
                            <>
                                <Search size={48} className="mb-3 opacity-25" />
                                <p className="fw-semibold">Select a category and click Search to find providers.</p>
                            </>
                        ) : (
                            <>
                                <Search size={48} className="mb-3 opacity-25" />
                                <p>No providers found for "{category}". Try a different category.</p>
                            </>
                        )}
                    </Col>
                )}
                {!loading && providers.map(p => {
                    const isFavourite = userFavourites.includes(p.user?._id);
                    return (
                        <Col lg={6} key={p._id}>
                            <Card className="h-100 border-0 shadow-sm rounded-4"
                                style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
                                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                                onMouseOut={e =>  { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                            >
                                <Card.Body className="p-4">
                                    <Row className="align-items-center">
                                        <Col xs={3} sm={2} className="text-center pe-0">
                                            <img
                                                src={p.user?.profileImage?.startsWith('/uploads')
                                                    ? `http://localhost:5001${p.user.profileImage}`
                                                    : (p.user?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')}
                                                alt={p.user?.name}
                                                className="img-fluid rounded-circle object-fit-cover shadow-sm border border-2 border-white"
                                                style={{ width: '80px', height: '80px' }}
                                            />
                                        </Col>
                                        <Col xs={9} sm={7} className="ps-3 ps-sm-4">
                                            <div className="d-flex align-items-center mb-1">
                                                <h5 className="fw-bold mb-0 me-2 text-truncate">{p.user?.name}</h5>
                                                {p.user?.isVerified && (
                                                    <Badge bg="primary" className="d-flex align-items-center gap-1 rounded-pill" style={{ fontSize: '0.65rem' }}>
                                                        <UserCheck size={10} /> Verified
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-secondary small fw-medium mb-2">{p.category}</div>
                                            <div className="d-flex align-items-center text-warning mb-1 small">
                                                <Star size={14} className="me-1" style={{ fill: '#ffc107' }} />
                                                <span className="text-dark fw-bold me-1">{Number(p.rating).toFixed(1)}</span>
                                                <span className="text-muted">({p.reviewCount} reviews)</span>
                                                {p.experience > 0 && (
                                                    <Badge bg="light" text="dark" className="ms-2 border fw-normal">{p.experience} yrs exp</Badge>
                                                )}
                                            </div>
                                            {p.bio && (
                                                <p className="text-muted small mb-2 text-truncate" style={{ maxWidth: '300px' }}>{p.bio}</p>
                                            )}
                                            <div className="d-flex flex-wrap align-items-center text-muted small">
                                                <div className="d-flex align-items-center me-3 mb-1">
                                                    <span className="fw-bold text-dark me-1">₹{p.hourlyRate}</span>/hr
                                                </div>
                                                {p.distance !== undefined && (
                                                    <div className="d-flex align-items-center mb-1">
                                                        <MapPin size={13} className="text-danger me-1" />
                                                        <span>{(p.distance / 1000).toFixed(1)} km away</span>
                                                        {p.user?.address?.city && (
                                                            <span className="ms-2 text-muted">
                                                                • {p.user.address.area ? `${p.user.address.area}, ` : ''}{p.user.address.city}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </Col>
                                        <Col xs={12} sm={3} className="mt-3 mt-sm-0 d-flex flex-sm-column justify-content-end justify-content-sm-center align-items-end gap-2 h-100 ps-sm-3">
                                            <div className="d-flex gap-2 mb-sm-2">
                                                <Button variant="light" className="rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center bg-white border"
                                                    style={{ width: '40px', height: '40px' }}
                                                    onClick={() => toggleFavourite(p.user?._id)}
                                                    title={isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}>
                                                    <Heart size={18} fill={isFavourite ? '#dc3545' : 'transparent'} color={isFavourite ? '#dc3545' : '#6c757d'} />
                                                </Button>
                                                <Button variant="primary" className="rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center"
                                                    style={{ width: '40px', height: '40px' }}
                                                    onClick={() => openChat(p)} title="Chat with Provider">
                                                    <MessageCircle size={18} />
                                                </Button>
                                            </div>
                                            <Button variant="outline-dark" size="sm" className="w-100 fw-medium rounded-pill shadow-sm mb-2"
                                                onClick={() => navigate(`/providers/${p._id}`, { state: p })}>
                                                View Profile
                                            </Button>
                                            <Button variant="link" className="text-primary p-0 small text-decoration-none w-100 text-center"
                                                onClick={() => toggleReviews(p.user?._id)}>
                                                {expandedReviews[p.user?._id] ? 'Hide Reviews' : 'Show Reviews'}
                                            </Button>
                                        </Col>
                                    </Row>

                                    {loadingReviews[p.user?._id] && (
                                        <div className="mt-3 text-center border-top pt-3">
                                            <Spinner animation="border" size="sm" variant="primary" />
                                        </div>
                                    )}
                                    {expandedReviews[p.user?._id] && (
                                        <div className="mt-4 border-top pt-4">
                                            <h6 className="fw-bold mb-3 d-flex align-items-center">
                                                <Star size={16} className="me-2 text-warning" fill="#ffc107" /> Customer Feedback
                                            </h6>
                                            {expandedReviews[p.user?._id].length === 0 ? (
                                                <p className="text-muted small mb-0">No reviews yet.</p>
                                            ) : (
                                                <div className="d-flex flex-column gap-3">
                                                    {expandedReviews[p.user?._id].map(rev => (
                                                        <div key={rev._id} className="bg-light p-3 rounded-3 border-start border-primary border-4">
                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                <span className="fw-bold small">{rev.customer?.name}</span>
                                                                <div className="d-flex text-warning">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star key={i} size={12} fill={i < rev.rating ? '#ffc107' : 'transparent'} color="#ffc107" />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <p className="small text-dark mb-1">{rev.comment}</p>
                                                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                                {new Date(rev.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            <ChatModal show={showChat} handleClose={() => setShowChat(false)} provider={chatProvider} />
        </Container>
    );
};

export default SearchProviders;
