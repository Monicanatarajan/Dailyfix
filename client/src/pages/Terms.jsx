import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FileText, CheckCircle, CreditCard, XCircle, AlertTriangle, Mail, Users, Scale } from 'lucide-react';

const SECTIONS = [
    {
        Icon: CheckCircle, color: '#10b981',
        title: '1. Acceptance of Terms',
        content: 'By accessing and using Daily Fix, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time with notice.',
    },
    {
        Icon: Users, color: '#3b82f6',
        title: '2. User Accounts',
        content: 'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration. Accounts found to be fraudulent or abusive will be terminated immediately.',
    },
    {
        Icon: Scale, color: '#8b5cf6',
        title: '3. Platform Role',
        content: 'Daily Fix acts as a marketplace connecting customers with independent service providers. We do not directly employ service providers. We facilitate bookings, payments, and dispute resolution between parties.',
    },
    {
        Icon: CreditCard, color: '#f59e0b',
        title: '4. Payment Terms',
        content: 'All payments are processed securely through our payment gateway. Service providers receive 90% of the booking amount after successful service completion. Daily Fix retains a 10% platform fee. Refunds are processed according to our refund policy within 5–7 business days.',
    },
    {
        Icon: XCircle, color: '#ef4444',
        title: '5. Cancellation Policy',
        content: 'Bookings can be cancelled up to 2 hours before the scheduled time for a full refund. Cancellations made within 2 hours of the scheduled time may incur a cancellation fee of up to 20% of the booking amount. No-shows are non-refundable.',
    },
    {
        Icon: AlertTriangle, color: '#f97316',
        title: '6. Limitation of Liability',
        content: 'Daily Fix is not liable for service quality issues, property damage, or disputes arising between customers and service providers. Our maximum liability is limited to the amount paid for the specific booking in question. We strongly encourage users to review provider ratings before booking.',
    },
    {
        Icon: XCircle, color: '#64748b',
        title: '7. Termination',
        content: 'We may suspend or terminate access to our platform immediately, without prior notice, for violations of these terms, fraudulent activity, or any conduct that harms other users or the platform. Users may also delete their accounts at any time.',
    },
    {
        Icon: Mail, color: '#06b6d4',
        title: '8. Contact Information',
        content: 'For questions about these Terms of Service, please contact us at dailyfixlsd@gmail.com or call +91 93458 25908. We aim to respond to all legal inquiries within 5 business days.',
    },
];

const S = {
    hero: { background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '72px 0 56px', color: '#fff', textAlign: 'center' },
    badge: { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 20, padding: '6px 16px', fontSize: '0.78rem', color: '#60a5fa', display: 'inline-block', marginBottom: 16 },
};

const Terms = () => (
    <div style={{ background: '#f8fafc' }}>
        <div style={S.hero}>
            <Container>
                <span style={S.badge}>📄 Terms of Service</span>
                <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.6rem)', letterSpacing: '-1px', marginBottom: 14 }}>
                    Our Terms &<br /><span style={{ color: '#60a5fa' }}>Conditions</span>
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>
                    Please read these terms carefully before using the Daily Fix platform.
                </p>
                <p style={{ color: '#475569', marginTop: 16, fontSize: '0.82rem' }}>Last updated: March 20, 2024</p>
            </Container>
        </div>

        <Container style={{ padding: '64px 12px' }}>
            <Row className="g-0">
                {/* Sidebar */}
                <Col lg={3} className="d-none d-lg-block pe-4">
                    <div style={{ position: 'sticky', top: 24, background: '#fff', borderRadius: 16, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Sections</p>
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
                    {/* Summary banner */}
                    <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 14, padding: '18px 22px', marginBottom: 28, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <FileText size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
                        <p style={{ margin: 0, fontSize: '0.87rem', color: '#1e40af', lineHeight: 1.7 }}>
                            <strong>Summary:</strong> By using Daily Fix you agree to these terms. Key points — pay after service, cancel 2+ hours before for a full refund, and we take a 10% platform fee.
                        </p>
                    </div>

                    <div className="d-flex flex-column gap-4">
                        {SECTIONS.map(({ Icon, color, title, content }) => (
                            <div key={title} style={{ background: '#fff', borderRadius: 16, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={18} color={color} />
                                    </div>
                                    <h5 style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontSize: '1rem' }}>{title}</h5>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.85, margin: 0 }}>{content}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0f172a)', borderRadius: 16, padding: '28px', marginTop: 28, textAlign: 'center' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.87rem', margin: '0 0 16px' }}>Questions about our terms?</p>
                        <a href="mailto:dailyfixlsd@gmail.com" style={{ background: '#3b82f6', color: '#fff', padding: '11px 28px', borderRadius: 50, textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem' }}>
                            Email Us
                        </a>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
);

export default Terms;
