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
  Plus,
  BookOpen,
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
import { useThemeStore } from '@/store/useThemeStore';
import { EmergencyContactModal } from '../modals/EmergencyContactModal';
import { useMedications } from '@/contexts/MedicationContext';
import { AddEmergencyContactModal } from '../modals/AddEmergencyContactModal';

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

  const [emergencyForm, setEmergencyForm] = useState({
    emergency_contact_name: profile?.emergency_contact_name || '',
    emergency_contact_phone: profile?.emergency_contact_phone || '',
  });
  const [addContact, setAddConntact] = useState({
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  const { medications, loading: medsLoading } = useMedications();

  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

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
      dob: form.dob,
      profession: form.professon,
      city: form.city,
    });

    setLoading(false);

    if (error) {
      toast.error('Failed to update profile');
      return false;
    } else {
      toast.success('Profile updated successfully');
      return true;
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
                Date of birth
              </span>
              <p className="font-medium">
               {profile.dob || ""}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">
                Age
              </span>
              <p className="font-medium">
                49 years old
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">
               City
              </span>
              <p className="font-medium">
                {profile.city || ""}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">
                profession
              </span>
              <p className="font-medium">
                {profile.profession || ""}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-medical-teal">
        <div className="flex justify-between items-center w-full">
          <CardHeader className="flex justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-medical-teal" />
              {'User Guide'}
            </CardTitle>
          </CardHeader>
        </div>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Download the user guide in your preferred language:
          </p>

          <div className="flex gap-3">
            {/* French PDF */}
            <Button
              variant="secondary"
              asChild
              // className="bg-medical-teal hover:bg-medical-teal/90 text-white"
            >
              <a
                href="/pdfs/Guide du Diabète.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
                
              >
                 Download (FR)
              </a>
            </Button>

            {/* English PDF */}
            <Button
              variant="secondary"
              asChild
              // className="bg-medical-green  hover:bg-medical-green/90 text-white"
            >
              <a
                href="/pdfs/Diabetes Guide.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
              >
             Download (EN)
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Équipe Médicale */}
      {/* <Card className="border-l-4 border-l-medical-teal">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-medical-teal" />
            {t('profileScreen.medicalTeam')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="font-medium">Dr. Mamadou Kane</div>
            <div className="text-sm text-muted-foreground">
              {t('profileScreen.doctor')}
            </div>
            <div className="text-sm">📞 +221 33 825 14 52</div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="font-medium">CHU Aristide Le Dantec</div>
            <div className="text-sm text-muted-foreground">
              {t('profileScreen.followUpCenter')}
            </div>
            <div className="text-sm text-muted-foreground">
              📍 Dakar, Sénégal
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="font-medium">Dr. Aminata Sow</div>
            <div className="text-sm text-muted-foreground">
              {t('profileScreen.consultant')}
            </div>
            <div className="text-sm text-muted-foreground">
              🏥 Polyclinique du Point E
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Current treatment */}
      {/* Current Treatment */}
      <Card className="border-l-4 border-l-medical-teal">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Pill className="w-5 h-5 text-medical-teal" />
            Current Treatment
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {medsLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : medications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No medications set</p>
          ) : (
            medications.map(med => (
              <div key={med.id}>
                <span className="text-muted-foreground text-sm">
                  {med.medication_name} • {med.dose}
                  {med.dose_unit}
                </span>
                <p className="font-medium">
                  {med.injection_done ? 'Injected' : 'Not injected'}
                  {med.injection_done && med.injection_site
                    ? ', ' + med.injection_site
                    : ''}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(med.medication_time).toLocaleString()}
                </p>
                <Separator />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Energency Contact */}
      <Card className="border-l-4 border-l-red-500 bg-red-50">
        <div className="flex justify-between items-start w-full">
          {/* Left side: icon + title */}
          <CardHeader className="flex items-center gap-2">
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <Phone className="w-5 h-5" />
              {t('profileScreen.emergencyContact')}
            </CardTitle>
          </CardHeader>

          {/* Right side: edit icon */}
          <CardHeader className="ml-auto mt-1 flex gap-2 flex-row items-center ">
            <EmergencyContactModal
              form={emergencyForm}
              loading={false}
              handleChange={(field, value) =>
                setEmergencyForm(prev => ({ ...prev, [field]: value }))
              }
              handleUpdateProfile={async e => {
                e.preventDefault();
                const { error } = await updateProfile({
                  emergency_contact_name: emergencyForm.emergency_contact_name,
                  emergency_contact_phone:
                    emergencyForm.emergency_contact_phone,
                });

                if (!error) {
                  toast.success('Profile updated successfully');
                } else {
                  toast.error('Failed to update profile');
                }

                return !error;
              }}
              trigger={<Pencil className="w-4 h-4 cursor-pointer" />}
            />
            <AddEmergencyContactModal
              form={addContact}
              loading={false}
              handleChange={(field, value) =>
                setAddConntact(prev => ({ ...prev, [field]: value }))
              }
              handleUpdateProfile={async e => {
                e.preventDefault();
                // const { error } = await updateProfile({
                //   emergency_contact_name: addContact.emergency_contact_name,
                //   emergency_contact_phone: addContact.emergency_contact_phone,
                // });
                

                // if (!error) {
                  toast.success('Profile updated successfully');
                // } else {
                //   toast.error('Failed to update profile');
                // }
                setAddConntact({
                  emergency_contact_name: '',
                  emergency_contact_phone: '',
                });

                return ;
              }}
              trigger={<Plus className="w-4 h-4 cursor-pointer" />}
            />
          </CardHeader>
        </div>

        {/* Content */}
        <CardContent className="space-y-3 pt-2">
          <div>
            <div className="font-medium text-red-700">
              {emergencyForm.emergency_contact_name ||
                t('profileScreen.notSet')}
            </div>
            <div className="text-sm text-red-600">
              {emergencyForm.emergency_contact_phone ||
                t('profileScreen.notSet')}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <PhoneCall className="w-4 h-4 mr-1" />
              {t('profileScreen.call')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              {t('profileScreen.sms')}
            </Button>
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
              onChange={toggleTheme}
              checked={isDark} // ✅ must be true or false
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

      {/* Boutons Actions */}
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
