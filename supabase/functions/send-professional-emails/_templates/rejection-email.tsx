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
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface RejectionEmailProps {
  firstName: string;
  lastName: string;
  professionalType: string;
  rejectionReason: string;
  institution?: string;
}

export const RejectionEmail = ({
  firstName,
  lastName,
  professionalType,
  rejectionReason,
  institution,
}: RejectionEmailProps) => (
  <Html>
    <Head />
    <Preview>Mise à jour de votre candidature DARE</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Mise à jour de votre candidature</Heading>
        
        <Text style={text}>
          Cher Dr. {firstName} {lastName},
        </Text>
        
        <Text style={text}>
          Nous vous remercions pour votre intérêt à rejoindre la plateforme DARE (Diabète Africain & Ressources d'Excellence) en tant que <strong>{getSpecialtyName(professionalType)}</strong>.
        </Text>

        <Text style={text}>
          Après examen attentif de votre candidature, nous regrettons de vous informer que nous ne pouvons pas l'accepter à ce stade.
        </Text>

        <Section style={reasonSection}>
          <Text style={reasonTitle}>📋 Motif :</Text>
          <Text style={reasonText}>{rejectionReason}</Text>
        </Section>

        <Section style={encouragementSection}>
          <Text style={sectionTitle}>💡 Ce que vous pouvez faire :</Text>
          <Text style={encouragementText}>
            • Vérifiez que tous vos documents sont à jour et conformes aux exigences
          </Text>
          <Text style={encouragementText}>
            • Assurez-vous que votre licence professionnelle est valide et vérifiable
          </Text>
          <Text style={encouragementText}>
            • Consultez nos critères d'éligibilité sur notre site web
          </Text>
          <Text style={encouragementText}>
            • N'hésitez pas à nous contacter si vous avez des questions
          </Text>
        </Section>

        <Text style={text}>
          Vous pourrez soumettre une nouvelle candidature une fois que les points mentionnés auront été adressés. Nous encourageons vivement les professionnels qualifiés à rejoindre notre mission.
        </Text>

        <Hr style={hr} />

        <Text style={footerText}>
          Pour toute question concernant votre candidature, contactez-nous à{' '}
          <Link href="mailto:candidatures@dare-diabetes.app" style={link}>
            candidatures@dare-diabetes.app
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

export default RejectionEmail;

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
  color: '#1f2937',
  fontSize: '28px',
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

const reasonSection = {
  backgroundColor: '#fef2f2',
  border: '2px solid #fca5a5',
  borderRadius: '12px',
  margin: '32px 40px',
  padding: '24px',
};

const reasonTitle = {
  color: '#991b1b',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const reasonText = {
  backgroundColor: '#ffffff',
  border: '1px solid #fed7d7',
  borderRadius: '8px',
  color: '#7f1d1d',
  fontSize: '15px',
  lineHeight: '22px',
  margin: '0',
  padding: '16px',
};

const encouragementSection = {
  margin: '32px 40px',
  padding: '20px',
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
};

const sectionTitle = {
  color: '#1e40af',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const encouragementText = {
  color: '#1e40af',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
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