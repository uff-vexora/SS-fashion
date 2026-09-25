import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../../data/products';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatPrice';

const PRESET_STYLES = [
  { id: 'quiet-luxury', label: '☕ Quiet Luxury Office', gender: 'All', note: 'Unstructured tailoring meets breathable natural cottons for understated authority.' },
  { id: 'monsoon-brunch', label: '🌧 Weekend Casual Brunch', gender: 'All', note: 'Fluid silhouettes in earth tones designed for relaxed movement and tactile comfort.' },
  { id: 'evening-noir', label: '🍸 Rooftop Cocktail Hour', gender: 'Women', note: 'Column lines paired with sculptured layering to create a sleek modern evening presence.' },
  { id: 'sartorial-street', label: '🏙 Sartorial City Walk', gender: 'Men', note: 'Sharp pleated trousers balanced with an easy-going utility overshirt.' },
  { id: 'summer-vacation', label: '🏖 Resort & Island Retreat', gender: 'All', note: 'Textured resort knitwear and bias-cut satin pieces for effortless warmth.' },
];

export default function AiStylistModal({ isOpen, onClose }) {
  const { addToCart, notify } = useStore();
  const [selectedPreset, setSelectedPreset] = useState(PRESET_STYLES[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);
  const [outfitResult, setOutfitResult] = useState(null);
  const promptInputId = useId();

  if (!isOpen) return null;

  function generateOutfit(preset = selectedPreset) {
    setIsGenerating(true);
    setOutfitResult(null);

    setTimeout(() => {
      // Intelligently select complementary items based on gender filter & category
      let pool = products;
      if (genderFilter !== 'All') {
        pool = products.filter((p) => p.gender === genderFilter);
      }

      // Pick top, bottom/outerwear, and shoes/dress
      let top = pool.find((p) => ['Shirts', 'T-Shirts', 'Tops'].includes(p.category)) || pool[0];
      let bottom = pool.find((p) => ['Pants', 'Jeans'].includes(p.category) && p.id !== top.id) || pool[1];
      let accent = pool.find((p) => ['Jackets', 'Shoes', 'Dresses'].includes(p.category) && p.id !== top.id && p.id !== bottom.id) || pool[2];

      // If preset is women evening, choose dress + blazer + shoes
      if (preset.id === 'evening-noir' || (genderFilter === 'Women' && Math.random() > 0.4)) {
        const dress = products.find((p) => p.category === 'Dresses') || products.find((p) => p.id === 'w1');
        const jacket = products.find((p) => p.category === 'Jackets' && p.gender === 'Women') || products.find((p) => p.id === 'w4');
        const shoes = products.find((p) => p.category === 'Shoes' && p.gender === 'Women') || products.find((p) => p.id === 'w5');
        top = dress;
        bottom = jacket;
        accent = shoes;
      }

      const ensemble = [top, bottom, accent].filter(Boolean);
      const totalPrice = ensemble.reduce((acc, p) => acc + p.price, 0);
      const matchScore = (95 + Math.random() * 4.9).toFixed(1);

      setOutfitResult({
        title: preset.label.replace(/^[\p{Emoji}\s]+/u, ''),
        notes: preset.note,
        score: matchScore,
        items: ensemble,
        totalPrice,
      });
      setIsGenerating(false);
    }, 700);
  }

  function handleAddAllToCart() {
    if (!outfitResult?.items) return;
    outfitResult.items.forEach((item) => {
      addToCart(item, item.sizes?.[0] || 'M', item.colors?.[0] || 'Default');
    });
    notify(`Added full ${outfitResult.items.length}-piece AI ensemble to your bag ✓`);
    onClose();
  }

  return (
    <div className="ai-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="ai-stylist-title">
      <div className="ai-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid var(--line-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(248,247,243,0.9) 0%, rgba(255,255,255,0.95) 100%)',
        }}>
          <div>
            <div className="ai-badge luminous" style={{ marginBottom: 6 }}>
              <span className="dot" />
              <span>NEURAL STYLE ENGINE · V3.8</span>
            </div>
            <h2 id="ai-stylist-title" style={{ fontSize: 22, fontFamily: 'var(--serif)', fontWeight: 600 }}>
              Atelier AI Stylist Concierge
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>
              Generate complete, runway-curated ensembles in seconds based on your mood or destination.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close AI Stylist"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--paper)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              color: 'var(--ink)',
              border: '1px solid var(--line)',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px' }}>
          {/* Controls: Gender tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {['All', 'Women', 'Men'].map((g) => (
              <button
                key={g}
                type="button"
                className={`ai-prompt-pill ${genderFilter === g ? 'active' : ''}`}
                onClick={() => setGenderFilter(g)}
              >
                {g === 'All' ? '✦ All Collections' : g}
              </button>
            ))}
          </div>

          {/* Preset style pills */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Curated Style Archetypes
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PRESET_STYLES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`ai-prompt-pill ${selectedPreset.id === preset.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPreset(preset);
                    generateOutfit(preset);
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Freeform Prompt input */}
          <div style={{ marginBottom: 24 }}>
            <label htmlFor={promptInputId} style={{ display: 'block', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Custom Vibe or Occasion
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                id={promptInputId}
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Minimalist monsoon wedding guest with relaxed linen…"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid var(--line)',
                  background: 'var(--paper)',
                  fontSize: 13,
                  outline: 'none',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customPrompt.trim()) {
                    const customPreset = {
                      id: 'custom',
                      label: `✦ ${customPrompt}`,
                      note: `Tailored outfit synthesizing: "${customPrompt}" with modern fabric proportions.`
                    };
                    setSelectedPreset(customPreset);
                    generateOutfit(customPreset);
                  }
                }}
              />
              <button
                type="button"
                className="ai-button-glow"
                onClick={() => {
                  if (customPrompt.trim()) {
                    const customPreset = {
                      id: 'custom',
                      label: `✦ ${customPrompt}`,
                      note: `Tailored outfit synthesizing: "${customPrompt}" with modern fabric proportions.`
                    };
                    setSelectedPreset(customPreset);
                    generateOutfit(customPreset);
                  } else {
                    generateOutfit(selectedPreset);
                  }
                }}
              >
                Synthesize ✦
              </button>
            </div>
          </div>

          {/* Generation State */}
          {isGenerating && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div className="ai-neural-loading">
                <span className="ai-neural-node" />
                <span className="ai-neural-node" />
                <span className="ai-neural-node" />
                <span className="ai-neural-node" />
              </div>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', letterSpacing: '0.05em' }}>
                Analyzing fabric weights, silhouette drape, and color harmony…
              </p>
            </div>
          )}

          {/* Outfit Result Display */}
          {!isGenerating && outfitResult && (
            <div style={{
              background: 'var(--paper)',
              borderRadius: 'var(--r-lg)',
              border: '1px solid var(--line)',
              padding: '20px',
              animation: 'aiFadeIn 300ms ease-out both',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="ai-badge luminous">
                      <span className="dot" /> {outfitResult.score}% NEURAL HARMONY
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
                      3 Pieces Selected
                    </span>
                  </div>
                  <h3 style={{ fontSize: 18, fontFamily: 'var(--serif)', fontWeight: 600, marginTop: 6 }}>
                    {outfitResult.title}
                  </h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', fontFamily: 'var(--mono)' }}>Ensemble Total</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>
                    {formatPrice(outfitResult.totalPrice)}
                  </p>
                </div>
              </div>

              <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 20, fontStyle: 'italic', background: 'rgba(255,255,255,0.7)', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--line-light)' }}>
                &ldquo;{outfitResult.notes}&rdquo;
              </p>

              {/* Items grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 14,
                marginBottom: 20,
              }}>
                {outfitResult.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#fff',
                      borderRadius: 'var(--r-md)',
                      overflow: 'hidden',
                      border: '1px solid var(--line-light)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{ width: '100%', height: 160, objectFit: 'cover' }}
                    />
                    <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', fontFamily: 'var(--mono)' }}>
                          {item.gender} · {item.category}
                        </span>
                        <h4 style={{ fontSize: 13, fontWeight: 600, margin: '2px 0 6px', lineHeight: 1.3 }}>
                          {item.name}
                        </h4>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>
                          {formatPrice(item.price)}
                        </span>
                        <Link
                          to={`/product/${item.id}`}
                          onClick={onClose}
                          style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'underline' }}
                        >
                          Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="ai-button-glow"
                  onClick={handleAddAllToCart}
                  style={{ width: '100%' }}
                >
                  ✦ Add Entire Look to Bag ({formatPrice(outfitResult.totalPrice)})
                </button>
              </div>
            </div>
          )}

          {/* Initial prompt helper if nothing generated yet */}
          {!isGenerating && !outfitResult && (
            <div style={{ textAlign: 'center', padding: '30px 10px', background: 'var(--paper)', borderRadius: 'var(--r-lg)', border: '1px dashed var(--line)' }}>
              <p style={{ fontSize: 28, marginBottom: 8 }}>✨</p>
              <h4 style={{ fontSize: 16, fontFamily: 'var(--serif)', fontWeight: 600 }}>
                Select an archetype or click &lsquo;Synthesize&rsquo;
              </h4>
              <p style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 420, margin: '6px auto 16px' }}>
                Our neural fashion network coordinates garments from SS Fashion&apos;s current drop to produce effortless visual balance.
              </p>
              <button
                type="button"
                className="ai-button-glow"
                onClick={() => generateOutfit(selectedPreset)}
              >
                Synthesize Curated Look ✦
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
