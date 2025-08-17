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

interface WelcomeEmailProps {
  firstName: string;
  lastName: string;
  professionalType: string;
  professionalCode: string;
}

export const WelcomeEmail = ({
  firstName,
  lastName,
  professionalType,
  professionalCode,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Bienvenue dans la communauté DARE !</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🚀 Bienvenue dans DARE !</Heading>
        
        <Text style={text}>
          Bonjour Dr. {firstName} {lastName},
        </Text>
        
        <Text style={text}>
          Félicitations ! Vous venez de rejoindre officiellement la plateforme DARE, la communauté des professionnels de santé dédiée à la lutte contre le diabète en Afrique.
        </Text>

        <Section style={statsSection}>
          <Text style={statsTitle}>🌍 Vous rejoignez une communauté active :</Text>
          <Text style={statsText}>• Plus de 500 professionnels vérifiés</Text>
          <Text style={statsText}>• 15 pays africains représentés</Text>
          <Text style={statsText}>• Plus de 10 000 patients accompagnés</Text>
          <Text style={statsText}>• Échanges quotidiens d'expertise</Text>
        </Section>

        <Section style={quickStartSection}>
          <Text style={sectionTitle}>🎯 Pour bien commencer :</Text>
          <Text style={stepText}>1. Complétez votre profil professionnel</Text>
          <Text style={stepText}>2. Configurez vos disponibilités pour les téléconsultations</Text>
          <Text style={stepText}>3. Rejoignez les groupes de discussion de votre spécialité</Text>
          <Text style={stepText}>4. Explorez les outils d'aide au diagnostic</Text>
          <Text style={stepText}>5. Consultez les dernières recommandations</Text>
        </Section>

        <Section style={codeReminder}>
          <Text style={reminderTitle}>📋 Rappel de votre code professionnel :</Text>
          <Text style={codeValue}>{professionalCode}</Text>
          <Text style={reminderText}>
            Utilisez ce code pour accéder aux données patients et valider votre identité professionnelle.
          </Text>
        </Section>

        <Button
          href="https://dare-diabetes.app/professional/dashboard"
          style={button}
        >
          Accéder à mon tableau de bord
        </Button>

        <Hr style={hr} />

        <Text style={footerText}>
          Besoin d'aide ? Consultez notre{' '}
          <Link href="https://dare-diabetes.app/help" style={link}>
            centre d'aide
          </Link>{' '}
          ou contactez-nous à{' '}
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

export default WelcomeEmail;

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

const statsSection = {
  backgroundColor: '#f0f9f0',
  border: '2px solid #4ade80',
  borderRadius: '12px',
  margin: '32px 40px',
  padding: '24px',
};

const statsTitle = {
  color: '#1a472a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const statsText = {
  color: '#059669',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '6px 0',
};

const quickStartSection = {
  margin: '32px 40px',
  padding: '20px',
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
};

const sectionTitle = {
  color: '#1e40af',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const stepText = {
  color: '#1e40af',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};

const codeReminder = {
  backgroundColor: '#fef3c7',
  border: '2px solid #f59e0b',
  borderRadius: '12px',
  margin: '32px 40px',
  padding: '24px',
  textAlign: 'center' as const,
};

const reminderTitle = {
  color: '#92400e',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const codeValue = {
  backgroundColor: '#ffffff',
  border: '1px solid #fbbf24',
  borderRadius: '8px',
  color: '#92400e',
  fontSize: '20px',
  fontWeight: 'bold',
  fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
  margin: '8px 0 16px 0',
  padding: '12px',
};

const reminderText = {
  color: '#b45309',
  fontSize: '14px',
  margin: '0',
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
  width: '280px',
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