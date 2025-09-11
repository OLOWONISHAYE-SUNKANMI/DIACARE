import GroupCard from './GroupCard';
import { useTranslation } from 'react-i18next';

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  moderator: string;
  color: string;
}

const ThematicGroups = () => {
  const { t } = useTranslation();
  const groups: Group[] = [
    {
      id: 'newcomers',
      name: t('thematicGroups.groups.newcomers.name'), // 🌱 New Diabetics
      description: t('thematicGroups.groups.newcomers.description'), // Support for beginners
      members: 143,
      moderator: 'Dr. Aminata',
      color: 'green',
    },
    {
      id: 'parents',
      name: t('thematicGroups.groups.parents.name'), // 👨‍👩‍👧‍👦 Parents of Diabetic Children
      description: t('thematicGroups.groups.parents.description'), // Parental advice
      members: 89,
      moderator: 'Infirmière Fatoumata',
      color: 'blue',
    },
    {
      id: 'nutrition',
      name: t('thematicGroups.groups.nutrition.name'), // 🍽️ African Nutrition
      description: t('thematicGroups.groups.nutrition.description'), // Local cuisine adapted
      members: 267,
      moderator: 'Nutritionniste Koffi',
      color: 'orange',
    },
    {
      id: 'active',
      name: t('thematicGroups.groups.active.name'), // 🏃 Diabetes & Sports
      description: t('thematicGroups.groups.active.description'), // Physical activity
      members: 198,
      moderator: 'Coach Moustapha',
      color: 'purple',
    },
  ];

  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-4">
        {t('thematicGroups.community.groupsTitle')}
      </h3>

      {groups.map(group => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
};

export default ThematicGroups;
