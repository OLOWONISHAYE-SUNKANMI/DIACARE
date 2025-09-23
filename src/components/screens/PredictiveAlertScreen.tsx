import { AlertTriangle, Activity, Utensils, Syringe } from 'lucide-react';
import PredictiveCard from '../ui/PredictiveCard';

export default function PredictiveAlertScreen({ values }: any) {
  return (
    <div className="min-h-screen bg-muted text-foreground p-4 space-y-4">
      {/* Header */}
      <h1 className="text-lg font-semibold text-center">Kluko</h1>

      {/* Predictive Alert Card */}
      <PredictiveCard
        values={values}
        cancelable={false}
        visible={true}
        setVisible={null}
      />

      {/* Current BG */}
      <div className="rounded-xl bg-card text-card-foreground p-4 text-center space-y-1">
        <p className="text-sm font-medium">Current BG</p>
        <p className="text-4xl font-bold">
          135 <span className="text-base font-normal">mg/dL</span>
        </p>
      </div>

      {/* Enter Food */}
      <div className="rounded-xl bg-card text-card-foreground p-4 space-y-3">
        <p className="text-sm font-medium">Enter Food</p>
        <div className="flex gap-3">
          <div className="flex-1 rounded-lg border border-border p-3 text-center space-y-1">
            <Utensils className="w-5 h-5 mx-auto text-muted-foreground" />
            <p className="text-sm font-semibold">Rice</p>
            <p className="text-xs text-muted-foreground">40g carbs</p>
          </div>
          <div className="flex-1 rounded-lg border border-border p-3 text-center space-y-1">
            <Syringe className="w-5 h-5 mx-auto text-muted-foreground" />
            <p className="text-sm font-semibold">Rapid</p>
            <p className="text-xs text-muted-foreground">5 units</p>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="rounded-xl bg-card text-card-foreground p-4 space-y-1">
        <p className="text-sm font-medium">Activity</p>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <span className="text-sm">Yes Moderate 30 min</span>
        </div>
      </div>

      {/* Predictive AI Alerts */}
      <div className="rounded-xl bg-card text-card-foreground p-4 space-y-2">
        <p className="text-sm font-medium">Predictive AI Alerts</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <span>Status: Monitoring...</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <span>
            Next 30 min forecast: Stable (
            <span className="text-muted-foreground">↓ 2 mg/dL</span>)
          </span>
        </div>
      </div>
    </div>
  );
}
