import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface GlucoseReading {
  id: string;
  value: number;
  timestamp: string;
  context: string;
  notes?: string;
}

interface GlucoseContextType {
  readings: GlucoseReading[];
  addReading: (reading: Omit<GlucoseReading, 'id'>) => void;
  getLatestReading: () => GlucoseReading | null;
  getTrend: () => 'up' | 'down' | 'stable';
}

const GlucoseContext = createContext<GlucoseContextType | undefined>(undefined);

export const GlucoseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [readings, setReadings] = useState<GlucoseReading[]>([
    {
      id: '1',
      value: 126,
      timestamp: new Date().toISOString(),
      context: 'fasting',
      notes: 'Première mesure'
    }
  ]);

  const addReading = useCallback((reading: Omit<GlucoseReading, 'id'>) => {
    const newReading: GlucoseReading = {
      ...reading,
      id: Date.now().toString()
    };
    setReadings(prev => [newReading, ...prev]);
  }, []);

  const getLatestReading = useCallback(() => {
    return readings[0] || null;
  }, [readings]);

  const getTrend = useCallback(() => {
    if (readings.length < 2) return 'stable';
    
    const latest = readings[0].value;
    const previous = readings[1].value;
    
    if (latest > previous + 10) return 'up';
    if (latest < previous - 10) return 'down';
    return 'stable';
  }, [readings]);

  return (
    <GlucoseContext.Provider value={{
      readings,
      addReading,
      getLatestReading,
      getTrend
    }}>
      {children}
    </GlucoseContext.Provider>
  );
};

export const useGlucose = () => {
  const context = useContext(GlucoseContext);
  if (context === undefined) {
    throw new Error('useGlucose must be used within a GlucoseProvider');
  }
  return context;
};