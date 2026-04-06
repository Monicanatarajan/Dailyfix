import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Wrench, Zap, Home as HomeIcon, Car, Scissors, Bug, Paintbrush, Wind, Tv, ShowerHead, Hammer, Leaf } from 'lucide-react';

const SERVICES = [
    { Icon: Wrench,      color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  title: 'Plumbing',        desc: 'Leaks, pipe repairs, installations and full bathroom plumbing solutions.' },
    { Icon: Zap,         color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  title: 'Electrical',      desc: 'Wiring, switchboards, fan installation and all electrical repairs.' },
    { Icon: HomeIcon,    color: '#10b981', bg: 'rgba(16,185,129,0.1)',  title: 'Cleaning',        desc: 'Deep home cleaning, sofa cleaning, and post-construction cleanup.' },
    { Icon: Car,         color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  title: 'Car Wash',        desc: 'Doorstep car washing, interior detailing and foam wash services.' },
    { Icon: Scissors,    color: '#ec4899', bg: 'rgba(236,72,153,0.1)',  title: 'Salon',           desc: 'Haircut, facial, threading and beauty services at your doorstep.' },
    { Icon: Bug,         color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   title: 'Pest Control',    desc: 'Cockroach, termite, mosquito and rodent control treatments.' },
    { Icon: Paintbrush,  color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',   title: 'Painting',        desc: 'Interior and exterior painting with premium quality finishes.' },
    { Icon: Wind,        color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)',  title: 'AC Service',      desc: 'AC installation, servicing, gas refill and repair for all brands.' },
    { Icon: Tv,          color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  title: 'Appliance Repair',desc: 'TV, washing machine, refrigerator and microwave repair.' },
    { Icon: ShowerHead,  color: '#14b8a6', bg: 'rgba(20,184,166,0.1)',  title: 'Bathroom Repair', desc: 'Tile fixing, waterproofing, shower and sanitary ware installation.' },
    { Icon: Hammer,      color: '#f97316', bg: 'rgba(249,115,22,0.1)',  title: 'Carpentry',       desc: 'Furniture assembly, door repair, and custom woodwork.' },
    { Icon: Leaf,        color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   title: 'Gardening',       desc: 'Lawn mowing, plant care, garden design and maintenance.' },
];

const S = {
    hero: { background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '72px 0 56px', color: '#fff', textAlign: 'center' },
    badge: { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 20, padding: '6px 16px', fontSize: '0.78rem', color: '#60a5fa', display: 'inline-block', marginBottom: 16 },
    card: { background: '#fff', borderRadius: 16, padding: '28px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' },
};

const Services = () => (
    <div style={{ background: '#f8fafc' }}>
        <div style={S.hero}>
            <Container>
                <span style={S.badge}>🛠️ What We Offer</span>
                <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-1px', marginBottom: 14 }}>
                    All Your Home Services,<br /><span style={{ color: '#60a5fa' }}>One Platform</span>
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: 520, margin: '0 auto', fontSize: '1rem', lineHeight: 1.8 }}>
                    From plumbing to painting — browse 20+ professional services and book in minutes.
                </p>
            </Container>
        </div>

        <Container style={{ padding: '64px 12px' }}>
            <Row className="g-4">
                {SERVICES.map(({ Icon, color, bg, title, desc }) => (
                    <Col lg={3} md={4} sm={6} key={title}>
                        <div style={S.card}
                            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }}
                            onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; }}
                        >
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                <Icon size={24} color={color} />
                            </div>
                            <h6 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 8, fontSize: '0.95rem' }}>{title}</h6>
                            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.7 }}>{desc}</p>
                            <div style={{ marginTop: 16 }}>
                                <a href="/search" style={{ fontSize: '0.8rem', color: color, textDecoration: 'none', fontWeight: 600 }}>Book Now →</a>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>

        <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', padding: '56px 0', textAlign: 'center' }}>
            <Container>
                <h2 style={{ color: '#f1f5f9', fontWeight: 800, marginBottom: 10 }}>Don't see your service?</h2>
                <p style={{ color: '#94a3b8', marginBottom: 28 }}>Contact us and we'll connect you with the right professional.</p>
                <a href="/contact" style={{ background: '#3b82f6', color: '#fff', padding: '13px 32px', borderRadius: 50, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', display: 'inline-block' }}>Contact Us</a>
            </Container>
        </div>
    </div>
);

export default Services;
