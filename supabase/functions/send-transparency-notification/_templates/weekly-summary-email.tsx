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

interface WeeklySummaryEmailProps {
  accessCount: number
  accesses: Array<{
    professionalName: string
    professionalType: string
    date: string
    actionType: string
    duration: number
    dataAccessed: string[]
  }>
  weekStart: string
  weekEnd: string
}

export const WeeklySummaryEmail = ({
  accessCount,
  accesses,
  weekStart,
  weekEnd
}: WeeklySummaryEmailProps) => {
  const startDate = new Date(weekStart).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long'
  })
  const endDate = new Date(weekEnd).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <Html>
      <Head />
      <Preview>Résumé hebdomadaire de vos accès DARE</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>📊 DARE - Résumé Hebdomadaire</Heading>
          
          <Section style={summaryBox}>
            <Text style={summaryText}>
              <strong>{accessCount}</strong> accès à vos données cette semaine
            </Text>
            <Text style={dateRange}>
              Du {startDate} au {endDate}
            </Text>
          </Section>

          <Text style={text}>
            Voici le résumé des accès à vos données médicales sur la plateforme DARE cette semaine :
          </Text>

          {accesses.map((access, index) => (
            <Section key={index} style={accessBox}>
              <Text style={accessHeader}>
                <strong>{access.professionalName}</strong> • {access.professionalType}
              </Text>
              <Text style={accessDetails}>
                📅 {new Date(access.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              <Text style={accessDetails}>
                ⏱️ {access.actionType === 'consultation' ? 'Consultation' : 'Consultation données'} 
                {access.duration > 0 && ` (${access.duration} min)`}
              </Text>
              {access.dataAccessed.length > 0 && (
                <Text style={accessDetails}>
                  📋 Sections : {access.dataAccessed.join(', ')}
                </Text>
              )}
            </Section>
          ))}

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
            <strong>Votre confidentialité est notre priorité</strong><br />
            Tous les accès à vos données sont tracés, sécurisés et conformes aux autorisations que vous avez accordées.
          </Text>

          <Text style={footerActions}>
            <Link href="https://dare-app.com/privacy-settings" style={link}>
              Gérer mes autorisations
            </Link> • 
            <Link href="https://dare-app.com/support" style={link}>
              Contacter le support
            </Link>
          </Text>

          <Text style={disclaimer}>
            DARE - Diabète Africain Réseau d'Excellence<br />
            Plateforme sécurisée de gestion du diabète<br />
            <Link href="https://dare-app.com/unsubscribe" style={unsubscribeLink}>
              Se désabonner des résumés hebdomadaires
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default WeeklySummaryEmail

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

const summaryBox = {
  backgroundColor: '#dbeafe',
  border: '1px solid #3b82f6',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const summaryText = {
  color: '#1e40af',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
}

const dateRange = {
  color: '#3730a3',
  fontSize: '14px',
  margin: '0',
}

const accessBox = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
}

const accessHeader = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
}

const accessDetails = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0',
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
  color: '#374151',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
  textAlign: 'center' as const,
}

const footerActions = {
  textAlign: 'center' as const,
  margin: '16px 0',
  fontSize: '14px',
}

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
  margin: '0 4px',
}

const unsubscribeLink = {
  color: '#9ca3af',
  textDecoration: 'underline',
  fontSize: '12px',
}

const disclaimer = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '32px 0 0 0',
  textAlign: 'center' as const,
}