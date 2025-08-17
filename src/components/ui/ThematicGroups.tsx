import GroupCard from './GroupCard';

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  moderator: string;
  color: string;
}

const ThematicGroups = () => {
  const groups: Group[] = [
    {
      id: 'newcomers',
      name: '🌱 Nouveaux Diabétiques',
      description: 'Support pour débuter',
      members: 143,
      moderator: 'Dr. Aminata',
      color: 'green'
    },
    {
      id: 'parents',
      name: '👨‍👩‍👧‍👦 Parents d\'Enfants Diabétiques',
      description: 'Conseils parentaux',
      members: 89,
      moderator: 'Infirmière Fatoumata',
      color: 'blue'
    },
    {
      id: 'nutrition',
      name: '🍽️ Nutrition Africaine',
      description: 'Cuisine locale adaptée',
      members: 267,
      moderator: 'Nutritionniste Koffi',
      color: 'orange'
    },
    {
      id: 'active',
      name: '🏃 Diabète & Sport',
      description: 'Activité physique',
      members: 198,
      moderator: 'Coach Moustapha',
      color: 'purple'
    }
  ];

  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-4">Groupes Thématiques</h3>
      {groups.map(group => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
};

export default ThematicGroups;