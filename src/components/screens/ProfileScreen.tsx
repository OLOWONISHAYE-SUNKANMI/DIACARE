// import { useEffect, useState } from 'react';
// import {
//   User,
//   Phone,
//   MapPin,
//   Calendar,
//   Users,
//   Pill,
//   Settings,
//   Download,
//   Shield,
//   MessageSquare,
//   PhoneCall,
//   LogOut,
//   Scale,
//   Camera,
// } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import { useTranslation } from 'react-i18next';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
// import PhotoUploadModal from '@/components/modals/PhotoUploadModal';
// import WeightModal from '@/components/modals/WeightModal';
// import ReactSwitch from 'react-switch';

// interface ProfileScreenProps {}

// const ProfileScreen = (props: ProfileScreenProps) => {
//   const { t } = useTranslation();
//   const [notifications, setNotifications] = useState(true);
//   const [dataSharing, setDataSharing] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
//   const [weight, setWeight] = useState<number>(75.2);
//   const { signOut } = useAuth();

//   const { profile } = useAuth();
//   const { user } = useAuth();

//   // useEffect(() => {
//   //   console.log('Full user object:', user);
//   //   console.log('Profile data:', profile);
//   // }, [user]);

//   return (
//     <div className="flex-1 p-4 space-y-6 pb-24 animate-fade-in">
//       {/* Header Profil */}
//       <div className="text-center space-y-4">
//         <div className="relative">
//           <PhotoUploadModal
//             currentPhoto={profilePhoto}
//             onPhotoChange={setProfilePhoto}
//           >
//             <Avatar className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-400 to-gray-600 cursor-pointer hover:opacity-80 transition-opacity">
//               {profilePhoto ? (
//                 <AvatarImage src={profilePhoto} alt="Photo de profil" />
//               ) : (
//                 <AvatarFallback className="text-2xl text-white bg-transparent">
//                   👨
//                 </AvatarFallback>
//               )}
//             </Avatar>
//           </PhotoUploadModal>
//           <Button
//             size="sm"
//             className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
//             asChild
//           >
//             <PhotoUploadModal
//               currentPhoto={profilePhoto}
//               onPhotoChange={setProfilePhoto}
//             >
//               <span>
//                 <Camera className="w-4 h-4" />
//               </span>
//             </PhotoUploadModal>
//           </Button>
//         </div>

//         <div className="space-y-2">
//           <h1 className="text-2xl font-bold text-foreground">Amadou Diallo</h1>
//           <p className="text-muted-foreground">Diabète Type 2 • Depuis 2019</p>

//           <div className="flex gap-2 justify-center flex-wrap">
//             <Badge
//               variant="default"
//               className="bg-green-100 text-green-800 border-green-200"
//             >
//               {t('profileScreen.verified')}
//             </Badge>
//             <Badge
//               variant="default"
//               className="bg-medical-teal/10 text-medical-teal border-medical-teal/30"
//             >
//               {t('homeScreen.completePlan')}
//             </Badge>
//           </div>
//         </div>
//       </div>

