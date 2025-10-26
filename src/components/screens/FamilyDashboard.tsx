import React, { Suspense, useState, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Layout from '@/layouts/Layout';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Import screens (same as patient)
import HomeScreen from '@/components/screens/HomeScreen';
import DosesScreen from '@/components/screens/DosesScreen';
import ProfileScreen from '@/components/screens/ProfileScreen';
import DiabetesMonitoringApp from '@/components/screens/DiabetesMonitoringApp';
import Biomarkers from './Biomarkers ';
import PredictiveAlertScreen from '@/components/screens/PredictiveAlertScreen';

// Lazy load non-critical
const ChartsScreen = React.lazy(
  () => import('@/components/screens/ChartsScreen')
);
const BlogScreen = React.lazy(() => import('@/components/screens/BlogScreen'));
const JournalScreen = React.lazy(
  () => import('@/components/screens/JournalScreen')
);

const FamilyDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('home');
  const [glucoseValue, setGlucoseValue] = useState(126);
  const [carbValue, setCarbValue] = useState(45);
  const [showAlert, setShowAlert] = useState(true);
  const [loading, setLoading] = useState(true);

  // Family member data
  const [familyMemberId, setFamilyMemberId] = useState<string | null>(null);
  const [patientUserId, setPatientUserId] = useState<string | null>(null);
  const [permissionLevel, setPermissionLevel] = useState<
    'read_only' | 'full_access'
  >('read_only');
  const [hasAccess, setHasAccess] = useState(false);
  const [patientData, setPatientData] = useState<any>(null);

  useEffect(() => {
    checkFamilyAccess();
  }, []);

  const checkFamilyAccess = async () => {
    setLoading(true);

    try {
      // Get family member ID from localStorage
      const storedFamilyMemberId = localStorage.getItem('family_member_id');

      if (!storedFamilyMemberId) {
        toast({
          title: 'Access Required',
          description: 'Please sign in as a family member first.',
          variant: 'destructive',
        });
        navigate('/auth');
        return;
      }

      setFamilyMemberId(storedFamilyMemberId);

      // Get approved access requests for this family member
      // Use a looser "any" typing for this query to avoid deeply nested TypeScript
      // instantiation errors from the generated Supabase types while keeping
      // the runtime query intact.
      const accessRes = await supabase
        .from<any>('access_requests')
        .select(
          `
          *,
          profiles:patient_user_id (
            user_id,
            first_name,
            last_name,
            email,
            phone
          )
        `
        )
        .eq('family_member_id', storedFamilyMemberId)
        .eq('status', 'approved')
        .order('responded_at', { ascending: false });

      const accessRequests = accessRes.data as any;
      const accessError = accessRes.error;

      if (accessError) throw accessError;

      if (!accessRequests || accessRequests.length === 0) {
        toast({
          title: 'No Access',
          description: "You don't have access to any patient profiles yet.",
          variant: 'destructive',
        });
        navigate('/auth');
        return;
      }

      // Use the first approved access (you can add patient selection later)
      const access = accessRequests[0];
      setPatientUserId(access.patient_user_id);
      setPermissionLevel(access.permission_level);
      setPatientData(access.profiles);
      setHasAccess(true);

      // Log access
      await supabase.rpc('log_family_access', {
        p_family_member_id: storedFamilyMemberId,
        p_patient_user_id: access.patient_user_id,
        p_access_type: 'dashboard',
        p_action: 'view',
      });
    } catch (error: any) {
      console.error('Error checking access:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify access permissions',
        variant: 'destructive',
      });
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const canEdit = permissionLevel === 'full_access';

  const renderScreen = () => {
    if (!hasAccess || !patientUserId) {
      return <LoadingSpinner fullScreen text="Loading patient data..." />;
    }

    // Pass permission info to screens
    const screenProps = {
      isReadOnly: !canEdit,
      familyMemberId,
      patientUserId,
    };

    switch (activeTab) {
      case 'home':
        return <HomeScreen onTabChange={setActiveTab} {...screenProps} />;

      case 'doses':
        return (
          <DosesScreen
            glucoseValue={glucoseValue}
            setGlucoseValue={canEdit ? setGlucoseValue : () => {}}
            carbValue={carbValue}
            setCarbValue={canEdit ? setCarbValue : () => {}}
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            isReadOnly={!canEdit}
          />
        );

      case 'insulin':
        return <DiabetesMonitoringApp {...screenProps} />;

      case 'biomarker':
        return <Biomarkers {...screenProps} />;

      case 'predictive':
        return <PredictiveAlertScreen values={glucoseValue} {...screenProps} />;

      case 'charts':
        return (
          <Suspense
            fallback={<LoadingSpinner fullScreen text="Loading charts..." />}
          >
            <ChartsScreen {...screenProps} />
          </Suspense>
        );

      case 'blog':
        return (
          <Suspense
            fallback={<LoadingSpinner fullScreen text="Loading blog..." />}
          >
            <BlogScreen {...screenProps} />
          </Suspense>
        );

      case 'journal':
        return (
          <Suspense
            fallback={<LoadingSpinner fullScreen text="Loading journal..." />}
          >
            <JournalScreen
              showAlert={showAlert}
              setShowAlert={setShowAlert}
              isReadOnly={!canEdit}
              {...screenProps}
            />
          </Suspense>
        );

      // Restricted screens for family members
      case 'profile':
        return (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">
              You cannot view the patient's profile settings.
            </p>
          </div>
        );

      case 'chat':
        return (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">
              Group chat is not available for family members.
            </p>
          </div>
        );

      default:
        return <HomeScreen onTabChange={setActiveTab} {...screenProps} />;
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Verifying access..." />;
  }

  return (
    <div className="relative">
      {/* Read-Only Banner */}
      {!canEdit && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black px-4 py-2 text-center text-sm font-medium">
          👁️ Read-Only Access - You can view but not edit{' '}
          {patientData?.first_name}'s data
        </div>
      )}

      {/* Family Member Info Banner */}
      <div
        className={`fixed ${
          !canEdit ? 'top-10' : 'top-0'
        } left-0 right-0 z-40 bg-blue-500 text-white px-4 py-2 text-center text-xs`}
      >
        Viewing {patientData?.first_name} {patientData?.last_name}'s Dashboard
      </div>

      <div className={!canEdit ? 'pt-20' : 'pt-10'}>
        <Layout
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isFamilyMember={true}
        >
          {renderScreen()}
        </Layout>
      </div>
    </div>
  );
};

export default FamilyDashboard;
