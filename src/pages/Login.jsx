import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore, DEMO_USERS } from '../context/StoreContext';
import { formatPrice } from '../utils/formatPrice';

export default function Login() {
  const { user, login, quickLogin, signup, logout, orders, notify } = useStore();
  const navigate = useNavigate();

  // Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [archetype, setArchetype] = useState('Quiet Luxury Minimalist');
  const [preferredSize, setPreferredSize] = useState('M');

  // Account dashboard tab: 'dna' | 'orders' | 'addresses' | 'perks'
  const [activeTab, setActiveTab] = useState('dna');

  // New address state for modal
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('Home');
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrPin, setNewAddrPin] = useState('');

  // ── Handle Sign In ──────────────────────────────────────────
  function handleSignIn(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      notify('Please enter both email and password');
      return;
    }
    login(email.trim(), password);
  }

  // ── Handle Sign Up ──────────────────────────────────────────
  function handleSignUp(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      notify('Please fill in all required fields');
      return;
    }
    signup({ name, email, phone, archetype, preferredSize });
  }

  // ── Quick Demo Login ────────────────────────────────────────
  function handleQuickDemo(type) {
    quickLogin(type);
  }

  // ── Forgot Password Simulation ──────────────────────────────
  function handleForgotPassword() {
    if (!email.trim()) {
      notify('Please enter your email above to receive a reset link');
      return;
    }
    notify(`Password reset link sent to ${email} ✓`);
  }

  // ============================================================
  // VIEW: LOGGED IN (ATELIER PATRON DASHBOARD)
  // ============================================================
  if (user) {
    const userOrders = orders.filter((o) => !o.userId || o.userId === user.id || user.email.includes('anya'));
    const pointsToNext = Math.max(0, 3000 - (user.points || 0));
    const progressPercent = Math.min(100, Math.round(((user.points || 0) / 3000) * 100));

    return (
      <main className="page ai-ambient-bg" style={{ minHeight: '80vh', padding: '40px 7vw 100px' }}>
        {/* Ambient floating orbs */}
        <div className="ai-orb ai-orb-1" aria-hidden="true" />
        <div className="ai-orb ai-orb-2" aria-hidden="true" />

        <div style={{ maxWidth: 1040, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Top banner / breadcrumb */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="ai-badge luminous">
                <span className="dot" /> {user.tierBadge || '✦ ATELIER MEMBER'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
                Member since {user.joinedDate}
              </span>
            </div>
            <button
              onClick={logout}
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: 'var(--accent)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: '1px solid var(--line)',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: '#fff',
                cursor: 'pointer',
                transition: 'all var(--t-fast)',
              }}
            >
              Sign Out ⎋
            </button>
          </div>

          {/* User Hero Card with Glassmorphism */}
          <div className="ai-glass-card ai-border-glow" style={{ padding: '32px', marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #fff',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: '#10b981',
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: '2px solid #fff',
                    boxShadow: '0 0 8px #10b981',
                  }} />
                </div>

                <div>
                  <h1 style={{ fontSize: 28, fontFamily: 'var(--serif)', fontWeight: 600, margin: '0 0 4px', color: 'var(--ink)' }}>
                    {user.name}
                  </h1>
                  <p style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span>{user.email}</span>
                    <span>·</span>
                    <span>{user.phone}</span>
                  </p>
                </div>
              </div>

              {/* Style Points & Tier progress */}
              <div style={{
                background: 'rgba(255,255,255,0.85)',
                padding: '18px 24px',
                borderRadius: 'var(--r-lg)',
                border: '1px solid var(--line)',
                minWidth: 260,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>
                    Style Rewards Balance
                  </span>
                  <span className="ai-sparkle-text" style={{ fontSize: 15 }}>
                    {user.points || 0} pts
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{ width: '100%', height: 6, background: 'var(--line-light)', borderRadius: 999, overflow: 'hidden', margin: '8px 0' }}>
                  <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--accent) 0%, #8b5cf6 100%)',
                    borderRadius: 999,
                    transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  }} />
                </div>
                <p style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right' }}>
                  {pointsToNext > 0 ? `${pointsToNext} pts to next VIP Tier` : 'Atelier Highest Tier Achieved'}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: 12,
            borderBottom: '1px solid var(--line)',
            marginBottom: 28,
            overflowX: 'auto',
            paddingBottom: 4,
          }}>
            {[
              ['dna', '✦ AI Style DNA'],
              ['orders', `Orders (${userOrders.length})`],
              ['addresses', `Addresses (${user.savedAddresses?.length || 0})`],
              ['perks', 'VIP Privileges'],
            ].map(([tabKey, tabLabel]) => (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                style={{
                  padding: '12px 18px',
                  fontSize: 13,
                  fontFamily: 'var(--sans)',
                  fontWeight: activeTab === tabKey ? 600 : 400,
                  color: activeTab === tabKey ? 'var(--ink)' : 'var(--muted)',
                  borderBottom: activeTab === tabKey ? '2px solid var(--accent)' : '2px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--t-fast)',
                }}
              >
                {tabLabel}
              </button>
            ))}
          </div>

          {/* ── TAB 1: AI STYLE DNA ───────────────────────────── */}
          {activeTab === 'dna' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {/* Archetype card */}
              <div className="ai-glass-card" style={{ padding: '24px' }}>
                <div className="ai-badge luminous" style={{ marginBottom: 12 }}>
                  <span className="dot" /> 98.2% NEURAL SYNERGY
                </div>
                <h3 style={{ fontSize: 20, fontFamily: 'var(--serif)', fontWeight: 600, marginBottom: 8 }}>
                  {user.styleDNA?.archetype || 'Quiet Luxury Minimalist'}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 20 }}>
                  {user.styleDNA?.recommendationNote || 'Calibrated to your preferred proportions, fabric textures, and silhouette balance.'}
                </p>

                <div style={{ borderTop: '1px solid var(--line-light)', paddingTop: 16 }}>
                  <p style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>
                    Calibrated Color Palette
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {(user.styleDNA?.palette || ['Ivory', 'Espresso', 'Charcoal', 'Oat']).map((color) => (
                      <div key={color} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          background: color === 'Ivory' ? '#f5f2eb' : color === 'Espresso' ? '#3d2b24' : color === 'Charcoal' ? '#262629' : color === 'Sage' ? '#7b8c7b' : '#c9ba9b',
                          border: '2px solid #fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }} />
                        <span style={{ fontSize: 10, color: 'var(--muted)' }}>{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sizing & Fit DNA */}
              <div className="ai-glass-card" style={{ padding: '24px' }}>
                <span className="ai-badge" style={{ marginBottom: 12 }}>
                  ✦ FIT CALIBRATION
                </span>
                <h3 style={{ fontSize: 20, fontFamily: 'var(--serif)', fontWeight: 600, marginBottom: 8 }}>
                  Garment Fit Specs
                </h3>

                <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line-light)' }}>
                    <span style={{ color: 'var(--muted)', fontSize: 13 }}>Optimal Size</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent)' }}>Size {user.styleDNA?.preferredSize || 'M'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line-light)' }}>
                    <span style={{ color: 'var(--muted)', fontSize: 13 }}>Silhouette Preference</span>
                    <span style={{ fontWeight: 600 }}>{user.styleDNA?.fitPreference || 'Relaxed Clean Drape'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                    <span style={{ color: 'var(--muted)', fontSize: 13 }}>Tailoring Concierge</span>
                    <span style={{ color: 'var(--green)', fontWeight: 600 }}>Available on all pieces ✓</span>
                  </div>
                </div>

                <div style={{ marginTop: 24 }}>
                  <Link to="/new" className="button" style={{ width: '100%', textAlign: 'center' }}>
                    Shop AI Recommended Drops →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: ORDERS & DELIVERIES ────────────────────── */}
          {activeTab === 'orders' && (
            <div style={{ display: 'grid', gap: 20 }}>
              {userOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', background: '#fff', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)' }}>
                  <p style={{ fontSize: 32, marginBottom: 8 }}>📦</p>
                  <h3 style={{ fontSize: 18, fontFamily: 'var(--serif)' }}>No orders placed yet</h3>
                  <p style={{ color: 'var(--muted)', fontSize: 13, margin: '6px 0 18px' }}>
                    Your wardrobe journey begins here. Explore new arrivals.
                  </p>
                  <Link to="/new" className="button">Explore collection</Link>
                </div>
              ) : (
                userOrders.map((ord) => (
                  <div key={ord.id} className="ai-glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 14 }}>
                            {ord.id}
                          </span>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            fontSize: 11,
                            fontFamily: 'var(--mono)',
                            fontWeight: 600,
                            background: ord.status === 'Delivered' ? 'var(--green-lt)' : 'var(--accent-lt)',
                            color: ord.status === 'Delivered' ? 'var(--green)' : 'var(--accent)',
                          }}>
                            {ord.status}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                          Placed on {new Date(ord.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {ord.estimatedDelivery}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', fontFamily: 'var(--mono)' }}>Total</span>
                        <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>
                          {formatPrice(ord.total || 3499)}
                        </p>
                      </div>
                    </div>

                    {/* Items row */}
                    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '10px 0', borderTop: '1px solid var(--line-light)', borderBottom: '1px solid var(--line-light)' }}>
                      {ord.items?.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 220, background: '#fff', padding: '8px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--line-light)' }}>
                          <img src={item.img} alt={item.name} style={{ width: 44, height: 52, objectFit: 'cover', borderRadius: 4 }} />
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>{item.name}</p>
                            <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>
                              {item.size} · {item.color} · Qty {item.qty}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
                      <Link to="/delivery" className="button ghost" style={{ fontSize: 12, padding: '8px 16px' }}>
                        Track Real-Time Delivery →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── TAB 3: SAVED ADDRESSES ───────────────────────── */}
          {activeTab === 'addresses' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                {user.savedAddresses?.map((addr) => (
                  <div key={addr.id} className="ai-glass-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span style={{ fontSize: 10, background: 'var(--ink)', color: '#fff', padding: '2px 8px', borderRadius: 999, fontFamily: 'var(--mono)' }}>
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>{addr.name}</p>
                    <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                      {addr.address}<br />
                      {addr.city}, {addr.state} — {addr.pincode}<br />
                      Phone: {addr.phone}
                    </p>
                  </div>
                ))}

                {/* Add new address trigger card */}
                <button
                  type="button"
                  onClick={() => setShowAddAddress(true)}
                  style={{
                    border: '2px dashed var(--line)',
                    borderRadius: 'var(--r-xl)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    minHeight: 160,
                    transition: 'all var(--t-fast)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--line)'}
                >
                  <span style={{ fontSize: 24, marginBottom: 6 }}>+</span>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>Add New Shipping Address</span>
                </button>
              </div>

              {/* Add address modal */}
              {showAddAddress && (
                <div className="ai-modal-backdrop" onClick={() => setShowAddAddress(false)}>
                  <div className="ai-modal-box" style={{ maxWidth: 480, padding: '28px' }} onClick={(e) => e.stopPropagation()}>
                    <h3 style={{ fontSize: 20, fontFamily: 'var(--serif)', marginBottom: 16 }}>Add New Address</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      user.savedAddresses = user.savedAddresses || [];
                      user.savedAddresses.push({
                        id: `addr_${Date.now()}`,
                        isDefault: false,
                        label: newAddrLabel,
                        name: user.name,
                        phone: user.phone,
                        address: newAddrLine,
                        city: newAddrCity,
                        state: newAddrState,
                        pincode: newAddrPin,
                      });
                      notify('Address added successfully ✓');
                      setShowAddAddress(false);
                    }}>
                      <div style={{ display: 'grid', gap: 12 }}>
                        <input
                          required
                          placeholder="Label (e.g. Work, Studio, Home)"
                          value={newAddrLabel}
                          onChange={(e) => setNewAddrLabel(e.target.value)}
                          style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: 6 }}
                        />
                        <input
                          required
                          placeholder="Street Address line 1 & 2"
                          value={newAddrLine}
                          onChange={(e) => setNewAddrLine(e.target.value)}
                          style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: 6 }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <input
                            required
                            placeholder="City"
                            value={newAddrCity}
                            onChange={(e) => setNewAddrCity(e.target.value)}
                            style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: 6 }}
                          />
                          <input
                            required
                            placeholder="State"
                            value={newAddrState}
                            onChange={(e) => setNewAddrState(e.target.value)}
                            style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: 6 }}
                          />
                        </div>
                        <input
                          required
                          placeholder="6-digit Pincode"
                          maxLength={6}
                          value={newAddrPin}
                          onChange={(e) => setNewAddrPin(e.target.value)}
                          style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: 6 }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                        <button type="button" onClick={() => setShowAddAddress(false)} className="button ghost">
                          Cancel
                        </button>
                        <button type="submit" className="button">
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 4: VIP PERKS ─────────────────────────────── */}
          {activeTab === 'perks' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
              {[
                { title: 'Private Pre-Launch Access', icon: '✦', desc: 'Shop all new seasonal drops 24 hours prior to public launch.', active: true },
                { title: 'Complimentary Express Shipping', icon: '⚡', desc: 'Enjoy free priority express dispatch across all orders.', active: true },
                { title: 'Bespoke Alteration Concierge', icon: '✂', desc: 'Complimentary length adjustments and sleeve tailoring at any partner studio.', active: true },
                { title: 'Personalized AI Style Capsule', icon: '🧬', desc: 'Weekly AI-synthesized looks curated strictly to your Style DNA.', active: true },
              ].map((perk, i) => (
                <div key={i} className="ai-glass-card" style={{ padding: '24px' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'var(--paper)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    marginBottom: 14,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}>
                    {perk.icon}
                  </div>
                  <h4 style={{ fontSize: 16, fontFamily: 'var(--serif)', fontWeight: 600, marginBottom: 6 }}>
                    {perk.title}
                  </h4>
                  <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>
                    {perk.desc}
                  </p>
                  <span style={{ display: 'inline-block', marginTop: 14, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--green)', fontWeight: 600 }}>
                    Active for your account ✓
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  // ============================================================
  // VIEW: GUEST SIGN IN & CREATE ACCOUNT
  // ============================================================
  return (
    <main className="page ai-ambient-bg" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 5vw 100px' }}>
      {/* Dynamic Background Glow Orbs */}
      <div className="ai-orb ai-orb-1" aria-hidden="true" />
      <div className="ai-orb ai-orb-2" aria-hidden="true" />
      <div className="ai-orb ai-orb-3" aria-hidden="true" />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        {/* Instant Demo Accounts Quick Selector */}
        <div style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          borderRadius: 'var(--r-lg)',
          padding: '16px',
          border: '1px solid var(--line)',
          marginBottom: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
              ✦ Instant 1-Click Demo Profiles
            </span>
            <span style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'var(--mono)' }}>No typing needed</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('vip')}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--r-md)',
                background: 'linear-gradient(135deg, #18181a 0%, #2e2624 100%)',
                color: '#fff',
                fontSize: 11,
                textAlign: 'left',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                transition: 'transform var(--t-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ display: 'block', fontWeight: 700, color: '#f5d38c' }}>✦ Anya Roy</span>
              <span style={{ fontSize: 9.5, opacity: 0.8 }}>Atelier Noir VIP (2,450 pts)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('casual')}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--r-md)',
                background: 'var(--paper)',
                color: 'var(--ink)',
                fontSize: 11,
                textAlign: 'left',
                border: '1px solid var(--line)',
                cursor: 'pointer',
                transition: 'transform var(--t-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ display: 'block', fontWeight: 700, color: 'var(--accent)' }}>★ Karan Sharma</span>
              <span style={{ fontSize: 9.5, color: 'var(--muted)' }}>Gold Member (1,280 pts)</span>
            </button>
          </div>
        </div>

        {/* Main Authentication Glassmorphism Card */}
        <div className="ai-glass-card ai-border-glow" style={{ padding: '36px 32px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span className="ai-badge luminous" style={{ marginBottom: 12 }}>
              <span className="dot" /> ATELIER PASSPORT · 256-BIT SECURED
            </span>
            <h1 className="ai-gradient-text" style={{ fontSize: 28, fontFamily: 'var(--serif)', fontWeight: 600, margin: '8px 0 6px' }}>
              {authMode === 'signin' ? 'Sign in to Atelier' : 'Create Atelier Account'}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>
              {authMode === 'signin'
                ? 'Access your personal AI Style DNA, orders & bespoke drops.'
                : 'Unlock 500 bonus style points and personalized AI styling.'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div style={{
            display: 'flex',
            background: 'var(--paper)',
            padding: 4,
            borderRadius: 9999,
            marginBottom: 24,
            border: '1px solid var(--line)',
          }}>
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'var(--mono)',
                background: authMode === 'signin' ? '#fff' : 'transparent',
                color: authMode === 'signin' ? 'var(--ink)' : 'var(--muted)',
                boxShadow: authMode === 'signin' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all var(--t-fast)',
              }}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'var(--mono)',
                background: authMode === 'signup' ? '#fff' : 'transparent',
                color: authMode === 'signup' ? 'var(--ink)' : 'var(--muted)',
                boxShadow: authMode === 'signup' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all var(--t-fast)',
              }}
            >
              CREATE ACCOUNT
            </button>
          </div>

          {/* Form */}
          {authMode === 'signin' ? (
            <form onSubmit={handleSignIn} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@atelier.in"
                  autoComplete="email"
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--line)',
                    background: '#fff',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'border-color var(--t-fast)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--line)'}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'underline', padding: 0 }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    style={{
                      width: '100%',
                      padding: '13px 40px 13px 16px',
                      borderRadius: 'var(--r-md)',
                      border: '1px solid var(--line)',
                      background: '#fff',
                      fontSize: 14,
                      outline: 'none',
                      transition: 'border-color var(--t-fast)',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--line)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: 13,
                      color: 'var(--muted)',
                      padding: 4,
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁' : '👁‍🗨'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0' }}>
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--accent)' }}
                />
                <label htmlFor="remember" style={{ fontSize: 12.5, color: 'var(--muted)', cursor: 'pointer' }}>
                  Keep me authenticated on this device
                </label>
              </div>

              <button
                type="submit"
                className="ai-button-glow"
                style={{ width: '100%', marginTop: 6 }}
              >
                Sign In to Atelier ✦
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 5 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Deshmukh"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 6, border: '1px solid var(--line)', background: '#fff', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 5 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya@example.com"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 6, border: '1px solid var(--line)', background: '#fff', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 5 }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 6, border: '1px solid var(--line)', background: '#fff', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 5 }}>
                    Preferred Size
                  </label>
                  <select
                    value={preferredSize}
                    onChange={(e) => setPreferredSize(e.target.value)}
                    style={{ width: '100%', padding: '12px 10px', borderRadius: 6, border: '1px solid var(--line)', background: '#fff', fontSize: 13 }}
                  >
                    {['XS', 'S', 'M', 'L', 'XL'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 5 }}>
                  Style Archetype Preference
                </label>
                <select
                  value={archetype}
                  onChange={(e) => setArchetype(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 6, border: '1px solid var(--line)', background: '#fff', fontSize: 13 }}
                >
                  <option value="Quiet Luxury Minimalist">Quiet Luxury & Minimalist</option>
                  <option value="Contemporary Sartorial">Contemporary Sartorial Casual</option>
                  <option value="Relaxed Architectural">Relaxed & Architectural</option>
                  <option value="Modern Classic">Modern Classic Essentials</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 5 }}>
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 6, border: '1px solid var(--line)', background: '#fff', fontSize: 13 }}
                />
              </div>

              <div style={{ background: 'var(--green-lt)', padding: '10px 14px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>🎁</span>
                <span style={{ fontSize: 11.5, color: 'var(--green)', fontWeight: 600 }}>
                  500 Welcome Style Points will be deposited to your account.
                </span>
              </div>

              <button
                type="submit"
                className="ai-button-glow"
                style={{ width: '100%', marginTop: 6 }}
              >
                Create Account & Claim 500 Pts ✦
              </button>
            </form>
          )}

          {/* Social or simulated authentication divider */}
          <div style={{ margin: '24px 0 20px', position: 'relative', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--line)' }} />
            <span style={{ position: 'relative', background: 'rgba(255,255,255,0.9)', padding: '0 12px', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
              OR QUICK CONNECT
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button
              type="button"
              onClick={() => {
                login('google.guest@atelier.in', 'oauth');
              }}
              style={{
                padding: '11px',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--line)',
                background: '#fff',
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                transition: 'background var(--t-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--paper)'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              <span>G</span> Google
            </button>
            <button
              type="button"
              onClick={() => {
                login('apple.guest@atelier.in', 'oauth');
              }}
              style={{
                padding: '11px',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--line)',
                background: '#fff',
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                transition: 'background var(--t-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--paper)'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              <span></span> Apple
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
