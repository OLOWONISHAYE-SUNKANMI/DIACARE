import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DocumentUploader } from '@/components/DocumentUploader';

interface ProfessionType {
  id: string;
  name: string;
  icon: string;
  rate: string;
  description: string;
  specialty: string;
}

const HealthProfessionalSignup = () => {
  const [selectedProfession, setSelectedProfession] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    institution: '',
    city: '',
    country: '',
    specialty: '',
    experience: '',
    biography: ''
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const professionTypes: ProfessionType[] = [
    { 
      id: 'endocrinologist', 
      name: 'Endocrinologue', 
      icon: '🩺',
      rate: '630 F CFA/consultation (35%)',
      description: 'Spécialiste diabète et hormones',
      specialty: 'endocrinologist'
    },
    { 
      id: 'general_practitioner', 
      name: 'Médecin Généraliste', 
      icon: '👨‍⚕️',
      rate: '520 F CFA/consultation (29%)',
      description: 'Médecine générale avec focus diabète',
      specialty: 'general_practitioner'
    },
    { 
      id: 'psychologist', 
      name: 'Psychologue', 
      icon: '🧠',
      rate: '430 F CFA/séance (24%)',
      description: 'Soutien psychologique diabète',
      specialty: 'psychologist'
    },
    { 
      id: 'nurse', 
      name: 'Infirmier(ère)', 
      icon: '👩‍⚕️',
      rate: '120 F CFA/suivi (7%)',
      description: 'Suivi et éducation thérapeutique',
      specialty: 'nurse'
    },
    { 
      id: 'nutritionist', 
      name: 'Nutritionniste', 
      icon: '🥗',
      rate: '100 F CFA/consultation (5%)',
      description: 'Conseils alimentaires personnalisés',
      specialty: 'nutritionist'
    }
  ];

  const selectedProfessionData = professionTypes.find(p => p.id === selectedProfession);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedProfession || !formData.firstName || !formData.lastName || !formData.email || !formData.licenseNumber) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Soumission de la candidature professionnelle
      const { error } = await supabase
        .from('professional_applications')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          license_number: formData.licenseNumber,
          institution: formData.institution,
          city: formData.city,
          country: formData.country,
          professional_type: selectedProfessionData?.specialty,
          status: 'pending'
        });

      if (error) throw error;
      
      toast({
        title: "Candidature soumise !",
        description: "Votre candidature a été envoyée pour examen. Vous recevrez une réponse dans les 24-48h.",
      });

      // Reset form
      setSelectedProfession('');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licenseNumber: '',
        institution: '',
        city: '',
        country: '',
        specialty: '',
        experience: '',
        biography: ''
      });
      setDocuments([]);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">
          🏥 DARE Pro - Professionnels de Santé
        </h1>
        <p className="text-lg text-muted-foreground">
          Rejoignez le réseau DARE et monétisez vos consultations de télémédecine
        </p>
        <div className="flex justify-center items-center gap-2 mt-4">
          <CheckCircle className="w-5 h-5 text-medical-green" />
          <span className="text-sm">Inscription gratuite</span>
          <CheckCircle className="w-5 h-5 text-medical-green" />
          <span className="text-sm">Validation sous 48h</span>
          <CheckCircle className="w-5 h-5 text-medical-green" />
          <span className="text-sm">Paiement sécurisé</span>
        </div>
      </div>

      {/* Sélection du type de professionnel */}
      <Card>
        <CardHeader>
          <CardTitle>1. Sélectionnez votre spécialité</CardTitle>
          <CardDescription>
            Choisissez la spécialité qui correspond à votre expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {professionTypes.map(profession => (
              <button
                key={profession.id}
                onClick={() => {
                  setSelectedProfession(profession.id);
                  setFormData(prev => ({ ...prev, specialty: profession.specialty }));
                }}
                className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                  selectedProfession === profession.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-3xl mb-2">{profession.icon}</div>
                <h3 className="font-semibold text-lg mb-1">{profession.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{profession.description}</p>
                <Badge variant="outline" className="text-xs">
                  {profession.rate}
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formulaire d'inscription */}
      {selectedProfession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{selectedProfessionData?.icon}</span>
              2. Informations professionnelles - {selectedProfessionData?.name}
            </CardTitle>
            <CardDescription>
              Fournissez vos informations professionnelles pour la vérification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email professionnel *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="professionnel@hopital.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+221 XX XXX XX XX"
                />
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licenseNumber">Numéro de licence/ordre *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  placeholder="Numéro d'inscription à l'ordre"
                />
              </div>
              <div>
                <Label htmlFor="institution">Institution/Hôpital</Label>
                <Input
                  id="institution"
                  value={formData.institution}
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  placeholder="Nom de votre institution"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Dakar, Thiès, etc."
                />
              </div>
              <div>
                <Label htmlFor="country">Pays</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="senegal">Sénégal</SelectItem>
                    <SelectItem value="mali">Mali</SelectItem>
                    <SelectItem value="burkina">Burkina Faso</SelectItem>
                    <SelectItem value="cote_ivoire">Côte d'Ivoire</SelectItem>
                    <SelectItem value="guinea">Guinée</SelectItem>
                    <SelectItem value="mauritania">Mauritanie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="experience">Années d'expérience</Label>
              <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre expérience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 ans</SelectItem>
                  <SelectItem value="3-5">3-5 ans</SelectItem>
                  <SelectItem value="6-10">6-10 ans</SelectItem>
                  <SelectItem value="11-15">11-15 ans</SelectItem>
                  <SelectItem value="15+">Plus de 15 ans</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="biography">Biographie professionnelle</Label>
              <Textarea
                id="biography"
                value={formData.biography}
                onChange={(e) => handleInputChange('biography', e.target.value)}
                placeholder="Décrivez votre parcours et votre expertise dans le domaine du diabète..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload de documents */}
      {selectedProfession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              3. Documents justificatifs
            </CardTitle>
            <CardDescription>
              Uploadez vos documents pour la vérification (diplômes, licences, CV)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUploader
              documents={documents}
              setDocuments={setDocuments}
              acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']}
              maxFiles={5}
            />
            {documents.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Documents sélectionnés : {documents.length}
                </p>
                <div className="space-y-2">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4" />
                      <span>{doc.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {(doc.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bouton de soumission */}
      {selectedProfession && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">Nouveau système de rémunération (1800 F/patient/mois) :</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-medical-green" />
                    <span>Endocrinologue: 630 F (35%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-medical-green" />
                    <span>Médecin généraliste: 520 F (29%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-medical-green" />
                    <span>Psychologue: 430 F (24%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-medical-green" />
                    <span>Infirmier(ère): 120 F (7%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-medical-green" />
                    <span>Nutritionniste: 100 F (5%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-medical-green" />
                    <span>Paiements automatiques mensuels</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSubmit} 
                disabled={loading || !selectedProfession}
                size="lg"
                className="w-full md:w-auto"
              >
                {loading ? 'Soumission en cours...' : 'Soumettre ma candidature'}
              </Button>

              <p className="text-xs text-muted-foreground">
                En soumettant cette candidature, vous acceptez nos conditions d'utilisation 
                et notre politique de confidentialité.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HealthProfessionalSignup;