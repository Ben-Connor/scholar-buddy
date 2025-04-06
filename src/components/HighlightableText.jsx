import React from 'react';
import handleClickText from '../utils/highlight';

const HighlightableText = ({ text, mode }) => {
  handleClickText(mode); // Pass the mode to the hook

  // Replace newlines with <br> tags
  const formattedText = text.replace(/\n/g, '<br>');

  return (
    <div
      className="clickable"
      style={{ cursor: 'text', userSelect: 'text' }}
      dangerouslySetInnerHTML={{ __html: formattedText }}
    />
  );
};

export default HighlightableText;