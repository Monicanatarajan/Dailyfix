import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Search, UserCheck, Calendar, CreditCard, Star, Shield } from 'lucide-react';

const STEPS = [
    { num: '01', Icon: Search,    color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  title: 'Browse Services',      desc: 'Explore 20+ service categories. Use filters to find exactly what you need in your area.' },
    { num: '02', Icon: UserCheck, color: '#10b981', bg: 'rgba(16,185,129,0.1)',  title: 'Choose a Professional', desc: 'View profiles, ratings, and reviews. Pick a verified expert you can trust.' },
    { num: '03', Icon: Calendar,  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  title: 'Book a Slot',          desc: 'Select a date and time that works for you. Instant confirmation, no waiting.' },
    { num: '04', Icon: CreditCard,color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  title: 'Secure Payment',       desc: 'Pay safely online after the job is done. Multiple payment methods supported.' },
];

const FEATURES = [
    { Icon: Shield, color: '#3b82f6', title: 'Background Verified',  desc: 'Every provider passes identity and skill checks.' },
    { Icon: Star,   color: '#f59e0b', title: 'Rated & Reviewed',     desc: 'Real reviews from real customers after every job.' },
    { Icon: CreditCard, color: '#10b981', title: 'Pay After Service', desc: 'Money released only when you are satisfied.' },
];

const S = {
    hero: { background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '72px 0 56px', color: '#fff', textAlign: 'center' },
    badge: { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 20, padding: '6px 16px', fontSize: '0.78rem', color: '#60a5fa', display: 'inline-block', marginBottom: 16 },
};

const HowItWorks = () => (
    <div style={{ background: '#f8fafc' }}>
        <div style={S.hero}>
            <Container>
                <span style={S.badge}>⚡ Simple Process</span>
                <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-1px', marginBottom: 14 }}>
                    Get Help in<br /><span style={{ color: '#60a5fa' }}>4 Easy Steps</span>
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>
                    From browsing to booking — the whole process takes under 2 minutes.
                </p>
            </Container>
        </div>

        {/* Steps */}
        <Container style={{ padding: '72px 12px' }}>
            <Row className="g-4 position-relative">
                {STEPS.map(({ num, Icon, color, bg, title, desc }, i) => (
                    <Col lg={3} md={6} key={num}>
                        <div style={{ background: '#fff', borderRadius: 20, padding: '32px 24px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', height: '100%', position: 'relative', transition: 'transform 0.2s, box-shadow 0.2s' }}
                            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.1)'; }}
                            onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; }}
                        >
                            {/* Step number */}
                            <div style={{ position: 'absolute', top: 20, right: 20, fontSize: '2.5rem', fontWeight: 900, color: 'rgba(0,0,0,0.04)', lineHeight: 1 }}>{num}</div>
                            <div style={{ width: 56, height: 56, borderRadius: 16, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                <Icon size={26} color={color} />
                            </div>
                            <h5 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 10, fontSize: '1rem' }}>{title}</h5>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.75 }}>{desc}</p>
                            {/* Connector dot */}
                            {i < STEPS.length - 1 && (
                                <div className="d-none d-lg-block" style={{ position: 'absolute', top: '50%', right: -12, width: 24, height: 24, borderRadius: '50%', background: color, zIndex: 2, transform: 'translateY(-50%)', boxShadow: `0 0 0 4px rgba(255,255,255,1), 0 0 0 6px ${color}40` }} />
                            )}
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>

        {/* Why trust us */}
        <div style={{ background: '#fff', padding: '64px 0', borderTop: '1px solid #f1f5f9' }}>
            <Container>
                <div className="text-center mb-5">
                    <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: 'clamp(1.4rem,3vw,2rem)' }}>Why Customers Trust Us</h2>
                    <p style={{ color: '#64748b', marginTop: 8 }}>We've built safety and quality into every step.</p>
                </div>
                <Row className="g-4 justify-content-center">
                    {FEATURES.map(({ Icon, color, title, desc }) => (
                        <Col md={4} key={title}>
                            <div style={{ textAlign: 'center', padding: '32px 24px', borderRadius: 16, background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <Icon size={26} color={color} />
                                </div>
                                <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{title}</h6>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>{desc}</p>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', padding: '56px 0', textAlign: 'center' }}>
            <Container>
                <h2 style={{ color: '#f1f5f9', fontWeight: 800, marginBottom: 10 }}>Ready to book your first service?</h2>
                <p style={{ color: '#94a3b8', marginBottom: 28 }}>It takes less than 2 minutes.</p>
                <a href="/search" style={{ background: '#3b82f6', color: '#fff', padding: '13px 32px', borderRadius: 50, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', display: 'inline-block' }}>Get Started</a>
            </Container>
        </div>
    </div>
);

export default HowItWorks;
