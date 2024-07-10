import { useState, useEffect } from 'react';

const useTypewriterEffect = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let currentLength = 0;

    const typeCharacter = () => {
      if (currentLength < text.length) {
        setDisplayText((prev) => prev + text[currentLength]);
        currentLength++;
        requestAnimationFrame(typeCharacter);
      }
    };

    typeCharacter();
  }, [text, speed]);

  return displayText;
};

export default useTypewriterEffect;