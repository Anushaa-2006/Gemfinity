import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Sparkles, ShieldCheck, CreditCard, Award, Layers, Globe, Palette, 
  ChevronRight, CheckCircle2, Lock, Smartphone, RefreshCw, PlusCircle, ArrowUpRight, Check
} from 'lucide-react';
import { translations } from './i18n';
import './index.css';

export default function App() {
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('minimalist'); // 'minimalist', 'gold', 'fintech'
  const [token, setToken] = useState(localStorage.getItem('gem_token') || 'mock_jwt_token_ananya_2026');
  const [activeTab, setActiveTab] = useState('dashboard');

  // App Data State
  const [user, setUser] = useState({ name: 'Ananya Sharma', email: 'ananya@gemfinity.com', language_pref: 'en' });
  const [schemes, setSchemes] = useState([
    {
      scheme_id: 1,
      amount: 55000,
      monthly_installment: 5000,
      paid_installments: 7,
      duration_months: 11,
      accumulated_grams: 15.5,
      target_grams: 25.0,
      start_date: '2026-01-15',
      end_date: '2026-12-15',
      status: 'ACTIVE'
    },
    {
      scheme_id: 2,
      amount: 110000,
      monthly_installment: 10000,
      paid_installments: 11,
      duration_months: 11,
      accumulated_grams: 16.0,
      target_grams: 16.0,
      start_date: '2025-09-01',
      end_date: '2026-08-01',
      status: 'MATURED'
    }
  ]);

  const [collections, setCollections] = useState([
    { collection_id: 1, collection_name: 'Bridal Gold Savings Plan', scheme_ids: [1, 2], shared_status: true }
  ]);

  const [rewards, setRewards] = useState({ points: 750, tier: 'SILVER' });
  const [certificates, setCertificates] = useState([
    {
      cert_id: 1,
      scheme_id: 2,
      certificate_code: 'GEM-CERT-2026-916-8842',
      purity_grade: '22K (916 BIS Hallmarked)',
      issue_date: '2026-08-15'
    }
  ]);

  // Modals state
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');

  // Form Inputs
  const [loginEmail, setLoginEmail] = useState('ananya@gemfinity.com');
  const [loginPass, setLoginPass] = useState('gemfinity123');
  const [newInstallment, setNewInstallment] = useState(5000);
  const [newColName, setNewColName] = useState('');

  const t = translations[lang];

  useEffect(() => {
    if (theme === 'minimalist') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setToken('mock_jwt_token_ananya_2026');
    localStorage.setItem('gem_token', 'mock_jwt_token_ananya_2026');
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('gem_token');
  };

  // Calculate Total Metrics
  const totalSavings = schemes.reduce((acc, s) => acc + (s.paid_installments * s.monthly_installment), 0);
  const currentGrams = 15.5;
  const targetGrams = 25.0;
  const progressPercent = Math.round((currentGrams / targetGrams) * 100);

  // Execute Payment Simulation
  const processPayment = () => {
    if (!selectedScheme) return;

    setTimeout(() => {
      const updatedSchemes = schemes.map(s => {
        if (s.scheme_id === selectedScheme.scheme_id) {
          const newPaid = s.paid_installments + 1;
          const isMatured = newPaid >= s.duration_months;
          if (isMatured) {
            setCertificates([
              ...certificates,
              {
                cert_id: Date.now(),
                scheme_id: s.scheme_id,
                certificate_code: `GEM-CERT-${Date.now()}-916-${Math.floor(1000 + Math.random() * 9000)}`,
                purity_grade: '22K (916 BIS Hallmarked)',
                issue_date: new Date().toISOString().split('T')[0]
              }
            ]);
          }
          return { ...s, paid_installments: newPaid, status: isMatured ? 'MATURED' : 'ACTIVE' };
        }
        return s;
      });

      setSchemes(updatedSchemes);
      setRewards({ ...rewards, points: rewards.points + 100 });
      setShowPayModal(false);
      setPaymentSuccessMsg('✨ Payment Verified via Razorpay! +100 Rewards Credited.');
      setTimeout(() => setPaymentSuccessMsg(''), 4000);
    }, 800);
  };

  // Enroll in New Scheme
  const handleEnroll = (e) => {
    e.preventDefault();
    const inst = parseFloat(newInstallment);
    const newScheme = {
      scheme_id: Date.now(),
      amount: inst * 11,
      monthly_installment: inst,
      paid_installments: 1,
      duration_months: 11,
      accumulated_grams: (inst / 6850).toFixed(2),
      target_grams: ((inst * 11) / 6850).toFixed(2),
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 11 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'ACTIVE'
    };

    setSchemes([newScheme, ...schemes]);
    setRewards({ ...rewards, points: rewards.points + 100 });
    setShowEnrollModal(false);
  };

  // Create Scheme Collection
  const handleCreateCollection = (e) => {
    e.preventDefault();
    if (!newColName) return;
    const newCol = {
      collection_id: Date.now(),
      collection_name: newColName,
      scheme_ids: schemes.map(s => s.scheme_id),
      shared_status: true
    };
    setCollections([...collections, newCol]);
    setNewColName('');
  };

  return (
    <div className="mobile-frame">
      {/* APP HEADER */}
      <header style={{
        padding: '18px 22px',
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E9E8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1C3F3A 0%, #2D5A52 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(28, 63, 58, 0.15)'
          }}>
            <Sparkles size={20} color="#D4AF37" />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', margin: 0, fontWeight: 700, color: '#1C3F3A', letterSpacing: '-0.3px' }}>
              Gemfinity
            </h1>
            <p style={{ fontSize: '10px', color: '#64748B', margin: 0, fontWeight: 500 }}>
              Gold Savings & Investment
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Secure MFA Badge */}
          <div className="mfa-badge">
            <Lock size={12} color="#1C3F3A" /> MFA Active
          </div>

          {/* Language Toggle */}
          <button 
            onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
            style={{
              background: '#F4F7F6',
              border: '1px solid #E5E9E8',
              color: '#1C3F3A',
              padding: '6px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600
            }}>
            <Globe size={13} />
            {lang === 'en' ? 'ТА' : 'EN'}
          </button>
        </div>
      </header>

      {/* TOAST MESSAGE */}
      {paymentSuccessMsg && (
        <div style={{
          padding: '12px 20px',
          background: '#1C3F3A',
          color: '#D4AF37',
          fontSize: '13px',
          fontWeight: 600,
          textAlign: 'center',
          borderBottom: '2px solid #D4AF37'
        }}>
          {paymentSuccessMsg}
        </div>
      )}

      {/* AUTH SCREEN IF NOT LOGGED IN */}
      {!token ? (
        <div style={{ padding: '40px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="neumorphic-card" style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', margin: '0 auto 18px',
              borderRadius: '20px', background: 'linear-gradient(135deg, #1C3F3A 0%, #2D5A52 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(28, 63, 58, 0.2)'
            }}>
              <ShieldCheck size={32} color="#D4AF37" />
            </div>
            <h2 style={{ fontSize: '22px', marginBottom: '6px', color: '#1C3F3A' }}>{t.loginTitle}</h2>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>{t.loginSubtitle}</p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input 
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  background: '#F8FAFC', border: '1px solid #E2E8F0',
                  color: '#1C3F3A', fontSize: '14px', outline: 'none'
                }}
              />
              <input 
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder={t.passPlaceholder}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  background: '#F8FAFC', border: '1px solid #E2E8F0',
                  color: '#1C3F3A', fontSize: '14px', outline: 'none'
                }}
              />
              <button type="submit" className="gold-btn" style={{ width: '100%', padding: '14px' }}>
                {t.loginBtn}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* MAIN DASHBOARD & APP CONTENT */
        <div style={{ flex: 1, padding: '20px 18px 84px', overflowY: 'auto' }}>
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* User Header Greeting */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#1C3F3A', margin: 0 }}>
                    Hello, {user.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                    Gold Chit Scheme #48912 • Active
                  </p>
                </div>
                <button onClick={handleLogout} style={{
                  background: 'none', border: '1px solid #CBD5E1', color: '#64748B',
                  fontSize: '11px', padding: '5px 12px', borderRadius: '20px', cursor: 'pointer', fontWeight: 500
                }}>Sign out</button>
              </div>

              {/* PRIMARY HERO CARD: Minimalist Neumorphic Gold Balance & 3D Illustration */}
              <div className="neumorphic-card" style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FBFB 100%)',
                borderColor: '#E5E9E8'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#C5A059', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      Accumulated Gold Balance
                    </span>
                    <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1C3F3A', margin: '6px 0 2px' }}>
                      ₹{totalSavings.toLocaleString('en-IN')}
                    </h2>
                    <p style={{ fontSize: '13px', color: '#2D5A52', fontWeight: 600 }}>
                      15.50 grams <span style={{ color: '#64748B', fontWeight: 400 }}>(22K 916 BIS)</span>
                    </p>
                  </div>

                  {/* 3D Champagne Gold Coin & Bar Focal Illustration */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid #F0F4F3',
                    boxShadow: '0 6px 16px rgba(28, 63, 58, 0.06)'
                  }}>
                    <img 
                      src="/gold_bar_coin.jpg" 
                      alt="Digital Gold Coin" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #E5E9E8', margin: '18px 0 14px' }} />

                {/* SMOOTH PROGRESS VISUALIZATION CHART (15.5g / 25g) */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#1C3F3A' }}>
                      Gold Goal Tracking
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#C5A059' }}>
                      {currentGrams}g / {targetGrams}g ({progressPercent}%)
                    </span>
                  </div>

                  {/* Smooth Progress Bar */}
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                  </div>

                  <p style={{ fontSize: '11px', color: '#64748B', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={13} color="#10B981" /> 9.5 grams remaining to achieve scheme maturity target!
                  </p>
                </div>
              </div>

              {/* Installment Payment Reminder */}
              {schemes.find(s => s.status === 'ACTIVE') && (
                <div className="neumorphic-card" style={{
                  padding: '16px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'linear-gradient(135deg, #1C3F3A 0%, #2D5A52 100%)',
                  color: '#FFFFFF'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#D4AF37', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Upcoming Due Date
                    </span>
                    <h4 style={{ fontSize: '17px', margin: '4px 0 0', fontWeight: 700 }}>₹5,000 (Due Sept 15)</h4>
                  </div>

                  <button 
                    onClick={() => {
                      setSelectedScheme(schemes.find(s => s.status === 'ACTIVE'));
                      setShowPayModal(true);
                    }}
                    className="gold-accent-btn">
                    <CreditCard size={16} /> Pay Now
                  </button>
                </div>
              )}

              {/* ACTIVE SCHEMES LIST */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1C3F3A', margin: 0 }}>
                    My Active Schemes
                  </h4>
                  <button onClick={() => setShowEnrollModal(true)} style={{ background: 'none', border: 'none', color: '#C5A059', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    + Enroll New
                  </button>
                </div>

                {schemes.map(s => (
                  <div key={s.scheme_id} className="neumorphic-card" style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{
                          fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px',
                          background: s.status === 'MATURED' ? 'rgba(16,185,129,0.12)' : 'rgba(197,160,89,0.15)',
                          color: s.status === 'MATURED' ? '#10B981' : '#C5A059'
                        }}>
                          {s.status}
                        </span>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1C3F3A', margin: '8px 0 2px' }}>
                          11-Month Gold Savings Plan
                        </h4>
                        <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                          Target Value: ₹{s.amount.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '17px', fontWeight: 800, color: '#1C3F3A' }}>
                          ₹{s.monthly_installment.toLocaleString('en-IN')}/mo
                        </span>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginBottom: '6px' }}>
                        <span>Installments Paid</span>
                        <span style={{ fontWeight: 600, color: '#1C3F3A' }}>{s.paid_installments} of {s.duration_months} Paid</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${(s.paid_installments / s.duration_months) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: MY SCHEMES */}
          {activeTab === 'schemes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', color: '#1C3F3A', margin: 0 }}>My Schemes</h3>
                <button onClick={() => setShowEnrollModal(true)} className="gold-btn" style={{ fontSize: '12px', padding: '10px 16px' }}>
                  <PlusCircle size={16} /> Enroll New
                </button>
              </div>

              {schemes.map(s => (
                <div key={s.scheme_id} className="neumorphic-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', color: '#1C3F3A', margin: 0 }}>Gold Chit #{s.scheme_id}</h4>
                      <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                        Start: {s.start_date} | Maturity: {s.end_date}
                      </p>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#C5A059' }}>
                      ₹{s.monthly_installment}/mo
                    </span>
                  </div>

                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #E5E9E8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: s.status === 'MATURED' ? '#10B981' : '#1C3F3A' }}>
                      Status: {s.status} ({s.paid_installments}/11)
                    </span>
                    {s.status === 'ACTIVE' ? (
                      <button onClick={() => { setSelectedScheme(s); setShowPayModal(true); }} className="gold-btn" style={{ fontSize: '12px', padding: '8px 14px' }}>
                        Pay Installment
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700 }}>🎉 Matured & Verified</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: COLLECTIONS */}
          {activeTab === 'collections' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', color: '#1C3F3A', margin: 0 }}>Scheme Collections</h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                Group individual gold chit plans into named sets for family savings.
              </p>

              <form onSubmit={handleCreateCollection} className="neumorphic-card" style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text"
                  placeholder="Collection Name (e.g. Wedding Set 2027)"
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '10px',
                    background: '#F8FAFC', border: '1px solid #E2E8F0',
                    color: '#1C3F3A', fontSize: '13px', outline: 'none'
                  }}
                />
                <button type="submit" className="gold-btn" style={{ fontSize: '12px' }}>
                  Create
                </button>
              </form>

              {collections.map(c => (
                <div key={c.collection_id} className="neumorphic-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Layers color="#1C3F3A" size={22} />
                      <h4 style={{ fontSize: '16px', color: '#1C3F3A', margin: 0 }}>{c.collection_name}</h4>
                    </div>
                    <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(28,63,58,0.08)', color: '#1C3F3A', fontWeight: 600 }}>
                      Shared Family Set
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px', margin: 0 }}>
                    Contains {c.scheme_ids.length} active gold chit schemes
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: REWARDS */}
          {activeTab === 'rewards' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="neumorphic-card" style={{ textAlign: 'center', background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FBFB 100%)' }}>
                <Award size={44} color="#C5A059" style={{ margin: '0 auto 8px' }} />
                <h3 style={{ fontSize: '28px', color: '#1C3F3A', margin: 0, fontWeight: 800 }}>{rewards.points} Points</h3>
                <p style={{ fontSize: '12px', color: '#C5A059', fontWeight: 700, marginTop: '4px' }}>
                  Tier Status: {rewards.tier} Member
                </p>

                <div style={{ marginTop: '18px' }}>
                  <button onClick={() => setShowVoucherModal(true)} className="gold-btn" style={{ width: '100%' }}>
                    Redeem Making Charge Voucher
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', color: '#1C3F3A', margin: 0 }}>Digital Purity Certificates</h3>

              {certificates.map(cert => (
                <div key={cert.cert_id} className="neumorphic-card" style={{ textAlign: 'center', borderColor: '#C5A059' }}>
                  <ShieldCheck size={38} color="#1C3F3A" style={{ margin: '0 auto 8px' }} />
                  <h4 style={{ fontSize: '16px', color: '#1C3F3A', margin: 0 }}>{cert.purity_grade}</h4>
                  <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Code: {cert.certificate_code}</p>

                  <div style={{ margin: '16px auto', padding: '14px', background: '#FFFFFF', borderRadius: '16px', width: '180px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                    <QRCodeSVG value={cert.certificate_code} size={150} />
                  </div>

                  <p style={{ fontSize: '12px', color: '#10B981', fontWeight: 700, margin: 0 }}>
                    ✓ BIS 916 Hallmarked Gold Certificate Verified
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* RAZORPAY SANDBOX PAYMENT MODAL */}
      {showPayModal && selectedScheme && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(28,63,58,0.4)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000
        }}>
          <div className="neumorphic-card" style={{ width: '100%', maxWidth: '380px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', color: '#1C3F3A', margin: 0, fontWeight: 700 }}>Razorpay Sandbox Payment</h3>
              <button onClick={() => setShowPayModal(false)} style={{ background: 'none', border: 'none', color: '#1C3F3A', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ padding: '14px', background: '#F4F7F6', borderRadius: '12px', marginBottom: '16px' }}>
              <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Installment Amount</p>
              <h2 style={{ fontSize: '26px', color: '#1C3F3A', margin: '4px 0 0', fontWeight: 800 }}>₹5,000.00</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <input type="text" value="4111 1111 1111 1111" readOnly style={{ padding: '12px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1C3F3A' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" value="12/28" readOnly style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1C3F3A' }} />
                <input type="text" value="123" readOnly style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1C3F3A' }} />
              </div>
            </div>

            <button onClick={processPayment} className="gold-btn" style={{ width: '100%' }}>
              Simulate Razorpay Payment
            </button>
          </div>
        </div>
      )}

      {/* SCHEME ENROLLMENT MODAL */}
      {showEnrollModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(28,63,58,0.4)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000
        }}>
          <div className="neumorphic-card" style={{ width: '100%', maxWidth: '380px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', color: '#1C3F3A', margin: 0, fontWeight: 700 }}>Enroll in 11-Month Gold Scheme</h3>
              <button onClick={() => setShowEnrollModal(false)} style={{ background: 'none', border: 'none', color: '#1C3F3A', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleEnroll} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#64748B' }}>Select Monthly Installment</label>
                <select 
                  value={newInstallment} 
                  onChange={(e) => setNewInstallment(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1C3F3A', marginTop: '6px' }}>
                  <option value={1000}>₹1,000 / month (Target: ₹11,000)</option>
                  <option value={2500}>₹2,500 / month (Target: ₹27,500)</option>
                  <option value={5000}>₹5,000 / month (Target: ₹55,000)</option>
                  <option value={10000}>₹10,000 / month (Target: ₹1,10,000)</option>
                </select>
              </div>

              <button type="submit" className="gold-btn" style={{ width: '100%' }}>
                Start Scheme & Pay 1st Installment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VOUCHER REDEEM MODAL */}
      {showVoucherModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(28,63,58,0.4)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000
        }}>
          <div className="neumorphic-card" style={{ width: '100%', maxWidth: '380px', background: '#FFFFFF', textAlign: 'center' }}>
            <Sparkles size={38} color="#C5A059" style={{ margin: '0 auto 8px' }} />
            <h3 style={{ fontSize: '18px', color: '#1C3F3A', margin: 0, fontWeight: 700 }}>₹500 Making Charge Voucher</h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '6px 0 16px' }}>Redeemed with 500 loyalty points</p>

            <div style={{ padding: '12px', background: '#F4F7F6', borderRadius: '10px', border: '1px dashed #C5A059', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '2px', color: '#1C3F3A' }}>GEM-VOUCHER-884210</span>
            </div>

            <button onClick={() => setShowVoucherModal(false)} className="gold-btn" style={{ width: '100%' }}>
              Done
            </button>
          </div>
        </div>
      )}

      {/* FOOTER BOTTOM NAVIGATION BAR */}
      {token && (
        <nav style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: '480px', height: '66px',
          background: '#FFFFFF', borderTop: '1px solid #E5E9E8',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around', zIndex: 90
        }}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{
              background: 'none', border: 'none',
              color: activeTab === 'dashboard' ? '#1C3F3A' : '#94A3B8',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              fontSize: '10px', fontWeight: activeTab === 'dashboard' ? 700 : 500, cursor: 'pointer'
            }}>
            <Sparkles size={18} color={activeTab === 'dashboard' ? '#C5A059' : '#94A3B8'} /> {t.dashboard}
          </button>

          <button 
            onClick={() => setActiveTab('schemes')}
            style={{
              background: 'none', border: 'none',
              color: activeTab === 'schemes' ? '#1C3F3A' : '#94A3B8',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              fontSize: '10px', fontWeight: activeTab === 'schemes' ? 700 : 500, cursor: 'pointer'
            }}>
            <CreditCard size={18} color={activeTab === 'schemes' ? '#C5A059' : '#94A3B8'} /> {t.schemes}
          </button>

          <button 
            onClick={() => setActiveTab('collections')}
            style={{
              background: 'none', border: 'none',
              color: activeTab === 'collections' ? '#1C3F3A' : '#94A3B8',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              fontSize: '10px', fontWeight: activeTab === 'collections' ? 700 : 500, cursor: 'pointer'
            }}>
            <Layers size={18} color={activeTab === 'collections' ? '#C5A059' : '#94A3B8'} /> {t.collections}
          </button>

          <button 
            onClick={() => setActiveTab('rewards')}
            style={{
              background: 'none', border: 'none',
              color: activeTab === 'rewards' ? '#1C3F3A' : '#94A3B8',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              fontSize: '10px', fontWeight: activeTab === 'rewards' ? 700 : 500, cursor: 'pointer'
            }}>
            <Award size={18} color={activeTab === 'rewards' ? '#C5A059' : '#94A3B8'} /> {t.rewards}
          </button>

          <button 
            onClick={() => setActiveTab('certificates')}
            style={{
              background: 'none', border: 'none',
              color: activeTab === 'certificates' ? '#1C3F3A' : '#94A3B8',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              fontSize: '10px', fontWeight: activeTab === 'certificates' ? 700 : 500, cursor: 'pointer'
            }}>
            <ShieldCheck size={18} color={activeTab === 'certificates' ? '#C5A059' : '#94A3B8'} /> {t.certificates}
          </button>
        </nav>
      )}
    </div>
  );
}
