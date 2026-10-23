import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface CustomBroadcastEmailProps {
  fullName?: string;
  category?: string;
  institution?: string;
  subject?: string;
  headline?: string;
  badgeText?: string;
  bodyContent: string;
  ctaText?: string;
  ctaUrl?: string;
  additionalNote?: string;
}

export const CustomBroadcastEmail = ({
  fullName = "Participant",
  category = "Candidate",
  institution = "Academic / Research Institution",
  subject = "Important Masterclass Update: IEEE RF IC Design Series",
  headline = "Important Masterclass Update & Guidelines",
  badgeText = "OFFICIAL UPDATE",
  bodyContent = "We are pleased to share key logistical and technical updates regarding the upcoming IEEE RF IC Design Masterclass on Open-Source Silicon.",
  ctaText,
  ctaUrl,
  additionalNote,
}: CustomBroadcastEmailProps) => {
  // Split body content into paragraphs if provided as multiline text
  const paragraphs = bodyContent
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header Brand */}
          <Section style={header}>
            <Text style={headerBadge}>IEEE BANGALORE SECTION & IEEE SENSORS COUNCIL RIT-B</Text>
            <Heading style={headerTitle}>IEEE RF IC Design Masterclass</Heading>
            <Text style={headerSub}>5G/6G Physical Silicon Tape-Out Track • Official Announcement</Text>
          </Section>

          {/* Announcement Banner */}
          <Section style={bannerSection}>
            {badgeText && <Text style={announcementBadge}>{badgeText.toUpperCase()}</Text>}
            <Heading as="h2" style={bannerTitle}>
              {headline}
            </Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading as="h3" style={greeting}>
              Hello, {fullName}!
            </Heading>

            {/* Paragraphs */}
            {paragraphs.map((para, idx) => (
              <Text key={idx} style={paragraph}>
                {para}
              </Text>
            ))}

            {/* Optional Call to Action Button */}
            {ctaText && ctaUrl && (
              <Section style={ctaSection}>
                <Button style={btnPrimary} href={ctaUrl}>
                  {ctaText}
                </Button>
                <Text style={ctaSubtext}>
                  If the button doesn&apos;t work, copy and paste this link into your browser:{" "}
                  <Link href={ctaUrl} style={linkStyle}>
                    {ctaUrl}
                  </Link>
                </Text>
              </Section>
            )}

            {/* Optional Additional Note Box */}
            {additionalNote && (
              <Section style={noteCard}>
                <Text style={noteCardTitle}>Important Note:</Text>
                <Text style={noteCardText}>{additionalNote}</Text>
              </Section>
            )}

            {/* Candidate Reference Card */}
            <Section style={infoCard}>
              <Text style={cardTitle}>Candidate Ledger Record</Text>
              <Text style={cardItem}><strong>Recipient:</strong> {fullName}</Text>
              <Text style={cardItem}><strong>Category:</strong> {category}</Text>
              <Text style={cardItem}><strong>Affiliation:</strong> {institution}</Text>
              <Text style={cardItem}><strong>Track:</strong> Open-Source EDA & 130nm MPW Tape-Out</Text>
            </Section>

            <Hr style={divider} />

            {/* Official Support & Sign-off */}
            <Text style={supportText}>
              Questions regarding schedule, virtual machine access, or tape-out submissions? Reach out to the organizing team at{" "}
              <Link href="mailto:rfic.ieeescritb@gmail.com" style={linkStyle}>
                rfic.ieeescritb@gmail.com
              </Link>{" "}
              or visit the portal at{" "}
              <Link href="https://ieee-rfic.ritb.in" style={linkStyle}>
                ieee-rfic.ritb.in
              </Link>.
            </Text>

            <Text style={signoff}>
              Warm regards,<br />
              <strong>Organizing Committee</strong><br />
              <span style={{ color: "#64748b", fontSize: "12px" }}>
                IEEE Sensors Council RIT-B & IEEE Bangalore Section
              </span>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2026 IEEE Sensors Council RIT-B & IEEE Bangalore Section. Joint Flagship Silicon Initiative.
            </Text>
            <Text style={footerSub}>
              You received this broadcast because you are a registered participant for the IEEE RF IC Design Masterclass.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default CustomBroadcastEmail;

