import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, Star, Trash2 } from 'lucide-react';

const Favorites = () => {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFavourites();
    }, []);

    const fetchFavourites = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/user/favourites', { withCredentials: true });
            setFavourites(res.data);
        } catch (err) { console.error("Error fetching favourites:", err); }
        finally { setLoading(false); }
    };

    const removeFavourite = async (providerId) => {
        try {
            await axios.post(`/api/user/favourites/${providerId}`, {}, { withCredentials: true });
            setFavourites(prev => prev.filter(f => f._id !== providerId));
        } catch (err) {
            alert("Failed to remove from favourites");
        }
    };

    return (
        <Container className="py-4">
            <div className="d-flex align-items-center gap-2 mb-4">
                <Heart className="text-danger" fill="#dc3545" size={28} />
                <h2 className="fw-bold mb-0">My Favorites</h2>
            </div>
            
            {loading ? (
                <div className="text-center py-5 text-muted">Loading favorites...</div>
            ) : favourites.length === 0 ? (
                <div className="bg-light p-5 rounded-4 text-center text-muted border border-dashed">
                    <Heart size={48} className="mb-3 text-secondary opacity-50" />
                    <h4>No favorite providers yet</h4>
                    <p className="mb-4">Explore services and add your favorite providers here!</p>
                    <Button as={Link} to="/search" variant="primary" className="rounded-pill px-4 py-2">Find Services</Button>
                </div>
            ) : (
                <Row className="g-4">
                    {favourites.map(fav => (
                        <Col xs={12} md={6} lg={4} key={fav._id}>
                            <Card className="border-0 shadow-sm rounded-4 h-100 provider-fav-card" style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
                                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                            >
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-start gap-3 mb-3">
                                        <img
                                            src={fav.profileImage?.startsWith('/uploads') ? `http://localhost:5001${fav.profileImage}` : (fav.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')}
                                            alt={fav.name}
                                            className="rounded-circle object-fit-cover shadow-sm border"
                                            style={{ width: '70px', height: '70px' }}
                                        />
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="fw-bold mb-1 text-truncate">{fav.name}</h5>
                                            <div className="text-muted small mb-2">{fav.category}</div>
                                            <div className="d-flex align-items-center text-warning small mb-1">
                                                <Star size={14} style={{ fill: '#ffc107' }} className="me-1" />
                                                <span className="text-dark fw-bold me-2">{fav.rating?.toFixed(1) || '0.0'}</span>
                                                <span className="text-dark fw-semibold bg-light px-2 py-1 rounded small">₹{fav.hourlyRate}/hr</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2 mt-3">
                                        <Button as={Link} to={`/providers/${fav.profileId || fav._id}`} variant="primary" className="flex-grow-1 fw-bold rounded-pill">
                                            Book Now
                                        </Button>
                                        <Button 
                                            variant="outline-danger" 
                                            className="rounded-pill px-3" 
                                            onClick={() => removeFavourite(fav._id)}
                                            title="Remove from Favorites"
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default Favorites;
