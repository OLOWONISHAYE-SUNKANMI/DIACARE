import { AlertTriangle, X } from 'lucide-react';
import React, { useState } from 'react';

type PredictiveCardProps = {
  cancelable?: boolean;
  visible: boolean;
  setVisible: (v: boolean) => void;
};

const PredictiveCard: React.FC<PredictiveCardProps> = ({ cancelable, visible, setVisible }) => {

  if (!visible) return null;
  return (
    <div className="rounded-xl p-4 bg-destructive text-destructive-foreground space-y-2">
      <div className="flex items-center gap-2 font-bold text-lg w-full justify-between">
        <div className="flex gap-2 items-center ">
          <AlertTriangle className="w-5 h-5" />
          <span>Predictive Alert!</span>
        </div>
        {cancelable && (
          <button
            onClick={() => setVisible(false)}
            className="absolute top-2 right-2 p-1 rounded hover:bg-destructive-foreground/10"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-sm">
        Risk of Hypoglycemia <span className="font-semibold">(prob=78%)</span>
      </p>
      <p className="text-sm">
        Forecast: BG may drop to <span className="font-bold">62 mg/dL</span> in
        25 min
      </p>
      <p className="text-sm font-medium">Suggestion: Re-check BG in 10 min</p>
    </div>
  );
};

export default PredictiveCard;
