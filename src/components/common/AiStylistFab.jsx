import { useState } from 'react';
import AiStylistModal from './AiStylistModal';

export default function AiStylistFab() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="ai-stylist-fab"
        onClick={() => setModalOpen(true)}
        aria-label="Open AI Fashion Stylist Concierge"
      >
        <div className="orb-icon" aria-hidden="true">
          <span>✦</span>
        </div>
        <span className="fab-text" style={{ fontWeight: 600, letterSpacing: '0.04em', fontSize: 12 }}>
          AI Stylist
        </span>
      </button>

      <AiStylistModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
