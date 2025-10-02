'use client';

import { useEffect } from 'react';
import {
  Share2,
  Users,
  Phone,
  CheckCircle,
  AlertTriangle,
  Eye,
  Settings,
  Clock,
  UserPlus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFamily } from '@/contexts/FamilyContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';




const FamilyScreen = () => {
  const { t } = useTranslation();
  const { accessCode, getAccessCode, loading } = useFamily();
  const { toast } = useToast();

  useEffect(() => {
    getAccessCode();
  }, []);

  const handleCopy = () => {
    if (!accessCode) return;
    navigator.clipboard.writeText(accessCode);
    toast({
      title: t('toastMessage.copy'),
      description: t('toastMessage.copyDescription'),
    });
  };

  const familyMembers = [
  {
    id: 1,
    name: 'Fatou Diop',
    role: t('familyScreen.familyMembers.patientOne.role'),
    permission: t('familyScreen.familyMembers.patientOne.permission'),
    status: 'online',
    avatar: 'F',
    lastSeen: t('familyScreen.familyMembers.patientOne.lastSeen'),
    icon: CheckCircle,
    color: 'text-green-500',
    phone: '+221 77 987 65 43',
  },
  {
    id: 2,
    name: 'Dr. Mamadou Kane',
    role: t('familyScreen.familyMembers.patientTwo.role'),
    permission: t('familyScreen.familyMembers.patientTwo.permission'),
    status: 'emergency',
    avatar: 'Dr',
    lastSeen: t('familyScreen.familyMembers.patientTwo.lastSeen'),
    icon: AlertTriangle,
    color: 'text-orange-500',
    phone: '+221 33 825 14 52',
  },
  {
    id: 3,
    name: 'Ibrahim Diallo',
    role: t('familyScreen.familyMembers.patientThree.role'),
    permission: t('familyScreen.familyMembers.patientThree.permission'),
    status: 'readonly',
    avatar: 'I',
    lastSeen: t('familyScreen.familyMembers.patientThree.lastSeen'),
    icon: Eye,
    color: 'text-blue-500',
    phone: '+221 76 543 21 09',
  },
];




const recentActivity = [
  {
    id: 1,
    time: t('familyScreen.recentActivity.firstOne.time'),
    action: t('familyScreen.recentActivity.firstOne.action'),
    type: 'view',
    actor: 'Fatou',
  },
  {
    id: 2,
    time: t('familyScreen.recentActivity.secondOne.time'),
    action: t('familyScreen.recentActivity.secondOne.action'),
    type: 'medical',
    actor: 'Dr. Kane',
  },
  {
    id: 3,
    time: t('familyScreen.recentActivity.thirdOne.time'),
    action: t('familyScreen.recentActivity.thirdOne.action'),
    type: 'alert',
    actor: 'Ibrahim',
  },
  {
    id: 4,
    time: t('familyScreen.recentActivity.fourthOne.time'),
    action: t('familyScreen.recentActivity.fourthOne.action'),
    type: 'confirmation',
    actor: 'Fatou',
  },
];


  return (
    <div className="flex-1 p-4 space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-[#FFAB40] flex items-center justify-center gap-2">
          <Users className="w-6 h-6 text-medical-teal" />
          {t('familyScreen.heading.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('familyScreen.heading.subtitle')}
        </p>
      </div>

      {/* Access Code */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-yellow-800">
            <Share2 className="w-5 h-5" />
            {t('familyScreen.familySharingCode.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-3">
            <div className="text-3xl font-mono font-bold text-yellow-800 bg-yellow-100 rounded-lg p-4">
              {loading ? 'Loading...' : accessCode || '—'}
            </div>
            <p className="text-sm text-yellow-700">
              {t('familyScreen.familySharingCode.subtitle')}
            </p>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
              disabled={loading || !accessCode}
            >
             {t('familyScreen.familySharingCode.copyButton')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center p-3">
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-medical-teal">∞</div>
            <div className="text-xs text-muted-foreground">{t('familyScreen.numOfPatients.patients')}</div>
          </CardContent>
        </Card>
        <Card className="text-center p-3">
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-medical-teal">47</div>
            <div className="text-xs text-muted-foreground">{t('familyScreen.numOfPatients.first')}</div>
          </CardContent>
        </Card>
        <Card className="text-center p-3">
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-medical-teal">12</div>
            <div className="text-xs text-muted-foreground">{t('familyScreen.numOfPatients.second')}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-l-4 border-l-medical-teal">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-medical-teal" />
              {t('familyScreen.familyMembers.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {familyMembers.map((member, index) => (
            <div key={member.id}>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-medical-teal/10 text-medical-teal font-semibold">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {member.name}
                    </span>
                    <member.icon className={`w-4 h-4 ${member.color}`} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {member.role} • {member.permission}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {member.lastSeen}
                  </div>
                </div>

                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              {index < familyMembers.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activité récente */}
      <Card className="border-l-4 border-l-medical-teal">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-medical-teal" />
            {t('familyScreen.recentActivity.firstOne.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-medical-teal rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Boutons Actions */}
      <div className="space-y-3">
        <Button className="w-full bg-medical-teal hover:bg-medical-teal/90">
          <UserPlus className="w-4 h-4 mr-2" />
        {t('familyScreen.button1')}
        </Button>
        <Button variant="outline" className="w-full">
          <Settings className="w-4 h-4 mr-2" />
            {t('familyScreen.button2')}
        </Button>
      </div>

      {/* Emergency Contact */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <div className="font-medium text-red-700">
              {t('familyScreen.emergencyContact')}
            </div>
            <div className="text-sm text-red-600">
              Fatou Diop • +221 77 987 65 43
            </div>
          </div>
          <Button size="sm" className="bg-red-600 hover:bg-red-700">
            <Phone className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilyScreen;
