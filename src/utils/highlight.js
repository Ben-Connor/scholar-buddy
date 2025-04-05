import { useState, useEffect } from 'react';

// Custom hook for handling text selection and click event
const handleClickText = () => {
  const [selectedWord, setSelectedWord] = useState('');

  useEffect(() => {
    const handleClick = (e) => {
      // Ensure the click is on a clickable part
      if (!e.target.classList.contains('clickable')) return;

      console.log("Text clicked");
      const s = window.getSelection();
      if (!s.rangeCount) return;

      const range = s.getRangeAt(0);
      const node = s.anchorNode;

      // Adjust start of the selection to capture the full word
      while (range.toString().indexOf(' ') !== 0) {
        range.setStart(node, range.startOffset - 1);
      }
      range.setStart(node, range.startOffset + 1);  // Move start past space

      // Adjust end of the selection to capture the full word
      do {
        range.setEnd(node, range.endOffset + 1);
      } while (range.toString().indexOf(' ') === -1 && range.toString().trim() !== '');

      // Extract the selected word
      const word = range.toString().trim();
      setSelectedWord(word);  // Store the selected word in the state

      if (word) alert(`Selected word: ${word}`);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return selectedWord;
};

export default handleClickText;