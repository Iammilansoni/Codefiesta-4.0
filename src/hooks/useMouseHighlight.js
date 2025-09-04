import { useContext } from 'react';
import { MouseHighlightContext } from '../context/MouseHighlightContext';

export const useMouseHighlight = () => {
  const context = useContext(MouseHighlightContext);
  if (!context) {
    throw new Error('useMouseHighlight must be used within MouseHighlightProvider');
  }
  return context;
};
