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
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface DataAccessEmailProps {
  professionalName: string
  professionalType: string
  professionalCode: string
  institution?: string
  timestamp: string
  actions: Array<{
    id: string
    label: string
    url?: string
  }>
}

export const DataAccessEmail = ({
  professionalName,
  professionalType,
  professionalCode,
  institution,
  timestamp,
  actions
}: DataAccessEmailProps) => {
  const accessDate = new Date(timestamp).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <Html>
      <Head />
      <Preview>Accès à vos données médicales DARE</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🏥 DARE - Notification d'Accès</Heading>
          
          <Section style={alertBox}>
            <Text style={alertText}>
              👀 <strong>Accès à vos données médicales</strong>
            </Text>
          </Section>

          <Text style={text}>
            Nous vous informons qu'un professionnel de santé a consulté vos données médicales sur la plateforme DARE.
          </Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>Détails de l'accès :</Text>
            <Text style={infoItem}>
              <strong>Professionnel :</strong> {professionalName}
            </Text>
            <Text style={infoItem}>
              <strong>Spécialité :</strong> {professionalType}
            </Text>
            <Text style={infoItem}>
              <strong>Code d'identification :</strong> {professionalCode}
            </Text>
            {institution && (
              <Text style={infoItem}>
                <strong>Institution :</strong> {institution}
              </Text>
            )}
            <Text style={infoItem}>
              <strong>Date et heure :</strong> {accessDate}
            </Text>
          </Section>

          <Text style={text}>
            Cet accès est conforme aux autorisations que vous avez accordées. 
            Tous les accès à vos données sont tracés et sécurisés.
          </Text>

          <Section style={buttonContainer}>
            <Button
              href="https://dare-app.com/access-history"
              style={button}
            >
              📋 Voir l'historique complet
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Si vous n'avez pas autorisé cet accès ou si vous avez des préoccupations, 
            veuillez nous contacter immédiatement.
          </Text>

          <Text style={footerLink}>
            <Link href="https://dare-app.com/support" style={link}>
              Contacter le support DARE
            </Link>
          </Text>

          <Text style={disclaimer}>
            DARE - Diabète Africain Réseau d'Excellence<br />
            Plateforme sécurisée de gestion du diabète
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default DataAccessEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
}

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const alertBox = {
  backgroundColor: '#fef3c7',
  border: '1px solid #f59e0b',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
}

const alertText = {
  color: '#92400e',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
}

const infoBox = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const infoTitle = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
}

const infoItem = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const hr = {
  border: 'none',
  borderTop: '1px solid #e5e7eb',
  margin: '32px 0',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
}

const footerLink = {
  textAlign: 'center' as const,
  margin: '16px 0',
}

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
}

const disclaimer = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '32px 0 0 0',
  textAlign: 'center' as const,
}