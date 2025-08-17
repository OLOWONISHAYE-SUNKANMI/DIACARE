import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ProfessionalCodeGenerator } from '@/utils/ProfessionalCodeGenerator';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';

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

export const ProfessionalCredentials: React.FC<ProfessionalCredentialsProps> = ({
  professional,
  onCredentialsSent
}) => {
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
        platform: 'DARE'
      };
      
      const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 256,
        margin: 2,
        color: {
          dark: '#059669', // emerald-600
          light: '#FFFFFF'
        }
      });
      
      setQrCodeDataUrl(qrCodeUrl);
    } catch (error) {
      console.error('Erreur génération QR Code:', error);
      toast({
        title: "❌ Erreur QR Code",
        description: "Impossible de générer le QR Code",
        variant: "destructive"
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
      pdf.text('DARE - Certificat Professionnel', 105, 25, { align: 'center' });
      
      // Professional Info
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Dr. ${professional.name}`, 105, 60, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${professional.type} - ${professional.country}`, 105, 70, { align: 'center' });
      
      // Identification Code
      pdf.setFillColor(240, 253, 244); // green-50
      pdf.rect(20, 90, 170, 30, 'F');
      pdf.setDrawColor(34, 197, 94); // green-500
      pdf.rect(20, 90, 170, 30, 'S');
      
      pdf.setTextColor(5, 150, 105);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Code d\'Identification:', 105, 102, { align: 'center' });
      
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
        `Institution: ${professional.institution || 'Non spécifiée'}`,
        `Licence: ${professional.licenseNumber || 'Non spécifiée'}`,
        `Date d'approbation: ${new Date(professional.approvedAt || Date.now()).toLocaleDateString('fr-FR')}`,
        `Validité: 1 an à partir de la date d'émission`,
        `Plateforme: DARE - Digital Access for Resource Enhancement`
      ];
      
      details.forEach((detail, index) => {
        pdf.text(detail, 20, 210 + (index * 8));
      });
      
      // Footer
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      pdf.text('Ce certificat atteste de l\'approbation du professionnel sur la plateforme DARE.', 105, 270, { align: 'center' });
      pdf.text('Pour toute vérification, contactez support@dare-health.com', 105, 280, { align: 'center' });
      
      // Download
      pdf.save(`DARE_Certificat_${professional.identificationCode}.pdf`);
      
      toast({
        title: "✅ Certificat téléchargé",
        description: "Le certificat professionnel a été téléchargé avec succès",
      });
      
    } catch (error) {
      console.error('Erreur téléchargement certificat:', error);
      toast({
        title: "❌ Erreur téléchargement",
        description: "Impossible de générer le certificat",
        variant: "destructive"
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
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 an
      };
      
      const success = await ProfessionalCodeGenerator.sendCredentialsEmail(
        professional.id,
        codeData
      );
      
      if (success) {
        toast({
          title: "✅ Email envoyé",
          description: `Les identifiants ont été envoyés à ${professional.email}`,
        });
        onCredentialsSent?.();
      } else {
        throw new Error('Échec envoi email');
      }
      
    } catch (error) {
      console.error('Erreur envoi email:', error);
      toast({
        title: "❌ Erreur envoi",
        description: "Impossible d'envoyer l'email",
        variant: "destructive"
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
          Félicitations Dr. {professional.name} !
        </h3>
        <p className="text-emerald-600">
          Votre candidature a été approuvée. Voici vos identifiants DARE Pro.
        </p>
      </div>

      {/* Code d'identification */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h4 className="font-bold text-lg mb-4 text-center">🔑 Votre Code d'Identification</h4>
          
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
                      alt="QR Code professionnel" 
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
                <span className="font-bold text-blue-800">Type:</span>
                <span className="ml-2">{professional.type}</span>
              </div>
              <div className="bg-purple-50 p-3 rounded border border-purple-200">
                <span className="font-bold text-purple-800">Pays:</span>
                <span className="ml-2">{professional.country}</span>
              </div>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <span className="font-bold text-green-800">Validité:</span>
                <span className="ml-2">1 an</span>
              </div>
              {professional.institution && (
                <div className="bg-orange-50 p-3 rounded border border-orange-200">
                  <span className="font-bold text-orange-800">Institution:</span>
                  <span className="ml-2 text-sm">{professional.institution}</span>
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
                  <>⏳ Génération...</>
                ) : (
                  <>📄 Télécharger Certificat</>
                )}
              </Button>
              <Button 
                onClick={sendCredentialsByEmail}
                disabled={isSendingEmail}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSendingEmail ? (
                  <>⏳ Envoi...</>
                ) : (
                  <>📧 Envoyer par Email</>
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
        <h5 className="font-bold text-blue-800 mb-2">📋 Instructions d'utilisation</h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Utilisez ce code pour vous identifier sur DARE Pro</li>
          <li>• Demandez le code patient pour accéder à ses données</li>
          <li>• Chaque consultation est rémunérée 500 F CFA automatiquement</li>
          <li>• Conservez ce code de manière sécurisée</li>
          <li>• Le QR Code permet une vérification rapide de votre identité</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfessionalCredentials;