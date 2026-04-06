import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { HelpCircle, ChevronDown, ChevronUp, Search, CreditCard, UserCheck, Calendar, MessageCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
    { Icon: Search,      color: '#3b82f6', q: 'How do I book a service?',              a: 'Browse categories on the Find Services page, pick a verified provider, choose a time slot, and confirm. The whole process takes under 2 minutes.' },
    { Icon: UserCheck,   color: '#10b981', q: 'Are your professionals verified?',       a: 'Yes. Every provider goes through identity verification, skill assessment, and background checks before being listed on our platform.' },
    { Icon: Calendar,    color: '#f59e0b', q: 'What is the cancellation policy?',       a: 'You can cancel or reschedule any booking up to 2 hours before the scheduled time at no charge. Late cancellations may incur a small fee.' },
    { Icon: CreditCard,  color: '#8b5cf6', q: 'How do I make a payment?',              a: 'We support UPI, GPay, Net Banking, Credit/Debit cards, and Cash on Delivery. Payment is released to the provider only after the job is completed.' },
    { Icon: MessageCircle,color:'#ef4444', q: 'Can I chat with the provider?',         a: 'Yes. Once a booking is confirmed, you can chat directly with your provider through the in-app messaging system.' },
    { Icon: Shield,      color: '#06b6d4', q: 'What if I am not satisfied?',           a: 'Contact our support team within 24 hours of service completion. We will investigate and arrange a re-service or refund as appropriate.' },
];

const TOPICS = [
    { Icon: Calendar,    color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', label: 'Bookings' },
    { Icon: CreditCard,  color: '#10b981', bg: 'rgba(16,185,129,0.08)', label: 'Payments' },
    { Icon: UserCheck,   color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', label: 'Providers' },
    { Icon: Shield,      color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', label: 'Safety' },
];

const S = {
    hero: { background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '72px 0 56px', color: '#fff', textAlign: 'center' },
    badge: { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 20, padding: '6px 16px', fontSize: '0.78rem', color: '#60a5fa', display: 'inline-block', marginBottom: 16 },
};

const FaqItem = ({ Icon, color, q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${open ? '#3b82f6' : '#f1f5f9'}`, marginBottom: 12, overflow: 'hidden', transition: 'border-color 0.2s', boxShadow: open ? '0 4px 20px rgba(59,130,246,0.08)' : '0 1px 4px rgba(0,0,0,0.04)' }}>
            <button onClick={() => setOpen(o => !o)} style={{ width: '100%', background: 'none', border: 'none', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={color} />
                </div>
                <span style={{ flex: 1, fontWeight: 600, color: '#0f172a', fontSize: '0.92rem' }}>{q}</span>
                {open ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
            </button>
            {open && (
                <div style={{ padding: '0 20px 18px 70px', fontSize: '0.87rem', color: '#64748b', lineHeight: 1.8 }}>{a}</div>
            )}
        </div>
    );
};

const Help = () => (
    <div style={{ background: '#f8fafc' }}>
        <div style={S.hero}>
            <Container>
                <span style={S.badge}>❓ Help Center</span>
                <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.6rem)', letterSpacing: '-1px', marginBottom: 14 }}>
                    How Can We<br /><span style={{ color: '#60a5fa' }}>Help You?</span>
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: 440, margin: '0 auto', lineHeight: 1.8 }}>
                    Find answers to common questions or reach out to our support team.
                </p>
            </Container>
        </div>

        <Container style={{ padding: '64px 12px' }}>
            {/* Topic pills */}
            <div className="d-flex flex-wrap gap-3 justify-content-center mb-5">
                {TOPICS.map(({ Icon, color, bg, label }) => (
                    <div key={label} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: 50, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'default' }}>
                        <Icon size={15} color={color} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{label}</span>
                    </div>
                ))}
            </div>

            {/* FAQ accordion */}
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
                <h2 style={{ fontWeight: 800, color: '#0f172a', marginBottom: 28, fontSize: '1.4rem' }}>Frequently Asked Questions</h2>
                {FAQS.map(f => <FaqItem key={f.q} {...f} />)}
            </div>

            {/* Still need help */}
            <div style={{ maxWidth: 760, margin: '40px auto 0', background: 'linear-gradient(135deg,#1e3a5f,#0f172a)', borderRadius: 20, padding: '36px 32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                <div>
                    <h5 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: 6 }}>Still need help?</h5>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.88rem' }}>Our support team is available 7 days a week.</p>
                </div>
                <Link to="/contact" style={{ background: '#3b82f6', color: '#fff', padding: '12px 28px', borderRadius: 50, textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                    Contact Support
                </Link>
            </div>
        </Container>
    </div>
);

export default Help;
