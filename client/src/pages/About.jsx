import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Shield, Users, Star, Zap, Award, Heart } from 'lucide-react';

const STATS = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '500+', label: 'Verified Providers' },
    { value: '20+', label: 'Service Categories' },
    { value: '4.8★', label: 'Average Rating' },
];

const VALUES = [
    { Icon: Shield, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', title: 'Trust & Safety', desc: 'Every provider is background-checked and skill-verified before joining our platform.' },
    { Icon: Star,   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  title: 'Quality First', desc: 'We maintain high standards through continuous customer feedback and ratings.' },
    { Icon: Zap,    color: '#10b981', bg: 'rgba(16,185,129,0.1)',  title: 'Fast & Reliable', desc: 'Same-day bookings available. Professionals arrive on time, every time.' },
    { Icon: Heart,  color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   title: 'Customer First', desc: 'Your satisfaction drives everything we do. We are not done until you are happy.' },
    { Icon: Users,  color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  title: 'Community',     desc: 'We empower local professionals to grow their business and reach more customers.' },
    { Icon: Award,  color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',   title: 'Excellence',    desc: 'Award-winning service platform recognized for innovation and customer care.' },
];

const S = {
    hero: { background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', padding: '80px 0 60px', color: '#fff' },
    badge: { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 20, padding: '6px 16px', fontSize: '0.78rem', color: '#60a5fa', display: 'inline-block', marginBottom: 16 },
    statCard: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px 16px', textAlign: 'center' },
    section: { padding: '72px 0' },
    valCard: { background: '#fff', borderRadius: 16, padding: '28px 24px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', height: '100%', transition: 'transform 0.2s, box-shadow 0.2s' },
};

const About = () => (
    <div style={{ background: '#f8fafc' }}>
        {/* Hero */}
        <div style={S.hero}>
            <Container>
                <div className="text-center">
                    <span style={S.badge}>🏠 About Us</span>
                    <h1 style={{ fontWeight: 800, fontSize: 'clamp(2rem,5vw,3rem)', letterSpacing: '-1px', marginBottom: 16 }}>
                        Fixing Homes,<br /><span style={{ color: '#60a5fa' }}>Building Trust</span>
                    </h1>
                    <p style={{ color: '#94a3b8', maxWidth: 560, margin: '0 auto 48px', fontSize: '1.05rem', lineHeight: 1.8 }}>
                        Daily Fix connects homeowners with skilled, verified professionals for every service need — fast, safe, and affordable.
                    </p>
                    <Row className="g-3 justify-content-center">
                        {STATS.map(({ value, label }) => (
                            <Col xs={6} md={3} key={label}>
                                <div style={S.statCard}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9' }}>{value}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>{label}</div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container>
        </div>

        {/* Mission */}
        <Container style={S.section}>
            <Row className="align-items-center g-5">
                <Col lg={5}>
                    <span style={{ ...S.badge, background: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>Our Mission</span>
                    <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#0f172a', marginBottom: 16, letterSpacing: '-0.5px' }}>
                        Making quality home services accessible to everyone
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.9, marginBottom: 24 }}>
                        We started Daily Fix with a simple belief — getting a reliable professional for your home should be as easy as ordering food. No more waiting, no more uncertainty.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.9 }}>
                        Today we serve thousands of households across Tamil Nadu, connecting them with vetted experts in plumbing, electrical, cleaning, and 20+ other categories.
                    </p>
                </Col>
                <Col lg={7}>
                    <Row className="g-3">
                        {VALUES.map(({ Icon, color, bg, title, desc }) => (
                            <Col md={6} key={title}>
                                <div style={S.valCard}
                                    onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
                                    onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; }}
                                >
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                                        <Icon size={20} color={color} />
                                    </div>
                                    <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{title}</h6>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.7 }}>{desc}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', padding: '60px 0' }}>
            <Container className="text-center">
                <h2 style={{ color: '#f1f5f9', fontWeight: 800, marginBottom: 12 }}>Ready to get started?</h2>
                <p style={{ color: '#94a3b8', marginBottom: 32 }}>Join thousands of happy customers who trust Daily Fix.</p>
                <a href="/search" style={{ background: '#3b82f6', color: '#fff', padding: '14px 36px', borderRadius: 50, textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', display: 'inline-block', transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#2563eb'}
                    onMouseOut={e => e.currentTarget.style.background = '#3b82f6'}
                >Find a Service Provider</a>
            </Container>
        </div>
    </div>
);

export default About;
