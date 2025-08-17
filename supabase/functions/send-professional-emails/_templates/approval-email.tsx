import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface ApprovalEmailProps {
  firstName: string;
  lastName: string;
  professionalType: string;
  professionalCode: string;
  institution?: string;
}

export const ApprovalEmail = ({
  firstName,
  lastName,
  professionalType,
  professionalCode,
  institution,
}: ApprovalEmailProps) => (
  <Html>
    <Head />
    <Preview>Félicitations ! Votre candidature DARE a été approuvée</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🎉 Candidature Approuvée !</Heading>
        
        <Text style={text}>
          Cher Dr. {firstName} {lastName},
        </Text>
        
        <Text style={text}>
          Nous avons le plaisir de vous informer que votre candidature en tant que <strong>{getSpecialtyName(professionalType)}</strong> pour rejoindre la plateforme DARE (Diabète Africain & Ressources d'Excellence) a été <strong>approuvée</strong> !
        </Text>

        <Section style={codeSection}>
          <Text style={codeLabel}>Votre code professionnel :</Text>
          <Text style={codeValue}>{professionalCode}</Text>
          <Text style={codeDescription}>
            Conservez précieusement ce code. Il vous permettra d'accéder aux données de vos patients diabétiques.
          </Text>
        </Section>

        <Section style={infoSection}>
          <Text style={sectionTitle}>📋 Récapitulatif de votre profil :</Text>
          <Text style={infoText}>• <strong>Spécialité :</strong> {getSpecialtyName(professionalType)}</Text>
          {institution && <Text style={infoText}>• <strong>Institution :</strong> {institution}</Text>}
          <Text style={infoText}>• <strong>Code professionnel :</strong> {professionalCode}</Text>
          <Text style={infoText}>• <strong>Statut :</strong> Vérifié et actif</Text>
        </Section>

        <Section style={nextStepsSection}>
          <Text style={sectionTitle}>🚀 Prochaines étapes :</Text>
          <Text style={stepText}>1. Connectez-vous à la plateforme DARE avec votre compte</Text>
          <Text style={stepText}>2. Accédez à votre tableau de bord professionnel</Text>
          <Text style={stepText}>3. Configurez vos disponibilités pour les téléconsultations</Text>
          <Text style={stepText}>4. Commencez à aider des patients diabétiques !</Text>
        </Section>

        <Button
          href="https://dare-diabetes.app/login"
          style={button}
        >
          Accéder à DARE
        </Button>

        <Hr style={hr} />

        <Text style={footerText}>
          Si vous avez des questions, n'hésitez pas à nous contacter à{' '}
          <Link href="mailto:support@dare-diabetes.app" style={link}>
            support@dare-diabetes.app
          </Link>
        </Text>

        <Text style={signature}>
          L'équipe DARE<br />
          <em>Ensemble contre le diabète en Afrique</em>
        </Text>
      </Container>
    </Body>
  </Html>
);

function getSpecialtyName(type: string): string {
  const names: Record<string, string> = {
    'endocrinologist': 'Endocrinologue',
    'diabetologist': 'Diabétologue',
    'psychologist': 'Psychologue',
    'nutritionist': 'Nutritionniste',
    'nurse': 'Infirmier(ère) spécialisé(e)',
    'general_practitioner': 'Médecin Généraliste',
    'pharmacist': 'Pharmacien',
    'podiatrist': 'Podologue'
  };
  return names[type] || type;
}

export default ApprovalEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a472a',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 40px',
};

const codeSection = {
  backgroundColor: '#f0f9f0',
  border: '2px solid #4ade80',
  borderRadius: '12px',
  margin: '32px 40px',
  padding: '24px',
  textAlign: 'center' as const,
};

const codeLabel = {
  color: '#1a472a',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const codeValue = {
  backgroundColor: '#ffffff',
  border: '1px solid #d1fae5',
  borderRadius: '8px',
  color: '#1a472a',
  fontSize: '24px',
  fontWeight: 'bold',
  fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
  margin: '8px 0 16px 0',
  padding: '16px',
};

const codeDescription = {
  color: '#059669',
  fontSize: '14px',
  margin: '0',
};

const infoSection = {
  margin: '32px 40px',
  padding: '20px',
  backgroundColor: '#fafafa',
  borderRadius: '8px',
};

const nextStepsSection = {
  margin: '32px 40px',
  padding: '20px',
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
};

const sectionTitle = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const infoText = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0',
};

const stepText = {
  color: '#1e40af',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};

const button = {
  backgroundColor: '#059669',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'block',
  fontSize: '16px',
  fontWeight: '600',
  margin: '32px auto',
  padding: '16px 32px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  width: '200px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 40px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 40px',
};

const signature = {
  color: '#059669',
  fontSize: '16px',
  fontWeight: '500',
  margin: '24px 40px 0',
  textAlign: 'center' as const,
};

const link = {
  color: '#059669',
  textDecoration: 'underline',
};