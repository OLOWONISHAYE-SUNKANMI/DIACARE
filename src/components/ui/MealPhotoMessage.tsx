import { Utensils } from 'lucide-react';

interface MealPhotoMessageProps {
  data: {
    photo: string;
    carbs: number;
    description?: string;
  };
}

const MealPhotoMessage = ({ data }: MealPhotoMessageProps) => (
  <div className="mb-2">
    <div className="flex items-center gap-2 mb-2">
      <Utensils className="w-4 h-4 text-medical-green" />
      <span className="font-semibold text-medical-green">Repas diabète-friendly</span>
    </div>
    <img 
      src={data.photo} 
      alt="Repas partagé"
      className="w-full rounded-lg mb-2 max-h-48 object-cover" 
    />
    <div className="bg-medical-green-light p-2 rounded text-sm">
      <span className="font-semibold text-medical-green">Glucides estimés:</span> 
      <span className="text-foreground"> {data.carbs}g</span>
    </div>
    {data.description && (
      <div className="text-sm mt-1 text-foreground">{data.description}</div>
    )}
  </div>
);

export default MealPhotoMessage;