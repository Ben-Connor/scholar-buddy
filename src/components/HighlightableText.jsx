import React from 'react';
import handleClickText from '../utils/highlight';

const HighlightableText = ({ text, mode }) => {
  handleClickText(mode); // Pass the mode to the hook

  return (
    <div className="clickable" style={{ cursor: 'text', userSelect: 'text' }}>
      {text}
    </div>
  );
};

export default HighlightableText;