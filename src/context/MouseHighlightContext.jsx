import React, { createContext, useState } from 'react';

// Create context for mouse highlight settings
const MouseHighlightContext = createContext();

const MouseHighlightProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    enabled: true,
    intensity: 'medium', // 'low', 'medium', 'high'
    theme: 'hackathon', // 'hackathon', 'royal', 'cyberpunk'
    sparkles: true,
    clickEffects: true,
    trailEnabled: true,
  });

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleEnabled = () => {
    setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const value = {
    settings,
    updateSettings,
    toggleEnabled,
  };

  return (
    <MouseHighlightContext.Provider value={value}>
      {children}
    </MouseHighlightContext.Provider>
  );
};

export { MouseHighlightProvider, MouseHighlightContext };