//       {/* Statistiques rapides avec poids */}
//       <div className="grid grid-cols-3 gap-3">
//         <Card className="text-center p-3">
//           <CardContent className="p-0">
//             <div className="text-2xl font-bold text-medical-teal">6</div>
//             <div className="text-xs text-muted-foreground">
//               {t('profileScreen.yearsWithDare')}
//             </div>
//           </CardContent>
//         </Card>
//         <WeightModal currentWeight={weight} onWeightChange={setWeight}>
//           <Card className="text-center p-3 cursor-pointer hover:bg-muted/50 transition-colors">
//             <CardContent className="p-0">
//               <div className="text-2xl font-bold text-medical-teal flex items-center justify-center gap-1">
//                 <Scale className="w-5 h-5" />
//                 {weight}
//               </div>
//               <div className="text-xs text-muted-foreground">kg • Poids</div>
//             </CardContent>
//           </Card>
//         </WeightModal>
//         <Card className="text-center p-3">
//           <CardContent className="p-0">
//             <div className="text-2xl font-bold text-medical-teal">91%</div>
//             <div className="text-xs text-muted-foreground">
//               {t('profileScreen.adherence')}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Informations Personnelles */}
//       <Card className="border-l-4 border-l-medical-teal">
//         <CardHeader>
//           <CardTitle className="text-lg flex items-center gap-2">
//             <User className="w-5 h-5 text-medical-teal" />
//             {t('profileScreen.personalInfo')}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <div className="grid grid-cols-2 gap-4 text-sm">
//             <div>
//               <span className="text-muted-foreground">
//                 {t('profileScreen.fullName')}
//               </span>
//               <p className="font-medium">Amadou Diallo</p>
//             </div>
//             <div>
//               <span className="text-muted-foreground">
//                 {t('profileScreen.dateOfBirth')}
//               </span>
//               <p className="font-medium">15 Mars 1975</p>
//             </div>
//             <div>
//               <span className="text-muted-foreground">
//                 {t('profileScreen.age')}
//               </span>
//               <p className="font-medium">49 {t('profileScreen.years')}</p>
//             </div>
//             <div>
//               <span className="text-muted-foreground">
//                 {t('profileScreen.phone')}
//               </span>
//               <p className="font-medium">+221 77 123 45 67</p>
//             </div>
//             <div>
//               <span className="text-muted-foreground">
//                 {t('profileScreen.city')}
//               </span>
//               <p className="font-medium">Dakar, Sénégal</p>
//             </div>
//             <div>
//               <span className="text-muted-foreground">
//                 {t('profileScreen.profession')}
//               </span>
//               <p className="font-medium">Enseignant</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Équipe Médicale */}
//       <Card className="border-l-4 border-l-medical-teal">
//         <CardHeader>
//           <CardTitle className="text-lg flex items-center gap-2">
//             <Users className="w-5 h-5 text-medical-teal" />
//             {t('profileScreen.medicalTeam')}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <div className="font-medium">Dr. Mamadou Kane</div>
//             <div className="text-sm text-muted-foreground">
//               {t('profileScreen.doctor')}
//             </div>
//             <div className="text-sm">📞 +221 33 825 14 52</div>
//           </div>

//           <Separator />

//           <div className="space-y-2">
//             <div className="font-medium">CHU Aristide Le Dantec</div>
//             <div className="text-sm text-muted-foreground">
//               {t('profileScreen.followUpCenter')}
//             </div>
//             <div className="text-sm text-muted-foreground">
//               📍 Dakar, Sénégal
//             </div>
//           </div>

//           <Separator />

//           <div className="space-y-2">
//             <div className="font-medium">Dr. Aminata Sow</div>
//             <div className="text-sm text-muted-foreground">
//               {t('profileScreen.consultant')}
//             </div>
//             <div className="text-sm text-muted-foreground">
//               🏥 Polyclinique du Point E
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Traitement Actuel */}
//       <Card className="border-l-4 border-l-medical-teal">
//         <CardHeader>
//           <CardTitle className="text-lg flex items-center gap-2">
//             <Pill className="w-5 h-5 text-medical-teal" />
//             {t('profileScreen.currentTreatment')}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <div>
//             <span className="text-muted-foreground text-sm">
//               {t('profileScreen.insulins')}
//             </span>
//             <p className="font-medium">
//               Lantus 20UI matin • Humalog selon glycémie
//             </p>
//             <p className="text-xs text-muted-foreground">
//               {t('profileScreen.keepCool')}
//             </p>
//           </div>
//           <div>
//             <span className="text-muted-foreground text-sm">
//               {t('profileScreen.oralMedications')}
//             </span>
//             <p className="font-medium">Metformine 1000mg 2x/j</p>
//             <p className="text-xs text-muted-foreground">
//               {t('profileScreen.price')}: 2,500 F CFA/mois
//             </p>
//           </div>
//           <div>
//             <span className="text-muted-foreground text-sm">
//               {t('profileScreen.glucoseTarget')}
//             </span>
//             <p className="font-medium">70-140 mg/dL (norme UEMOA)</p>
//             <p className="text-xs text-muted-foreground">
//               {t('profileScreen.adaptedClimate')}
//             </p>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Contact d'urgence */}
//       <Card className="border-l-4 border-l-red-500 bg-red-50">
//         <CardHeader>
//           <CardTitle className="text-lg flex items-center gap-2 text-red-700">
//             <Phone className="w-5 h-5" />
//             {t('profileScreen.emergencyContact')}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <div>
//             <div className="font-medium text-red-700">
//               Fatou Diop ({t('profileScreen.spouse')})
//             </div>
//             <div className="text-sm text-red-600">+221 77 987 65 43</div>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               size="sm"
//               className="bg-red-600 hover:bg-red-700 text-white"
//             >
//               <PhoneCall className="w-4 h-4 mr-1" />
//               {t('profileScreen.call')}
//             </Button>
//             <Button
//               size="sm"
//               variant="outline"
//               className="border-red-600 text-red-600 hover:bg-red-50"
//             >
//               <MessageSquare className="w-4 h-4 mr-1" />
//               {t('profileScreen.sms')}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Paramètres */}
//       <Card className="border-l-4 border-l-medical-teal">
//         <CardHeader>
//           <CardTitle className="text-lg flex items-center gap-2">
//             <Settings className="w-5 h-5 text-medical-teal" />
//             {t('profileScreen.settings')}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {/* Notifications */}
//           <div className="flex items-center justify-between">
//             <span className="text-sm font-medium">
//               {t('profileScreen.notifications')}
//             </span>
//             <ReactSwitch
//               onChange={setNotifications}
//               checked={notifications}
//               onColor="#14b8a6" // teal-500
//               offColor="#d1d5db" // gray-300
//               uncheckedIcon={false}
//               checkedIcon={false}
//               height={20}
//               width={40}
//               handleDiameter={18}
//             />
//           </div>

