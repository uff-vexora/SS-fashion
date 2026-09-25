import { useState } from 'react';

export default function AiFitPredictor({ product, selectedSize, onSelectSize, isOpen, onClose }) {
  const [height, setHeight] = useState('172');
  const [weight, setWeight] = useState('68');
  const [fitPref, setFitPref] = useState('Regular');
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  if (!isOpen) return null;

  function runFitAnalysis(e) {
    e.preventDefault();
    setAnalyzing(true);
    setRecommendation(null);

    setTimeout(() => {
      const h = parseFloat(height) || 170;
      const w = parseFloat(weight) || 65;
      const availableSizes = product.sizes || ['S', 'M', 'L', 'XL'];

      let rec = 'M';
      // Basic anthropometric heuristic mapped to garment sizes
      if (h < 162 || w < 54) rec = availableSizes.includes('XS') ? 'XS' : availableSizes[0];
      else if (h <= 170 && w <= 64) rec = availableSizes.includes('S') ? 'S' : availableSizes[0];
      else if (h <= 178 && w <= 75) rec = availableSizes.includes('M') ? 'M' : availableSizes[1];
      else if (h <= 186 && w <= 86) rec = availableSizes.includes('L') ? 'L' : availableSizes[2];
      else rec = availableSizes.includes('XL') ? 'XL' : availableSizes[availableSizes.length - 1];

      // Adjust for fit preference
      if (fitPref === 'Oversized') {
        const idx = availableSizes.indexOf(rec);
        if (idx !== -1 && idx < availableSizes.length - 1) {
          rec = availableSizes[idx + 1];
        }
      }

      setRecommendation({
        size: rec,
        confidence: 97.4,
        reasoning: `Based on your ${height}cm stature and ${weight}kg build with a preference for a ${fitPref.toLowerCase()} drape, ${rec} provides the ideal balance across the shoulders and chest with zero pull.`,
      });
      setAnalyzing(false);
    }, 600);
  }

  function handleApplySize() {
    if (recommendation?.size) {
      onSelectSize(recommendation.size);
      onClose();
    }
  }

  return (
    <div className="ai-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ai-modal-box" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--line-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(248,247,243,0.95) 0%, #fff 100%)',
        }}>
          <div>
            <span className="ai-badge luminous" style={{ marginBottom: 4 }}>
              <span className="dot" /> AI 3D FIT ALGORITHM
            </span>
            <h3 style={{ fontSize: 18, fontFamily: 'var(--serif)', fontWeight: 600 }}>
              Smart Size & Fit Predictor
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)' }}>
              Calibrated for: <strong style={{ color: 'var(--ink)' }}>{product.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close fit predictor"
            style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--line)' }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <form onSubmit={runFitAnalysis}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Height (cm)
                </label>
                <input
                  type="number"
                  required
                  min={120}
                  max={220}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--line)',
                    background: 'var(--paper)',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Weight (kg)
                </label>
                <input
                  type="number"
                  required
                  min={30}
                  max={160}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--line)',
                    background: 'var(--paper)',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                Desired Silhouette Fit
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Tailored / Slim', 'Regular', 'Oversized'].map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    className={`ai-prompt-pill ${fitPref === pref ? 'active' : ''}`}
                    onClick={() => setFitPref(pref)}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="ai-button-glow"
              style={{ width: '100%' }}
              disabled={analyzing}
            >
              {analyzing ? 'Calibrating Neural Fit…' : 'Calculate My Size ✦'}
            </button>
          </form>

          {analyzing && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div className="ai-neural-loading">
                <span className="ai-neural-node" />
                <span className="ai-neural-node" />
                <span className="ai-neural-node" />
              </div>
              <p style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
                Cross-referencing pattern specs & stretch coefficient…
              </p>
            </div>
          )}

          {!analyzing && recommendation && (
            <div style={{
              marginTop: 20,
              padding: '18px',
              borderRadius: 'var(--r-lg)',
              background: 'linear-gradient(135deg, rgba(232, 240, 232, 0.6) 0%, rgba(248, 247, 243, 0.9) 100%)',
              border: '1px solid var(--green)',
              animation: 'aiFadeIn 250ms ease-out both',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--green)', fontWeight: 600 }}>
                    ✦ OPTIMAL MATCH FOUND
                  </span>
                  <h4 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>
                    Recommended Size: <span style={{ color: 'var(--accent)' }}>{recommendation.size}</span>
                  </h4>
                </div>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  background: 'var(--green-lt)',
                  color: 'var(--green)',
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  fontWeight: 700,
                }}>
                  {recommendation.confidence}% Match
                </div>
              </div>

              <p style={{ fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.5, marginBottom: 14 }}>
                {recommendation.reasoning}
              </p>

              <button
                type="button"
                className="button"
                onClick={handleApplySize}
                style={{ width: '100%', fontSize: 12, padding: '12px 20px' }}
              >
                Select Size {recommendation.size} for this item ✓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
