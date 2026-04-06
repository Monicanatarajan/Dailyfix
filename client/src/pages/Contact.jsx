import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONTACTS = [
    {
        href: 'https://maps.google.com/?q=Tirunelveli,Tamil Nadu,627002',
        Icon: MapPin, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',
        label: 'Our Office',
        value: 'Tirunelveli, Tamil Nadu',
        sub: '627002, India',
        external: true,
    },
    {
        href: 'tel:+919345825908',
        Icon: Phone, color: '#10b981', bg: 'rgba(16,185,129,0.1)',
        label: 'Call Us',
        value: '+91 93458 25908',
        sub: 'Mon–Sat, 9am–7pm',
        external: false,
    },
    {
        href: 'mailto:dailyfixlsd@gmail.com',
        Icon: Mail, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',
        label: 'Email Us',
        value: 'dailyfixlsd@gmail.com',
        sub: 'We reply within 24 hours',
        external: false,
    },
    {
        href: null,
        Icon: Clock, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',
        label: 'Working Hours',
        value: 'Mon – Saturday',
        sub: '9:00 AM – 7:00 PM',
        external: false,
    },
];

const S = {
    hero: { background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '72px 0 56px', color: '#fff', textAlign: 'center' },
    badge: { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 20, padding: '6px 16px', fontSize: '0.78rem', color: '#60a5fa', display: 'inline-block', marginBottom: 16 },
    card: { background: '#fff', borderRadius: 18, padding: '32px 24px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', textDecoration: 'none', display: 'block', color: 'inherit' },
};

const Contact = () => (
    <div style={{ background: '#f8fafc' }}>
        <div style={S.hero}>
            <Container>
                <span style={S.badge}>📬 Get in Touch</span>
                <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-1px', marginBottom: 14 }}>
                    We're Here<br /><span style={{ color: '#60a5fa' }}>To Help You</span>
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: 440, margin: '0 auto', lineHeight: 1.8 }}>
                    Have a question or need support? Reach out through any channel below.
                </p>
            </Container>
        </div>

        <Container style={{ padding: '64px 12px' }}>
            <Row className="g-4 mb-5">
                {CONTACTS.map(({ href, Icon, color, bg, label, value, sub, external }) => {
                    const inner = (
                        <>
                            <div style={{ width: 56, height: 56, borderRadius: 16, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                <Icon size={24} color={color} />
                            </div>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</p>
                            <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4, fontSize: '0.95rem' }}>{value}</h6>
                            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>{sub}</p>
                        </>
                    );
                    return (
                        <Col md={6} lg={3} key={label}>
                            {href ? (
                                <a href={href} target={external ? '_blank' : undefined} rel="noopener noreferrer" style={S.card}
                                    onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }}
                                    onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; }}
                                >{inner}</a>
                            ) : (
                                <div style={S.card}>{inner}</div>
                            )}
                        </Col>
                    );
                })}
            </Row>

            {/* Map embed placeholder + quick links */}
            <Row className="g-4 align-items-stretch">
                <Col lg={8}>
                    <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', height: 320 }}>
                        <iframe
                            title="Daily Fix Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62897.04!2d77.6933!3d8.7139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b041104f3a7b0b5%3A0x1234!2sTirunelveli%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1"
                            width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                        />
                    </div>
                </Col>
                <Col lg={4}>
                    <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0f172a)', borderRadius: 18, padding: '32px 28px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                            <MessageCircle size={22} color="#60a5fa" />
                        </div>
                        <h5 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: 10 }}>Need quick help?</h5>
                        <p style={{ color: '#94a3b8', fontSize: '0.87rem', lineHeight: 1.8, marginBottom: 24 }}>
                            Check our Help Center for instant answers to the most common questions.
                        </p>
                        <Link to="/help" style={{ background: '#3b82f6', color: '#fff', padding: '12px 24px', borderRadius: 50, textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem', textAlign: 'center', display: 'block' }}>
                            Visit Help Center
                        </Link>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
);

export default Contact;
