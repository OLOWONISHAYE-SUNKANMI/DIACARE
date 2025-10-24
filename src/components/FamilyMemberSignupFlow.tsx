import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useNavigate } from 'react-router-dom';

interface SignupForm {
  full_name: string;
  phone: string;
  profession: string;
  city: string;
  country: string;
  relation: string;
  patient_code: string;
}

export const FamilyMemberSignupFlow = () => {
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<SignupForm>({
    full_name: '',
    phone: '',
    profession: '',
    city: '',
    country: '',
    relation: '',
    patient_code: '',
  });
  const [otp, setOtp] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleChange = (field: keyof SignupForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.full_name ||
      !form.phone ||
      !form.patient_code ||
      !form.relation
    ) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (form.patient_code.length !== 8) {
      toast({
        title: 'Invalid Code',
        description: 'Patient code must be 8 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('generate_family_member_otp', {
        p_phone: form.phone,
        p_full_name: form.full_name,
        p_profession: form.profession || null,
        p_city: form.city || null,
        p_country: form.country || null,
        p_relation: form.relation,
        p_patient_code: form.patient_code.toUpperCase(),
      });

      if (error) throw error;

      type OtpResult = {
        success: boolean;
        error?: string;
        family_member_id?: string;
        otp?: string;
        expires_at?: string;
      };

      let result: OtpResult;
      if (typeof data === 'string') {
        result = JSON.parse(data);
      } else {
        result = data as OtpResult;
      }

      if (result.success) {
        toast({
          title: 'OTP Sent!',
          description: `A verification code has been sent to ${form.phone}`,
        });

        if (import.meta.env.DEV) {
          console.log('🔐 Test OTP:', result.otp);
          toast({
            title: 'Development Mode',
            description: `Your test OTP is: ${result.otp}`,
            duration: 10000,
          });
        }

        // Use setTimeout to ensure state update happens after current render
        setTimeout(() => {
          setStep('verify');
        }, 0);
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to send OTP',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter a 6-digit code',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('verify_family_member_otp', {
        p_phone: form.phone,
        p_otp: otp,
      });

      if (error) throw error;

      type VerifyResult = {
        success: boolean;
        error?: string;
        family_member_id?: string;
        message?: string;
        attempts_remaining?: number;
      };

      let result: VerifyResult;
      if (typeof data === 'string') {
        result = JSON.parse(data);
      } else {
        result = data as VerifyResult;
      }

      if (result.success) {
        localStorage.setItem('family_member_id', result.family_member_id!);
        localStorage.setItem('family_member_phone', form.phone);
        localStorage.setItem('family_member_name', form.full_name);

        toast({
          title: 'Success!',
          description: 'Your account has been verified. Welcome!',
        });

        navigate('/family-dashboard');
      } else {
        toast({
          title: 'Verification Failed',
          description: result.error || 'Invalid OTP',
          variant: 'destructive',
        });

        if (result.attempts_remaining !== undefined) {
          toast({
            title: 'Attempts Remaining',
            description: `You have ${result.attempts_remaining} attempts left`,
            variant: 'default',
          });
        }
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Verification failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setOtp('');

    try {
      const { data, error } = await supabase.rpc('generate_family_member_otp', {
        p_phone: form.phone,
        p_full_name: form.full_name,
        p_profession: form.profession || null,
        p_city: form.city || null,
        p_country: form.country || null,
        p_relation: form.relation,
        p_patient_code: form.patient_code.toUpperCase(),
      });

      if (error) throw error;

      type OtpResult = {
        success: boolean;
        otp?: string;
        error?: string;
      };

      let result: OtpResult;
      if (typeof data === 'string') {
        result = JSON.parse(data);
      } else {
        result = data as OtpResult;
      }

      if (result.success) {
        toast({
          title: 'New OTP Sent',
          description: 'Check your phone for the new code',
        });

        if (import.meta.env.DEV) {
          console.log('🔐 New Test OTP:', result.otp);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to resend OTP',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Render based on step - use key prop to force remount
  return (
    <div className="space-y-6" key={step}>
      {step === 'verify' ? (
        <>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Verify Your Phone Number</h3>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to {form.phone}
            </p>
          </div>

          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={loading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleVerifyOTP}
              className="w-full"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>

            <Button
              onClick={handleResendOTP}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              Resend OTP
            </Button>

            <Button
              onClick={() => {
                setStep('signup');
                setOtp('');
              }}
              variant="ghost"
              className="w-full"
              disabled={loading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Form
            </Button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="full_name"
              placeholder="Enter your full name"
              value={form.full_name}
              onChange={e => handleChange('full_name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+234..."
              value={form.phone}
              onChange={e => handleChange('phone', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relation">
              Relationship to Patient <span className="text-red-500">*</span>
            </Label>
            <Input
              id="relation"
              placeholder="e.g., Son, Daughter, Spouse, Friend"
              value={form.relation}
              onChange={e => handleChange('relation', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient_code">
              Patient Access Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="patient_code"
              placeholder="Enter 8-character code"
              value={form.patient_code}
              onChange={e =>
                handleChange('patient_code', e.target.value.toUpperCase())
              }
              maxLength={8}
              className="text-center font-mono text-lg"
              required
            />
            <p className="text-xs text-muted-foreground text-center">
              Code provided by the patient
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession (Optional)</Label>
            <Input
              id="profession"
              placeholder="Your profession"
              value={form.profession}
              onChange={e => handleChange('profession', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city">City (Optional)</Label>
              <Input
                id="city"
                placeholder="Your city"
                value={form.city}
                onChange={e => handleChange('city', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country (Optional)</Label>
              <Input
                id="country"
                placeholder="Your country"
                value={form.country}
                onChange={e => handleChange('country', e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
};
