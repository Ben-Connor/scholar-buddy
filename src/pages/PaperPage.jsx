import { useState, useEffect } from 'react';
import '../styles/Select.css';
import handleClickText from '../utils/highlight.js';

function App() {
  const [count, setCount] = useState(0);
  const selectedWord = handleClickText();

  return (
    <>
      <div>
        <h1>React App with Text Selection</h1>
        <p className="clickable">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rutrum ante nunc. Proin sit amet sem purus. Aliquam malesuada egestas metus, vel ornare purus sollicitudin at.
        </p>
        <p>
          Selected word:{selectedWord || "Click on text to select a word!"}
        </p>
      </div>
    </>
  );
}

export default App;
