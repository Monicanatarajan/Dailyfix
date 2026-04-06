import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Wrench, Shield, Clock, Star } from 'lucide-react';

const SOCIAL = [
    { href: 'https://facebook.com',  Icon: Facebook,  bg: '#1877f2' },
    { href: 'https://twitter.com',   Icon: Twitter,   bg: '#1da1f2' },
    { href: 'https://instagram.com', Icon: Instagram, bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' },
    { href: 'https://linkedin.com',  Icon: Linkedin,  bg: '#0a66c2' },
];

const COMPANY = [
    { to: '/about',        label: 'About Us' },
    { to: '/services',     label: 'Services' },
    { to: '/how-it-works', label: 'How it Works' },
    { to: '/careers',      label: 'Careers' },
];

const SUPPORT = [
    { to: '/help',    label: 'Help Center' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms',   label: 'Terms of Service' },
];

const BADGES = [
    { Icon: Shield, label: '100% Verified Pros' },
    { Icon: Clock,  label: 'Same-Day Service' },
    { Icon: Star,   label: '4.8★ Avg Rating' },
    { Icon: Wrench, label: '20+ Service Types' },
];

const linkStyle = { color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s, padding-left 0.2s' };

const FooterLink = ({ to, label }) => (
    <Link to={to} style={linkStyle}
        onMouseOver={e => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.paddingLeft = '6px'; }}
        onMouseOut={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.paddingLeft = '0'; }}
    >
        <span style={{ marginRight: 6, color: '#3b82f6' }}>›</span>{label}
    </Link>
);

const Footer = () => (
    <footer style={{ background: '#0b1120', color: '#94a3b8', marginTop: '5rem' }}>

        {/* Trust badges strip */}
        <div style={{ background: 'linear-gradient(90deg, #1e3a5f 0%, #1e293b 50%, #1e3a5f 100%)', borderTop: '1px solid rgba(59,130,246,0.2)', borderBottom: '1px solid rgba(59,130,246,0.2)' }}>
            <Container>
                <div className="d-flex flex-wrap justify-content-center justify-content-md-between align-items-center py-3 gap-3">
                    {BADGES.map(({ Icon, label }) => (
                        <div key={label} className="d-flex align-items-center gap-2">
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={15} color="#60a5fa" />
                            </div>
                            <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 500 }}>{label}</span>
                        </div>
                    ))}
                </div>
            </Container>
        </div>

        {/* Main footer body */}
        <Container style={{ paddingTop: '56px', paddingBottom: '48px' }}>
            <Row className="g-5">

                {/* Brand col */}
                <Col lg={4} md={12}>
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Wrench size={18} color="#fff" />
                        </div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>Daily<span style={{ color: '#3b82f6' }}>Fix</span></span>
                    </div>
                    <p style={{ lineHeight: 1.85, fontSize: '0.88rem', maxWidth: 320, marginBottom: '1.5rem' }}>
                        Your trusted platform connecting homeowners with skilled professionals. Fast bookings, verified providers, and guaranteed quality — all in one place.
                    </p>

                    {/* Social icons */}
                    <div className="d-flex gap-2 mb-4">
                        {SOCIAL.map(({ href, Icon, bg }) => (
                            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                                style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', transition: 'all 0.2s' }}
                                onMouseOver={e => { e.currentTarget.style.background = bg; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none'; }}
                            >
                                <Icon size={15} />
                            </a>
                        ))}
                    </div>

                    {/* App store pills */}
                    <div className="d-flex gap-2 flex-wrap">
                        {['App Store', 'Google Play'].map(s => (
                            <div key={s} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.75rem', color: '#cbd5e1', cursor: 'pointer', transition: 'border-color 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.borderColor = '#3b82f6'}
                                onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                            >
                                {s === 'App Store' ? '🍎' : '▶'} {s}
                            </div>
                        ))}
                    </div>
                </Col>

                {/* Company links */}
                <Col lg={2} md={3} sm={6}>
                    <h6 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Company</h6>
                    <div className="d-flex flex-column gap-2">
                        {COMPANY.map(l => <FooterLink key={l.to} {...l} />)}
                    </div>
                </Col>

                {/* Support links */}
                <Col lg={2} md={3} sm={6}>
                    <h6 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Support</h6>
                    <div className="d-flex flex-column gap-2">
                        {SUPPORT.map(l => <FooterLink key={l.to} {...l} />)}
                    </div>
                </Col>

                {/* Contact */}
                <Col lg={4} md={6}>
                    <h6 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Contact Us</h6>
                    <div className="d-flex flex-column gap-3 mb-4">
                        {[
                            { href: 'https://maps.google.com/?q=Tirunelveli,Tamil Nadu,627002', Icon: MapPin, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', text: 'Tirunelveli, Tamil Nadu, 627002', align: 'flex-start' },
                            { href: 'tel:+919345825908', Icon: Phone, color: '#22c55e', bg: 'rgba(34,197,94,0.12)', text: '+91 93458 25908', align: 'center' },
                            { href: 'mailto:dailyfixlsd@gmail.com', Icon: Mail, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', text: 'dailyfixlsd@gmail.com', align: 'center' },
                        ].map(({ href, Icon, color, bg, text, align }) => (
                            <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                                style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: align, gap: 12, fontSize: '0.88rem', transition: 'color 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.color = '#e2e8f0'}
                                onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
                            >
                                <div style={{ minWidth: 36, height: 36, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={16} color={color} />
                                </div>
                                <span>{text}</span>
                            </a>
                        ))}
                    </div>

                    {/* Newsletter */}
                    <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)', borderRadius: 12, padding: '16px' }}>
                        <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: 10, fontWeight: 600 }}>📬 Get service updates</p>
                        <div className="d-flex gap-2">
                            <input type="email" placeholder="your@email.com"
                                style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 12px', color: '#f1f5f9', fontSize: '0.82rem', outline: 'none' }}
                            />
                            <button style={{ background: '#3b82f6', border: 'none', borderRadius: 8, padding: '7px 14px', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.background = '#2563eb'}
                                onMouseOut={e => e.currentTarget.style.background = '#3b82f6'}
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <Container>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center py-4 gap-2">
                    <span style={{ fontSize: '0.8rem', color: '#475569' }}>© 2026 DailyFix Services Pvt. Ltd. All rights reserved.</span>
                    <div className="d-flex gap-4 align-items-center">
                        {[{ to: '/privacy', label: 'Privacy' }, { to: '/terms', label: 'Terms' }].map(({ to, label }) => (
                            <Link key={to} to={to} style={{ color: '#475569', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.color = '#94a3b8'}
                                onMouseOut={e => e.currentTarget.style.color = '#475569'}
                            >{label}</Link>
                        ))}
                        <span style={{ fontSize: '0.8rem', color: '#475569' }}>Made with ❤️ in India</span>
                    </div>
                </div>
            </Container>
        </div>
    </footer>
);

export default Footer;
