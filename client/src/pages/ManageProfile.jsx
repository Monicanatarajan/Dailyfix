import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Alert, Image } from 'react-bootstrap';
import axios from 'axios';
import { Camera, Save, MapPin, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/config';

const ManageProfile = () => {
    const { user, login } = useAuth(); // login is our way to update the global user Context
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '', phone: '',
        houseStreet: '', area: '', city: '', state: '', pincode: '',
        category: '', experience: '', hourlyRate: '', bio: '',
        services: []
    });

    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/api/profile', { withCredentials: true });
            const { user: userData, providerDetails } = res.data;
            
            setFormData({
                name: userData.name || '',
                phone: userData.phone || '',
                houseStreet: userData.address?.houseStreet || '',
                area: userData.address?.area || '',
                city: userData.address?.city || '',
                state: userData.address?.state || '',
                pincode: userData.address?.pincode || '',
                // Provider specifics
                category: providerDetails?.category || '',
                experience: providerDetails?.experience || '',
                hourlyRate: providerDetails?.hourlyRate || '',
                bio: providerDetails?.bio || '',
                services: providerDetails?.services || []
            });

            // If it's a relative path from our backend, prefix it
            const imgUrl = userData.profileImage?.startsWith('/uploads') 
                ? `${API_BASE_URL}${userData.profileImage}` 
                : userData.profileImage;
                
            setPreviewImage(imgUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
        } catch (err) {
            setError('Failed to load profile details.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleServiceChange = (index, field, value) => {
        const newServices = [...formData.services];
        newServices[index][field] = value;
        setFormData({ ...formData, services: newServices });
    };

    const addService = () => {
        setFormData({
            ...formData,
            services: [...formData.services, { name: '', price: 0 }]
        });
    };

    const removeService = (index) => {
        const newServices = formData.services.filter((_, i) => i !== index);
        setFormData({ ...formData, services: newServices });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const payload = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'services') {
                    payload.append(key, JSON.stringify(formData[key]));
                } else if (formData[key] !== undefined && formData[key] !== null) {
                    payload.append(key, formData[key]);
                }
            });

            if (profileImage) {
                // Must match the upload.single('profileImage') in backend route
                payload.append('profileImage', profileImage); 
            }

            const res = await axios.put('/api/profile/update', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            setSuccess('Profile updated successfully!');
            
            // Update the global context with the new name/avatar
            if(login) login(res.data.user);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) return <Container className="py-5 text-center">Loading Profile...</Container>;

    return (
        <Container className="py-4 max-w-4xl">
            <h2 className="fw-bold mb-4 d-flex align-items-center">
                <UserIcon className="me-2 text-primary" size={28} /> Manage Profile
            </h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row className="g-4">
                    {/* Left Column: Avatar & Role */}
                    <Col md={4}>
                        <Card className="border-0 shadow-sm text-center p-4 rounded-4 h-100">
                            <div className="position-relative d-inline-block mx-auto mb-3">
                                <Image 
                                    src={previewImage} 
                                    roundedCircle 
                                    style={{ width: '150px', height: '150px', objectFit: 'cover', border: '4px solid #f8f9fa' }} 
                                    className="shadow-sm"
                                />
                                <label 
                                    htmlFor="profile-upload" 
                                    className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle shadow"
                                    style={{ cursor: 'pointer', transform: 'translate(10%, -10%)' }}
                                >
                                    <Camera size={18} />
                                </label>
                                <input 
                                    id="profile-upload" 
                                    type="file" 
                                    accept="image/*" 
                                    className="d-none" 
                                    onChange={handleImageChange} 
                                />
                            </div>
                            <h5 className="fw-bold mb-0">{formData.name}</h5>
                            <p className="text-muted small text-capitalize mb-0 mt-1">{user?.role} Account</p>
                        </Card>
                    </Col>

                    {/* Right Column: Forms */}
                    <Col md={8}>
                        <Card className="border-0 shadow-sm rounded-4 mb-4">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold border-bottom pb-2 mb-3">Basic Information</h5>
                                <Row className="g-3">
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label className="small text-muted fw-semibold">Full Name</Form.Label>
                                            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label className="small text-muted fw-semibold">Phone Number</Form.Label>
                                            <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="border-0 shadow-sm rounded-4 mb-4">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold border-bottom pb-2 mb-3 d-flex align-items-center">
                                    <MapPin size={18} className="me-2 text-danger" /> Address
                                </h5>
                                <Row className="g-3">
                                    <Col sm={12}>
                                        <Form.Group>
                                            <Form.Label className="small text-muted fw-semibold">House / Street</Form.Label>
                                            <Form.Control type="text" name="houseStreet" value={formData.houseStreet} onChange={handleChange} placeholder="e.g. 123 ABC Society" />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label className="small text-muted fw-semibold">Area / Locality</Form.Label>
                                            <Form.Control type="text" name="area" value={formData.area} onChange={handleChange} placeholder="e.g. Indiranagar" />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label className="small text-muted fw-semibold">City</Form.Label>
                                            <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label className="small text-muted fw-semibold">State</Form.Label>
                                            <Form.Control type="text" name="state" value={formData.state} onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label className="small text-muted fw-semibold">Pincode</Form.Label>
                                            <Form.Control type="text" name="pincode" value={formData.pincode} onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Render Service Provider Specific Info */}
                        {user?.role === 'provider' && (
                            <>
                                <Card className="border-0 shadow-sm rounded-4 mb-4 bg-light bg-opacity-50 border-primary border-start border-4">
                                    <Card.Body className="p-4">
                                        <h5 className="fw-bold border-bottom pb-2 mb-3 text-primary">Service Provider Details</h5>
                                        <Row className="g-3">
                                            <Col sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="small text-muted fw-semibold">Service Category</Form.Label>
                                                    <Form.Control type="text" name="category" value={formData.category} onChange={handleChange} />
                                                </Form.Group>
                                            </Col>
                                            <Col sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="small text-muted fw-semibold">Experience (Years)</Form.Label>
                                                    <Form.Control type="number" name="experience" value={formData.experience} onChange={handleChange} min="0" />
                                                </Form.Group>
                                            </Col>
                                            <Col sm={12}>
                                                <Form.Group>
                                                    <Form.Label className="small text-muted fw-semibold">Hourly Rate (₹)</Form.Label>
                                                    <Form.Control type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} min="0" />
                                                </Form.Group>
                                            </Col>
                                            <Col sm={12}>
                                                <Form.Group>
                                                    <Form.Label className="small text-muted fw-semibold">Biography / Description</Form.Label>
                                                    <Form.Control as="textarea" rows={3} name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell customers about your expertise..." />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                <Card className="border-0 shadow-sm rounded-4 mb-4">
                                    <Card.Body className="p-4">
                                        <h5 className="fw-bold border-bottom pb-2 mb-3">Service Listings & Pricing</h5>
                                        <p className="text-muted small mb-3">Add specific services you offer and their fixed prices (e.g. "Sofa Cleaning", "799")</p>
                                        
                                        {formData.services.map((service, index) => (
                                            <Row key={index} className="g-3 mb-3 align-items-end border-bottom pb-3">
                                                <Col sm={5}>
                                                    <Form.Group>
                                                        <Form.Label className="small text-muted fw-semibold">Service Name</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            value={service.name} 
                                                            onChange={(e) => handleServiceChange(index, 'name', e.target.value)} 
                                                            placeholder="e.g. Deep Sofa Cleaning" 
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={4}>
                                                    <Form.Group>
                                                        <Form.Label className="small text-muted fw-semibold">Price (₹)</Form.Label>
                                                        <Form.Control 
                                                            type="number" 
                                                            value={service.price} 
                                                            onChange={(e) => handleServiceChange(index, 'price', e.target.value)} 
                                                            required
                                                            min="1"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={3}>
                                                    <Button variant="outline-danger" size="sm" className="w-100" onClick={() => removeService(index)}>
                                                        Remove
                                                    </Button>
                                                </Col>
                                            </Row>
                                        ))}

                                        <Button variant="outline-primary" className="mt-2" onClick={addService}>
                                            + Add Individual Service
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </>
                        )}

                        <div className="d-flex justify-content-end mb-5">
                            <Button variant="primary" type="submit" size="lg" className="px-5 rounded-pill shadow-sm d-flex align-items-center" disabled={saving}>
                                <Save size={18} className="me-2" /> {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default ManageProfile;
