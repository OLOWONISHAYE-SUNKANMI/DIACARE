import { Trophy } from 'lucide-react';

interface ProgressMessageProps {
  data: {
    achievement: string;
    description: string;
  };
}

const ProgressMessage = ({ data }: ProgressMessageProps) => (
  <div className="bg-warning/10 p-3 rounded-lg mb-2 border border-warning/20">
    <div className="flex items-center gap-2 mb-2">
      <Trophy className="w-4 h-4 text-warning" />
      <span className="font-semibold text-warning">Célébration</span>
    </div>
    <div className="text-sm text-foreground">
      <strong className="text-warning">{data.achievement}</strong>
      <br />
      {data.description}
    </div>
  </div>
);

export default ProgressMessage;