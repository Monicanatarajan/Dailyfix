import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Shield, Eye, Lock, Bell, Trash2, Mail } from 'lucide-react';

const SECTIONS = [
    {
        Icon: Eye, color: '#3b82f6',
        title: '1. Information We Collect',
        content: 'We collect information you provide directly to us when you create an account, make a booking, or contact support.',
        bullets: [
            'Personal details — name, email, phone number, address',
            'Booking history and service preferences',
            'Payment information (processed securely via third-party providers)',
            'Device and usage data for platform improvement',
        ],
    },
    {
        Icon: Lock, color: '#10b981',
        title: '2. How We Use Your Information',
        content: 'Your data helps us deliver and improve our services.',
        bullets: [
            'Process bookings and payments securely',
            'Match you with the right service providers',
            'Send booking confirmations and service updates',
            'Improve platform features and user experience',
            'Detect and prevent fraud or abuse',
        ],
    },
    {
        Icon: Shield, color: '#f59e0b',
        title: '3. Data Security',
        content: 'We take the security of your personal information seriously and implement industry-standard measures to protect it.',
        bullets: [
            'All data is encrypted in transit using TLS/SSL',
            'Payment data is handled by PCI-DSS compliant processors',
            'Access to personal data is strictly role-based',
            'Regular security audits and vulnerability assessments',
        ],
    },
    {
        Icon: Bell, color: '#8b5cf6',
        title: '4. Cookies & Tracking',
        content: 'We use cookies to enhance your experience and understand how our platform is used.',
        bullets: [
            'Session cookies to keep you logged in',
            'Analytics cookies to understand usage patterns',
            'You can disable cookies in your browser settings',
        ],
    },
    {
        Icon: Trash2, color: '#ef4444',
        title: '5. Data Retention & Deletion',
        content: 'We retain your data only as long as necessary to provide our services.',
        bullets: [
            'Account data is retained while your account is active',
            'You can request deletion of your account at any time',
            'Booking records may be retained for legal compliance',
        ],
    },
    {
        Icon: Mail, color: '#06b6d4',
        title: '6. Contact Us',
        content: 'For any privacy-related questions or requests, please reach out to us.',
        bullets: [
            'Email: dailyfixlsd@gmail.com',
            'Phone: +91 93458 25908',
            'We respond to all privacy requests within 72 hours',
        ],
    },
];

const S = {
    hero: { background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '72px 0 56px', color: '#fff', textAlign: 'center' },
    badge: { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 20, padding: '6px 16px', fontSize: '0.78rem', color: '#60a5fa', display: 'inline-block', marginBottom: 16 },
};

const Privacy = () => (
    <div style={{ background: '#f8fafc' }}>
        <div style={S.hero}>
            <Container>
                <span style={S.badge}>🔒 Privacy Policy</span>
                <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.6rem)', letterSpacing: '-1px', marginBottom: 14 }}>
                    Your Privacy<br /><span style={{ color: '#60a5fa' }}>Matters to Us</span>
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>
                    We are committed to protecting your personal information and being transparent about how we use it.
                </p>
                <p style={{ color: '#475569', marginTop: 16, fontSize: '0.82rem' }}>Last updated: March 20, 2024</p>
            </Container>
        </div>

        <Container style={{ padding: '64px 12px' }}>
            <Row className="g-0">
                {/* Sidebar nav */}
                <Col lg={3} className="d-none d-lg-block pe-4">
                    <div style={{ position: 'sticky', top: 24, background: '#fff', borderRadius: 16, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Contents</p>
                        {SECTIONS.map(({ Icon, color, title }) => (
                            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                                <Icon size={13} color={color} />
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{title.split('. ')[1]}</span>
                            </div>
                        ))}
                    </div>
                </Col>

                {/* Content */}
                <Col lg={9}>
                    <div className="d-flex flex-column gap-4">
                        {SECTIONS.map(({ Icon, color, title, content, bullets }) => (
                            <div key={title} style={{ background: '#fff', borderRadius: 16, padding: '28px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={18} color={color} />
                                    </div>
                                    <h5 style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontSize: '1rem' }}>{title}</h5>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: 14 }}>{content}</p>
                                <ul style={{ margin: 0, paddingLeft: 20 }}>
                                    {bullets.map(b => (
                                        <li key={b} style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: 4 }}>{b}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
);

export default Privacy;
