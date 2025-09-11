import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ProfessionalCodeGenerator } from '@/utils/ProfessionalCodeGenerator';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { useTranslation } from 'react-i18next';

interface Professional {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  country: string;
  identificationCode: string;
  qrCode?: string;
  institution?: string;
  licenseNumber?: string;
  specialty?: string;
  approvedAt?: string;
}

interface ProfessionalCredentialsProps {
  professional: Professional;
  onCredentialsSent?: () => void;
}

export const ProfessionalCredentials: React.FC<
  ProfessionalCredentialsProps
> = ({ professional, onCredentialsSent }) => {
  const { t } = useTranslation();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generateQRCode();
  }, [professional.identificationCode]);

  const generateQRCode = async () => {
    if (!professional.identificationCode) return;

    setIsGeneratingQR(true);
    try {
      const qrData = {
        code: professional.identificationCode,
        name: professional.name,
        type: professional.type,
        country: professional.country,
        issuedDate: new Date().toISOString(),
        platform: 'DARE',
      };

      const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 256,
        margin: 2,
        color: {
          dark: '#059669', // emerald-600
          light: '#FFFFFF',
        },
      });

      setQrCodeDataUrl(qrCodeUrl);
    } catch (error) {
      console.error('Error generating QR-code', error);
      toast({
        title: `❌ ${t('professionalCredentials.qrcode.error_title')}`,
        description: t('professionalCredentials.qrcode.error_description'),
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const downloadCredentials = async () => {
    setIsDownloading(true);
    try {
      const pdf = new jsPDF();

      // Header
      pdf.setFillColor(5, 150, 105); // emerald-600
      pdf.rect(0, 0, 210, 40, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(t('professionalCredentials.certificate.title'), 105, 25, {
        align: 'center',
      });

      // Professional Info
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Dr. ${professional.name}`, 105, 60, { align: 'center' });

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${professional.type} - ${professional.country}`, 105, 70, {
        align: 'center',
      });

      // Identification Code
      pdf.setFillColor(240, 253, 244); // green-50
      pdf.rect(20, 90, 170, 30, 'F');
      pdf.setDrawColor(34, 197, 94); // green-500
      pdf.rect(20, 90, 170, 30, 'S');

      pdf.setTextColor(5, 150, 105);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Code d'Identification:", 105, 102, { align: 'center' });

      pdf.setFontSize(18);
      pdf.setFont('courier', 'bold');
      pdf.text(professional.identificationCode, 105, 112, { align: 'center' });

      // QR Code
      if (qrCodeDataUrl) {
        pdf.addImage(qrCodeDataUrl, 'PNG', 80, 140, 50, 50);
      }

      // Details
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      const details = [
        `${t('professionalCredentials.certificate.institution')}: ${professional.institution || t('professionalCredentials.certificate.not_specified')}`,
        `${t('professionalCredentials.certificate.license')}: ${professional.licenseNumber || t('professionalCredentials.certificate.not_specified')}`,
        `${t('professionalCredentials.certificate.approved_at')}: ${new Date(professional.approvedAt || Date.now()).toLocaleDateString('fr-FR')}`,
        `${t('professionalCredentials.certificate.validity')}: ${t('professionalCredentials.certificate.validity_period')}`,
        `${t('professionalCredentials.certificate.platform')}: DARE - Digital Access for Resource Enhancement`,
      ];

      details.forEach((detail, index) => {
        pdf.text(detail, 20, 210 + index * 8);
      });

      // Footer
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      pdf.text(
        t('professionalCredentials.certificate.approval_statement'),
        105,
        270,
        {
          align: 'center',
        }
      );
      pdf.text(
        t('professionalCredentials.certificate.verification_contact'),
        105,
        280,
        {
          align: 'center',
        }
      );

      // Download
      pdf.save(
        `professionalCredentials.DARE_Certificat_${professional.identificationCode}.pdf`
      );

      toast({
        title: t('professionalCredentials.certificate.download_success_title'),
        description: t(
          'professionalCredentials.certificate.download_success_description'
        ),
      });
    } catch (error) {
      console.error('Certificate download error:', error);
      toast({
        title: t('professionalCredentials.certificate.download_error_title'),
        description: t(
          'professionalCredentials.certificate.download_error_description'
        ),
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const sendCredentialsByEmail = async () => {
    setIsSendingEmail(true);
    try {
      const codeData = {
        code: professional.identificationCode,
        qrCode: qrCodeDataUrl,
        issuedDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
      };

      const success = await ProfessionalCodeGenerator.sendCredentialsEmail(
        professional.id,
        codeData
      );

      if (success) {
        toast({
          title: t('professionalCredentials.email.sent_title'),
          description: t('professionalCredentials.email.sent_description', {
            email: professional.email,
          }),
        });
        onCredentialsSent?.();
      } else {
        throw new Error('professionalCredentials.email.send_error');
      }
    } catch (error) {
      console.error(t('professionalCredentials.email.console_error'), error);
      toast({
        title: t('professionalCredentials.email.error_title'),
        description: t('professionalCredentials.email.error_description'),
        variant: 'destructive',
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-3xl text-white">✅</span>
        </div>
        <h3 className="text-2xl font-bold text-emerald-800 mb-2">
          {t('professionalCredentials.approval.congratulations', {
            name: professional.name,
          })}
        </h3>
        <p className="text-emerald-600">
          {t('professionalCredentials.approval.message')}
        </p>
      </div>

      {/* Code d'identification */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h4 className="font-bold text-lg mb-4 text-center">
            {t('professionalCredentials.identification.title')}
          </h4>

          <div className="text-center mb-4">
            <div className="bg-emerald-100 p-4 rounded-lg inline-block">
              <div className="text-3xl font-mono font-bold text-emerald-800">
                {professional.identificationCode}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="text-2xl mb-2">📱</div>
                <h5 className="font-bold">QR Code</h5>
                <div className="w-32 h-32 mx-auto mt-2 flex items-center justify-center">
                  {isGeneratingQR ? (
                    <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
                  ) : qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt="QR Code professional"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-gray-500">QR Code</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <span className="font-bold text-blue-800">
                  {t('professionalCredentials.professional.type')}:
                </span>
                <span className="ml-2">{professional.type}</span>
              </div>
              <div className="bg-purple-50 p-3 rounded border border-purple-200">
                <span className="font-bold text-purple-800">
                  {t('professionalCredentials.professional.country')}:
                </span>
                <span className="ml-2">{professional.country}</span>
              </div>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <span className="font-bold text-green-800">
                  {t('professionalCredentials.professional.validity')}:
                </span>
                <span className="ml-2">
                  {t('professionalCredentials.professional.validity_period', {
                    years: 1,
                  })}
                </span>
              </div>
              {professional.institution && (
                <div className="bg-orange-50 p-3 rounded border border-orange-200">
                  <span className="font-bold text-orange-800">
                    {t('professionalCredentials.professional.institution')}:
                  </span>
                  <span className="ml-2 text-sm">
                    {professional.institution}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={downloadCredentials}
                disabled={isDownloading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isDownloading ? (
                  <>⏳ {t('professionalCredentials.actions.generating')}</>
                ) : (
                  <>
                    📄{' '}
                    {t('professionalCredentials.actions.download_certificate')}
                  </>
                )}
              </Button>
              <Button
                onClick={sendCredentialsByEmail}
                disabled={isSendingEmail}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSendingEmail ? (
                  <>⏳ {t('professionalCredentials.actions.sending')}</>
                ) : (
                  <>📧 {t('professionalCredentials.actions.send_by_email')}</>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Email: {professional.email}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h5 className="font-bold text-blue-800 mb-2">
          📋 {t('professionalCredentials.instructions.title')}
        </h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• {t('professionalCredentials.instructions.use_code')}</li>
          <li>
            • {t('professionalCredentials.instructions.request_patient_code')}
          </li>
          <li>
            • {t('professionalCredentials.instructions.consultation_fee')}
          </li>
          <li>• {t('professionalCredentials.instructions.keep_code_safe')}</li>
          <li>• {t('professionalCredentials.instructions.qr_verification')}</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfessionalCredentials;
