import { useEffect } from 'react';

// Custom hook for handling text selection and click event
const handleClickText = (mode) => {
  useEffect(() => {
    const handleClick = async (e) => {
      // Ensure the click is on a clickable part
      if (!e.target.classList.contains('clickable')) return;

      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const selectedText = selection.toString().trim();
      if (selectedText) {
        try {
          // Send the selected text to the API
          const response = await fetch('http://localhost:3000/explain-highlight', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: selectedText, // The highlighted text
              mode: mode || 'regular', // Use the passed mode or default to 'regular'
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to process text');
          }

          const result = await response.json();
          alert(`Explanation: ${result.explanation}`); // Alert the explanation from the server
        } catch (error) {
          alert(`Error: ${error.message}`); // Alert any errors
        }
      }
    };

    document.addEventListener('mouseup', handleClick); // Use 'mouseup' to detect text selection

    return () => {
      document.removeEventListener('mouseup', handleClick);
    };
  }, [mode]); // Re-run the effect if the mode changes
};

export default handleClickText;