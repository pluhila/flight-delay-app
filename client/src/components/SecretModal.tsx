import React from 'react';

interface SecretModalProps {
  onClose: () => void;
}

const SecretModal: React.FC<SecretModalProps> = ({ onClose }) => (
  <div className="secret-modal" onClick={onClose}>
    <div className="secret-modal-content" onClick={e => e.stopPropagation()}>
      <button className="secret-modal-close" onClick={onClose} aria-label="Close video">×</button>
      <iframe
        width="360"
        height="215"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
        title="Secret Video"
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
  </div>
);

export default SecretModal;
