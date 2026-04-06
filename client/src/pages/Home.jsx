import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { 
    ShieldCheck, 
    MapPin, 
    CalendarCheck, 
    Star, 
    Search, 
    ChevronRight,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Phone,
    Mail
} from 'lucide-react';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({ totalUsers: '1000+', activeBookings: '50+', happyCustomers: '10k+' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/public/stats');
            setStats(res.data);
        } catch (err) { console.error('Failed to fetch stats', err); }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    const categories = [
        { name: 'Plumbing', image: '/assets/plumbing.png', count: '120+ Pros' },
        { name: 'Electrical', image: '/assets/electrical.png', count: '85+ Pros' },
        { name: 'Cleaning', image: '/assets/cleaning.png', count: '200+ Pros' },
        { name: 'Mehndi', image: '/assets/mehndi.png', count: '50+ Pros' }
    ];

    return (
        <div className="homepage-wrapper">
            {/* Hero Section */}
            <div className="jumbotron-custom mx-3 mx-md-5 mb-5 text-center">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="display-3 fw-bolder mb-3">Your Home, Perfected</h1>
                    <p className="lead mb-4 opacity-90 mx-auto" style={{ maxWidth: '700px' }}>
                        Connect with verified experts for all your home needs. 
                        Reliable, affordable, and just a click away.
                    </p>
                    
                    <Form onSubmit={handleSearch} className="glass-search-container">
                        <Search className="ms-3 text-white-50" size={24} />
                        <Form.Control
                            type="text"
                            placeholder="What service do you need today?"
                            className="glass-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button type="submit" variant="warning" className="rounded-pill px-4 me-2 fw-bold">
                            Search
                        </Button>
                    </Form>
                    
                    <div className="mt-4 d-flex justify-content-center gap-3">
                        <span className="badge bg-white bg-opacity-25 rounded-pill px-3 py-2">Popular: Plumbing, Cleaning, Mehndi</span>
                    </div>
                </div>
                <img 
                    src="/assets/hero_bg.png" 
                    alt="Hero Background" 
                    className="position-absolute top-0 start-0 w-100 h-100" 
                    style={{ objectFit: 'cover', zIndex: 0 }}
                />
            </div>

            <Container className="py-5">
                {/* Featured Categories */}
                <div className="text-center mb-5">
                    <h2 className="section-title">Explore Services</h2>
                    <p className="text-muted">Choose from our wide range of professional services</p>
                </div>
                
                <Row className="g-4 mb-5">
                    {categories.map((cat, idx) => (
                        <Col key={idx} lg={3} md={6}>
                            <Card className="category-card" onClick={() => navigate(`/search?category=${cat.name}`)}>
                                <img src={cat.image} alt={cat.name} />
                                <div className="category-overlay">
                                    <h4 className="fw-bold mb-1">{cat.name}</h4>
                                    <p className="small mb-0 opacity-75">{cat.count}</p>
                                    <div className="mt-2 text-warning small fw-bold">
                                        View All <ChevronRight size={14} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Platform Stats - "Admin side home" feel */}
                <div className="bg-dark text-white rounded-5 p-5 my-5 shadow-lg border border-secondary">
                    <Row className="text-center g-4">
                        <Col md={4}>
                            <h2 className="display-4 fw-bold text-warning mb-0">{stats.totalUsers}</h2>
                            <p className="text-white-50 mt-2">Verified Users</p>
                        </Col>
                        <Col md={4}>
                            <h2 className="display-4 fw-bold text-info mb-0">{stats.activeBookings}</h2>
                            <p className="text-white-50 mt-2">Ongoing Projects</p>
                        </Col>
                        <Col md={4}>
                            <h2 className="display-4 fw-bold text-success mb-0">{stats.happyCustomers}</h2>
                            <p className="text-white-50 mt-2">Happy Customers</p>
                        </Col>
                    </Row>
                </div>

                {/* How it Works */}
                <div className="bg-light rounded-5 p-5 my-5">
                    <div className="text-center mb-5">
                        <h2 className="section-title">How It Works</h2>
                    </div>
                    <Row className="g-4">
                        <Col md={4}>
                            <div className="step-card h-100">
                                <div className="step-number">1</div>
                                <h4>Find a Pro</h4>
                                <p className="text-muted">Search for the service you need and browse through verified profiles.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="step-card h-100 text-center">
                                <div className="step-number">2</div>
                                <h4>Book & Schedule</h4>
                                <p className="text-muted">Choose a time slot that works best for you and book instantly.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="step-card h-100">
                                <div className="step-number">3</div>
                                <h4>Relax</h4>
                                <p className="text-muted">Our expert arrives at your doorstep and gets the job done perfectly.</p>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Why Choose Us */}
                <Row className="align-items-center py-5">
                    <Col lg={6}>
                        <h2 className="section-title text-start mb-4">Why Daily Fix?</h2>
                        <ul className="list-unstyled">
                            <li className="d-flex mb-4">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-4">
                                    <ShieldCheck className="text-primary" size={32} />
                                </div>
                                <div>
                                    <h5 className="fw-bold">Verified Professionals</h5>
                                    <p className="text-muted">Every provider undergoes a rigorous background check and skill verification.</p>
                                </div>
                            </li>
                            <li className="d-flex mb-4">
                                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-4">
                                    <Star className="text-success" size={32} />
                                </div>
                                <div>
                                    <h5 className="fw-bold">Quality Guaranteed</h5>
                                    <p className="text-muted">We take pride in our work. If you're not satisfied, we'll make it right.</p>
                                </div>
                            </li>
                            <li className="d-flex mb-4">
                                <div className="bg-info bg-opacity-10 p-3 rounded-circle me-4">
                                    <CalendarCheck className="text-info" size={32} />
                                </div>
                                <div>
                                    <h5 className="fw-bold">No Hidden Costs</h5>
                                    <p className="text-muted">Clear upfront pricing with no surprises. You pay what we quote.</p>
                                </div>
                            </li>
                        </ul>
                    </Col>
                    <Col lg={6} className="text-center">
                        <div className="position-relative">
                            <img 
                                src="/assets/hero_bg.png" 
                                alt="Why Us" 
                                className="img-fluid rounded-5 shadow-lg" 
                                style={{ maxHeight: '450px', objectFit: 'cover' }}
                            />
                            <div className="position-absolute bottom-0 end-0 bg-white p-4 rounded-4 shadow-sm m-4 text-start">
                                <h3 className="fw-bold text-primary mb-0">10k+</h3>
                                <p className="text-muted mb-0">Happy Customers</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <footer className="footer-main">
                <Container>
                    <Row className="g-4">
                        <Col lg={4} md={6}>
                            <h3 className="text-white fw-bold mb-4">Daily Fix</h3>
                            <p className="mb-4">
                                Your trusted partner for all home services. 
                                We bring professional expertise right to your doorstep.
                            </p>
                            <div className="d-flex gap-3">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white bg-opacity-10 p-2 rounded-circle text-white"><Facebook size={20} /></a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-white bg-opacity-10 p-2 rounded-circle text-white"><Twitter size={20} /></a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white bg-opacity-10 p-2 rounded-circle text-white"><Instagram size={20} /></a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-white bg-opacity-10 p-2 rounded-circle text-white"><Linkedin size={20} /></a>
                            </div>
                        </Col>
                        <Col lg={2} md={6}>
                            <h5 className="text-white fw-bold mb-4">Company</h5>
                            <Link to="/about" className="footer-link">About Us</Link>
                            <Link to="/services" className="footer-link">Services</Link>
                            <Link to="/how-it-works" className="footer-link">How it Works</Link>
                            <Link to="/careers" className="footer-link">Careers</Link>
                        </Col>
                        <Col lg={2} md={6}>
                            <h5 className="text-white fw-bold mb-4">Support</h5>
                            <Link to="/help" className="footer-link">Help Center</Link>
                            <Link to="/contact" className="footer-link">Contact Us</Link>
                            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                            <Link to="/terms" className="footer-link">Terms of Service</Link>
                        </Col>
                        <Col lg={4} md={6}>
                            <h5 className="text-white fw-bold mb-4">Contact</h5>
                            <div className="d-flex mb-3">
                                <a href="https://maps.google.com/?q=Tirunelveli, Tamil Nadu, 627002" target="_blank" rel="noopener noreferrer" className="text-decoration-none d-flex align-items-center" style={{ color: '#94a3b8' }}>
                                    <MapPin className="me-3 text-warning" size={20} />
                                    <span>Tirunelveli, Tamil Nadu, 627002</span>
                                </a>
                            </div>
                            <div className="d-flex mb-3">
                                <a href="tel:+919345825908" 
                                   className="text-decoration-none d-flex align-items-center footer-hover-link" 
                                   style={{ color: '#94a3b8', transition: 'color 0.3s' }}
                                   onMouseOver={(e) => { e.currentTarget.style.color = '#fff' }}
                                   onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8' }}>
                                    <Phone className="me-3 text-warning" size={20} />
                                    <span>+91 93458 25908</span>
                                </a>
                            </div>
                            <div className="d-flex">
                                <a href="mailto:dailyfixlsd@gmail.com" className="d-flex align-items-center text-white text-decoration-none">
                                    <Mail className="me-3 text-warning" size={20} />
                                    <span>dailyfixlsd@gmail.com</span>
                                </a>
                            </div>
                        </Col>
                    </Row>
                    <hr className="my-5 border-secondary" />
                    <div className="text-center">
                        <small>© 2026 Daily Fix Services. All rights reserved.</small>
                    </div>
                </Container>
            </footer>
        </div>
    );
};

export default Home;