//           {/* Data Sharing */}
//           <div className="flex items-center justify-between">
//             <span className="text-sm font-medium">
//               {t('profileScreen.dataSharing')}
//             </span>
//             <ReactSwitch
//               onChange={setDataSharing}
//               checked={dataSharing}
//               onColor="#14b8a6"
//               offColor="#d1d5db"
//               uncheckedIcon={false}
//               checkedIcon={false}
//               height={20}
//               width={40}
//               handleDiameter={18}
//             />
//           </div>

//           {/* Dark Mode */}
//           <div className="flex items-center justify-between">
//             <span className="text-sm font-medium">
//               {t('profileScreen.darkMode')}
//             </span>
//             <ReactSwitch
//               onChange={setDarkMode}
//               checked={darkMode}
//               onColor="#14b8a6"
//               offColor="#d1d5db"
//               uncheckedIcon={false}
//               checkedIcon={false}
//               height={20}
//               width={40}
//               handleDiameter={18}
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Boutons Actions */}
//       <div className="space-y-3">
//         <Button variant="outline" className="w-full">
//           <User className="w-4 h-4 mr-2" />
//           {t('profileScreen.editProfile')}
//         </Button>
//         <Button variant="outline" className="w-full">
//           <Download className="w-4 h-4 mr-2" />
//           {t('profileScreen.exportData')}
//         </Button>
//         <Button variant="outline" className="w-full">
//           <Shield className="w-4 h-4 mr-2" />
//           {t('profileScreen.privacy')}
//         </Button>
//         <Button variant="destructive" className="w-full" onClick={signOut}>
//           <LogOut className="w-4 h-4 mr-2" />
//           {t('profileScreen.signOut')}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ProfileScreen;

import { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Users,
  Pill,
  Settings,
  Download,
  Shield,
  MessageSquare,
  PhoneCall,
  LogOut,
  Scale,
  Camera,
  Pencil,
} from 'lucide-react';
import { Profile, useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PhotoUploadModal from '@/components/modals/PhotoUploadModal';
import WeightModal from '@/components/modals/WeightModal';
import ReactSwitch from 'react-switch';
import { toast } from 'sonner';
import { EditProfileModal } from '../modals/EditProfileModal';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const { profile, signOut, updateProfile } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [weight, setWeight] = useState<number>(75.2);
  const [form, setForm] = useState<Partial<Profile>>({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    specialty: profile?.specialty || '',
    professional_license: profile?.professional_license || '',
  });

  const [loading, setLoading] = useState(false);

  if (!profile) {
    return <div className="p-4">{t('profileScreen.loading')}</div>;
  }

  const handleUpdateProfile = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<boolean> => {
    e.preventDefault();
    setLoading(true);

    const { error } = await updateProfile({
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
      specialty: form.specialty,
      professional_license: form.professional_license,
    });

    setLoading(false);

    if (error) {
      toast.error('Failed to update profile');
      return false; // ❌ failure
    } else {
      toast.success('Profile updated successfully');
      return true; // ✅ success
    }
  };

  const handleChange = (field: keyof Profile, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex-1 p-4 space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="relative">
          <PhotoUploadModal
            currentPhoto={profilePhoto}
            onPhotoChange={setProfilePhoto}
          >
            <Avatar className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-400 to-gray-600 cursor-pointer hover:opacity-80 transition-opacity">
              {profilePhoto ? (
                <AvatarImage src={profilePhoto} alt="Profile" />
              ) : (
                <AvatarFallback className="text-2xl text-white bg-transparent">
                  {profile.first_name?.[0]}
                  {profile.last_name?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
          </PhotoUploadModal>
          <Button
            size="sm"
            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
            asChild
          >
            <PhotoUploadModal
              currentPhoto={profilePhoto}
              onPhotoChange={setProfilePhoto}
            >
              <span>
                <Camera className="w-4 h-4" />
              </span>
            </PhotoUploadModal>
          </Button>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {profile.first_name} {profile.last_name}
          </h1>
          <div className="flex gap-2 justify-center flex-wrap">
            {profile?.verified ? (
              <Badge
                variant="default"
                className="bg-green-100 text-green-800 border-green-200"
              >
                {t('profileScreen.verified')}
              </Badge>
            ) : (
              <Badge
                variant="default"
                className="bg-red-100 text-red-700 border-red-200"
              >
                {t('profileScreenFixes.status_unverifiedProfile')}
              </Badge>
            )}

            <Badge
              variant="default"
              className="bg-medical-teal/10 text-medical-teal border-medical-teal/30"
            >
              {t('homeScreen.completePlan')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center p-3">
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-medical-teal">6</div>
            <div className="text-xs text-muted-foreground">
              {t('profileScreen.yearsWithDare')}
            </div>
          </CardContent>
        </Card>

        <WeightModal currentWeight={weight} onWeightChange={setWeight}>
          <Card className="text-center p-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-medical-teal flex items-center justify-center gap-1">
                <Scale className="w-5 h-5" />
                {weight}
              </div>
              <div className="text-xs text-muted-foreground">
                kg • {t('profileScreenFixes.label_weight')}
              </div>
            </CardContent>
          </Card>
        </WeightModal>

        <Card className="text-center p-3">
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-medical-teal">91%</div>
            <div className="text-xs text-muted-foreground">
              {t('profileScreen.adherence')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Info */}
      <Card className="border-l-4 border-l-medical-teal">
        <div className="flex justify-between items-center w-full">
          <CardHeader className="flex  justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-medical-teal" />
              {t('profileScreen.personalInfo')}
            </CardTitle>
          </CardHeader>
          <CardHeader>
            <EditProfileModal
              form={form}
              loading={loading}
              handleChange={handleChange}
              handleUpdateProfile={handleUpdateProfile}
              trigger={<Pencil className="w-4 h-4 cursor-pointer" />}
            />
          </CardHeader>
        </div>

        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">
                {t('profileScreen.fullName')}
              </span>
              <p className="font-medium">
                {profile.first_name} {profile.last_name}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">
                {t('profileScreen.phone')}
              </span>
              <p className="font-medium">
                {profile.phone || t('profileScreen.notSet')}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">
                {t('profileScreenFixes.label_professionalLicense')}
              </span>
              <p className="font-medium">
                {profile.professional_license || t('profileScreen.notSet')}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">
                {t('profileScreenFixes.label_specialty')}
              </span>
              <p className="font-medium">
                {profile.specialty || t('profileScreen.notSet')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="border-l-4 border-l-medical-teal">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5 text-medical-teal" />
            {t('profileScreen.settings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {t('profileScreen.notifications')}
            </span>
            <ReactSwitch
              onChange={setNotifications}
              checked={notifications}
              onColor="#14b8a6"
              offColor="#d1d5db"
              uncheckedIcon={false}
              checkedIcon={false}
              height={20}
              width={40}
              handleDiameter={18}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {t('profileScreen.dataSharing')}
            </span>
            <ReactSwitch
              onChange={setDataSharing}
              checked={dataSharing}
              onColor="#14b8a6"
              offColor="#d1d5db"
              uncheckedIcon={false}
              checkedIcon={false}
              height={20}
              width={40}
              handleDiameter={18}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {t('profileScreen.darkMode')}
            </span>
            <ReactSwitch
              onChange={setDarkMode}
              checked={darkMode}
              onColor="#14b8a6"
              offColor="#d1d5db"
              uncheckedIcon={false}
              checkedIcon={false}
              height={20}
              width={40}
              handleDiameter={18}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full">
          <User className="w-4 h-4 mr-2" />
          {t('profileScreen.editProfile')}
        </Button>
        <Button variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          {t('profileScreen.exportData')}
        </Button>
        <Button variant="outline" className="w-full">
          <Shield className="w-4 h-4 mr-2" />
          {t('profileScreen.privacy')}
        </Button>
        <Button variant="destructive" className="w-full" onClick={signOut}>
          <LogOut className="w-4 h-4 mr-2" />
          {t('profileScreen.signOut')}
        </Button>
      </div>
    </div>
  );
};

export default ProfileScreen;
