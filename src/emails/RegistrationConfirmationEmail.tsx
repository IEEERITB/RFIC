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

export interface RegistrationConfirmationEmailProps {
  fullName: string;
  category?: string;
  institution?: string;
  customMessage?: string;
}

export const RegistrationConfirmationEmail = ({
  fullName = "Participant",
  category = "Candidate",
  institution = "Academic / Research Institution",
  customMessage,
}: RegistrationConfirmationEmailProps) => {
  const whatsappUrl = "https://chat.whatsapp.com/JfuZqkbQqv1Elf2igdXFwS";
  const calendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=IEEE+RF+IC+Design+Masterclass&dates=20261024T140000Z/20261024T160000Z&details=Masterclass+Weekend+Sessions+Saturdays+and+Sundays+7:30+PM+IST";

  return (
    <Html>
      <Head />
      <Preview>Registration Confirmed: IEEE RF IC Design Masterclass</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header Brand */}
          <Section style={header}>
            <Text style={headerBadge}>IEEE SENSORS COUNCIL RIT-B</Text>
            <Heading style={headerTitle}>IEEE RF IC Design Masterclass</Heading>
            <Text style={headerSub}>5G/6G Physical Silicon Tape-Out Track</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading as="h2" style={greeting}>
              Welcome, {fullName}!
            </Heading>

            <Text style={paragraph}>
              Your seat for the <strong>IEEE RF IC Design Masterclass on Open-Source Silicon</strong> has been successfully confirmed.
            </Text>

            {customMessage && (
              <Section style={customMessageSection}>
                <Text style={customMessageLabel}>Special Announcement from Organizing Committee:</Text>
                <Text style={customMessageText}>{customMessage}</Text>
              </Section>
            )}

            {/* Profile Summary Card */}
            <Section style={infoCard}>
              <Text style={cardTitle}>Confirmed Candidate Details</Text>
              <Text style={cardItem}><strong>Name:</strong> {fullName}</Text>
              <Text style={cardItem}><strong>Category:</strong> {category}</Text>
              <Text style={cardItem}><strong>Affiliation:</strong> {institution}</Text>
              <Text style={cardItem}><strong>Track:</strong> Open-Source EDA & 130nm MPW Tape-Out</Text>
            </Section>

            {/* Official WhatsApp Step */}
            <Section style={actionCard}>
              <Text style={actionCardBadge}>ACTION REQUIRED</Text>
              <Heading as="h3" style={actionCardTitle}>Join the Official WhatsApp Community</Heading>
              <Text style={actionCardText}>
                Live lecture Zoom links, virtual machine credentials, design files, and physical silicon tape-out updates will be shared through this group.
              </Text>
              <Section style={{ textAlign: "center" as const, marginTop: "16px" }}>
                <Button style={btnPrimary} href={whatsappUrl}>
                  Join Official WhatsApp Community
                </Button>
              </Section>
            </Section>

            {/* Schedule Overview */}
            <Section style={scheduleSection}>
              <Heading as="h3" style={sectionHeading}>Masterclass Timeline & Key Logistics</Heading>
              <Text style={bullet}>
                📅 <strong>Schedule:</strong> 4 Consecutive Weekends • Saturdays & Sundays
              </Text>
              <Text style={bullet}>
                ⏰ <strong>Lecture Time:</strong> 7:30 PM – 9:30 PM IST (UTC+5:30)
              </Text>
              <Text style={bullet}>
                💻 <strong>Toolchain:</strong> 100% Free & Open-Source (Xschem, Ngspice, openEMS, KLayout)
              </Text>
              <Text style={bullet}>
                🏆 <strong>Distinction:</strong> Top validated student designs qualify for tape-out fabrication on IHP 130nm BiCMOS / SkyWater 130nm.
              </Text>

              <Section style={{ textAlign: "center" as const, marginTop: "16px" }}>
                <Link href={calendarUrl} style={btnSecondary}>
                  Add Sessions to Google Calendar
                </Link>
              </Section>
            </Section>

            <Hr style={divider} />

            {/* Support / Contact */}
            <Text style={supportText}>
              Need assistance? Contact the organizing committee at{" "}
              <Link href="mailto:rfic.ieeescritb@gmail.com" style={linkStyle}>
                rfic.ieeescritb@gmail.com
              </Link>{" "}
              or visit{" "}
              <Link href="https://ieee-rfic.ritb.in" style={linkStyle}>
                ieee-rfic.ritb.in
              </Link>.
            </Text>

            <Text style={signoff}>
              Warm regards,<br />
              <strong>IEEE Sensors Council RIT-B</strong>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2026 IEEE Sensors Council RIT-B. All rights reserved.
            </Text>
            <Text style={footerSub}>
              This is an official registration confirmation for the IEEE RF IC Design Masterclass.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default RegistrationConfirmationEmail;

/* Email Client Inline Styles */
const main = {
  backgroundColor: "#f4f6f8",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  padding: "30px 10px",
  margin: "0",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden" as const,
  maxWidth: "580px",
  margin: "0 auto",
  border: "1px solid #e2e8f0",
};

const header = {
  backgroundColor: "#0a192f",
  padding: "28px 24px",
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

const content = {
  padding: "32px 28px",
};

const greeting = {
  color: "#0f172a",
  fontSize: "20px",
  fontWeight: "800",
  margin: "0 0 14px 0",
};

const paragraph = {
  color: "#334155",
  fontSize: "14px",
  lineHeight: "1.65",
  margin: "0 0 18px 0",
};

const customMessageSection = {
  backgroundColor: "#f0f9ff",
  borderLeft: "4px solid #0284c7",
  borderRadius: "6px",
  padding: "14px 16px",
  margin: "0 0 20px 0",
};

const customMessageLabel = {
  color: "#0369a1",
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  margin: "0 0 4px 0",
};

const customMessageText = {
  color: "#0c4a6e",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0",
};

const infoCard = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "16px 20px",
  margin: "0 0 22px 0",
};

const cardTitle = {
  color: "#0f172a",
  fontSize: "12px",
  fontWeight: "800",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 10px 0",
  borderBottom: "1px solid #e2e8f0",
  paddingBottom: "6px",
};

const cardItem = {
  color: "#475569",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0 0 6px 0",
};

const actionCard = {
  backgroundColor: "#ecfdf5",
  border: "2px solid #10b981",
  borderRadius: "12px",
  padding: "20px",
  margin: "0 0 24px 0",
};

const actionCardBadge = {
  backgroundColor: "#059669",
  color: "#ffffff",
  fontSize: "9px",
  fontWeight: "800",
  letterSpacing: "1px",
  padding: "3px 8px",
  borderRadius: "999px",
  display: "inline-block",
  margin: "0 0 8px 0",
};

const actionCardTitle = {
  color: "#064e3b",
  fontSize: "16px",
  fontWeight: "800",
  margin: "0 0 6px 0",
};

const actionCardText = {
  color: "#065f46",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0",
};

const btnPrimary = {
  backgroundColor: "#059669",
  borderRadius: "10px",
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: "700",
  textDecoration: "none",
  padding: "12px 24px",
  display: "inline-block",
  boxShadow: "0 4px 10px rgba(5, 150, 105, 0.3)",
};

const btnSecondary = {
  color: "#0284c7",
  fontSize: "12px",
  fontWeight: "700",
  textDecoration: "underline",
  display: "inline-block",
};

const scheduleSection = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "18px 20px",
  margin: "0 0 22px 0",
};

const sectionHeading = {
  color: "#0f172a",
  fontSize: "14px",
  fontWeight: "800",
  margin: "0 0 12px 0",
};

const bullet = {
  color: "#334155",
  fontSize: "12px",
  lineHeight: "1.6",
  margin: "0 0 6px 0",
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