/* Email Client Inline Styles */
const main = {
  backgroundColor: "#f4f6f8",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  padding: "30px 10px",
  margin: "0",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "14px",
  overflow: "hidden" as const,
  maxWidth: "580px",
  margin: "0 auto",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
};

const header = {
  backgroundColor: "#0a192f",
  padding: "28px 24px 24px",
  textAlign: "center" as const,
  borderBottom: "3px solid #0284c7",
};

const headerBadge = {
  color: "#38bdf8",
  fontSize: "10px",
  fontWeight: "800",
  letterSpacing: "1.5px",
  textTransform: "uppercase" as const,
  margin: "0 0 8px 0",
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "900",
  letterSpacing: "-0.5px",
  margin: "0",
};

const headerSub = {
  color: "#94a3b8",
  fontSize: "12px",
  fontWeight: "500",
  margin: "6px 0 0 0",
};

const bannerSection = {
  backgroundColor: "#f0f9ff",
  borderBottom: "1px solid #bae6fd",
  padding: "20px 28px",
  textAlign: "left" as const,
};

const announcementBadge = {
  backgroundColor: "#0284c7",
  color: "#ffffff",
  fontSize: "9px",
  fontWeight: "800",
  letterSpacing: "1px",
  padding: "3px 8px",
  borderRadius: "999px",
  display: "inline-block",
  margin: "0 0 8px 0",
};

const bannerTitle = {
  color: "#0c4a6e",
  fontSize: "18px",
  fontWeight: "800",
  lineHeight: "1.35",
  margin: "0",
};

const content = {
  padding: "30px 28px",
};

const greeting = {
  color: "#0f172a",
  fontSize: "18px",
  fontWeight: "800",
  margin: "0 0 16px 0",
};

const paragraph = {
  color: "#334155",
  fontSize: "14px",
  lineHeight: "1.7",
  margin: "0 0 16px 0",
  whiteSpace: "pre-line" as const,
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "24px 0 28px",
  padding: "20px",
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
};

const btnPrimary = {
  backgroundColor: "#0284c7",
  borderRadius: "10px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "800",
  textDecoration: "none",
  padding: "14px 28px",
  display: "inline-block",
  boxShadow: "0 4px 12px rgba(2, 132, 199, 0.35)",
};

const ctaSubtext = {
  color: "#64748b",
  fontSize: "11px",
  lineHeight: "1.4",
  margin: "12px 0 0 0",
};

const noteCard = {
  backgroundColor: "#fffbeb",
  borderLeft: "4px solid #f59e0b",
  borderRadius: "6px",
  padding: "14px 16px",
  margin: "0 0 20px 0",
};

const noteCardTitle = {
  color: "#92400e",
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  margin: "0 0 4px 0",
};

const noteCardText = {
  color: "#78350f",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0",
};

const infoCard = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  padding: "14px 18px",
  margin: "20px 0 24px",
};

const cardTitle = {
  color: "#0f172a",
  fontSize: "11px",
  fontWeight: "800",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 8px 0",
  borderBottom: "1px solid #e2e8f0",
  paddingBottom: "5px",
};

const cardItem = {
  color: "#475569",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0 0 4px 0",
};

const divider = {
  borderColor: "#e2e8f0",
  margin: "24px 0",
};

const supportText = {
  color: "#64748b",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0 0 16px 0",
};

const linkStyle = {
  color: "#0284c7",
  textDecoration: "underline",
};

const signoff = {
  color: "#1e293b",
  fontSize: "13px",
  lineHeight: "1.6",
  margin: "0",
};

const footer = {
  backgroundColor: "#0f172a",
  padding: "24px 20px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#94a3b8",
  fontSize: "11px",
  lineHeight: "1.5",
  margin: "0 0 6px 0",
};

const footerSub = {
  color: "#64748b",
  fontSize: "10px",
  lineHeight: "1.4",
  margin: "0",
};
