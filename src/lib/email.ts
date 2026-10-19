import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "mock_key");

export async function sendRegistrationEmail(email: string, fullName: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0B0F19; padding: 30px; text-align: center; border-bottom: 4px solid #10B981;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">IEEE RF IC Series</h1>
      </div>
      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Welcome, ${fullName}!</h2>
        <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
          Your registration for the <strong>IEEE Bangalore Section Flagship Micro-Specialization Track on RF IC Design for 5G/6G</strong> is officially confirmed.
        </p>
        <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
          We are thrilled to have you join this 8-module masterclass. You will learn directly from industry experts in FOSS EDA pipelines and open-source MPW shuttle tape-outs.
        </p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 25px 0;">
          <h3 style="margin-top: 0; color: #111827; font-size: 16px;">Next Steps:</h3>
          <ul style="color: #4b5563; line-height: 1.6; font-size: 14px; margin-bottom: 0;">
            <li>Mark your calendar for the weekend sessions starting October 24 at 7:30 PM IST.</li>
            <li>Ensure you have a reliable internet connection and a laptop ready for the interactive lab components.</li>
            <li>We will email you the meeting links 48 hours before the first session.</li>
          </ul>
        </div>
        <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
          If you have any questions, feel free to reply to this email.
        </p>
        <p style="color: #4b5563; line-height: 1.6; font-size: 16px; margin-bottom: 0;">
          Best regards,<br>
          <strong>IEEE Sensors Council & Bangalore Section Organizing Team</strong>
        </p>
      </div>
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
        This is an automated confirmation email. Please do not forward this registration link to others.
      </div>
    </div>
  `;

  if (process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: "IEEE RF IC Web <onboarding@resend.dev>",
        to: email,
        subject: "Registration Confirmed - IEEE RF IC Design Series",
        html: htmlContent,
      });
      console.log(`Email sent to ${email} via Resend`);
    } catch (error) {
      console.error("Failed to send email via Resend:", error);
    }
  } else {
    console.log("--- MOCK EMAIL DISPATCH ---");
    console.log(`To: ${email}`);
    console.log(`Subject: Registration Confirmed - IEEE RF IC Design Series`);
    console.log(`Content: ${htmlContent}`);
    console.log("---------------------------");
  }
}
