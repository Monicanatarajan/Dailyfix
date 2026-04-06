import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Users, Clock, CreditCard, Headphones, TrendingUp, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PERKS = [
    { Icon: Users,      color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  title: 'Steady Clientele',     desc: 'Get matched with local customers who need exactly your skills — no cold calling.' },
    { Icon: Clock,      color: '#10b981', bg: 'rgba(16,185,129,0.1)',  title: 'Flexible Hours',       desc: 'Work only when you want. Accept or decline jobs on your own schedule.' },
    { Icon: CreditCard, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  title: 'Guaranteed Payments',  desc: 'Payments are processed securely. You get paid within 24 hours of job completion.' },
    { Icon: Headphones, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  title: '24/7 Support',         desc: 'Our dedicated team is always available to help you resolve any issue fast.' },
    { Icon: TrendingUp, color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   title: 'Grow Your Business',   desc: 'Build your reputation with reviews and ratings. Top providers get priority listings.' },
    { Icon: MapPin,     color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',   title: 'Work Locally',         desc: 'Serve customers in your own neighbourhood. No long commutes.' },
];

const STEPS = [
    { num: '1', title: 'Register',       desc: 'Create your provider account in minutes.' },
    { num: '2', title: 'Get Verified',   desc: 'Our team reviews your profile and skills.' },
    { num: '3', title: 'Start Earning',  desc: 'Accept bookings and grow your income.' },
];

const S = {
    hero: { background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '80px 0 64px', color: '#fff', textAlign: 'center' },
    badge: { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 20, padding: '6px 16px', fontSize: '0.78rem', color: '#60a5fa', display: 'inline-block', marginBottom: 16 },
    card: { background: '#fff', borderRadius: 16, padding: '28px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', height: '100%', transition: 'transform 0.2s, box-shadow 0.2s' },
};

const Careers = () => (
    <div style={{ background: '#f8fafc' }}>
        <div style={S.hero}>
            <Container>
                <span style={S.badge}>💼 Join Our Team</span>
                <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-1px', marginBottom: 14 }}>
                    Turn Your Skills Into<br /><span style={{ color: '#60a5fa' }}>A Thriving Business</span>
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.8 }}>
                    Join 500+ professionals already earning more with Daily Fix. Set your own hours, build your reputation, and grow your income.
                </p>
                <Link to="/register" style={{ background: '#3b82f6', color: '#fff', padding: '14px 36px', borderRadius: 50, textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    Register as a Provider <ArrowRight size={16} />
                </Link>
            </Container>
        </div>

        {/* Perks */}
        <Container style={{ padding: '72px 12px' }}>
            <div className="text-center mb-5">
                <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: 'clamp(1.4rem,3vw,2rem)' }}>Why Partner With Us?</h2>
                <p style={{ color: '#64748b', marginTop: 8 }}>Everything you need to succeed as an independent professional.</p>
            </div>
            <Row className="g-4">
                {PERKS.map(({ Icon, color, bg, title, desc }) => (
                    <Col lg={4} md={6} key={title}>
                        <div style={S.card}
                            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }}
                            onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; }}
                        >
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                <Icon size={22} color={color} />
                            </div>
                            <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{title}</h6>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.75 }}>{desc}</p>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>

        {/* How to join */}
        <div style={{ background: '#fff', padding: '64px 0', borderTop: '1px solid #f1f5f9' }}>
            <Container>
                <div className="text-center mb-5">
                    <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: 'clamp(1.4rem,3vw,2rem)' }}>How to Get Started</h2>
                </div>
                <Row className="g-4 justify-content-center">
                    {STEPS.map(({ num, title, desc }) => (
                        <Col md={4} key={num} className="text-center">
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#fff', fontWeight: 800, fontSize: '1.3rem' }}>{num}</div>
                            <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{title}</h6>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>{desc}</p>
                        </Col>
                    ))}
                </Row>
                <div className="text-center mt-5">
                    <Link to="/register" style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', padding: '14px 40px', borderRadius: 50, textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(59,130,246,0.3)' }}>
                        Join Now — It's Free <ArrowRight size={16} />
                    </Link>
                </div>
            </Container>
        </div>
    </div>
);

export default Careers;
