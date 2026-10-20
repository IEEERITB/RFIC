import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { sendRegistrationEmail } from "../src/lib/email";

async function main() {
  console.log("Fetching participants with pending or failed email status...");
  
  const pendingParticipants = await prisma.participant.findMany({
    where: {
      emailStatus: {
        in: ["FAILED", "PENDING"],
      },
    },
    orderBy: { registrationDate: "asc" },
  });

  console.log(`Found ${pendingParticipants.length} participants needing confirmation emails.`);

  let successCount = 0;
  let failureCount = 0;

  for (const p of pendingParticipants) {
    console.log(`\nDispatching email to: ${p.fullName} <${p.email}>...`);
    try {
      const res = await sendRegistrationEmail({
        participantId: p.id,
        email: p.email,
        fullName: p.fullName,
        category: p.category || "Candidate",
        institution: p.institutionOrCompany || "Academic / Research Institution",
        subject: "Registration Confirmed - IEEE RF IC Design Masterclass 5G/6G",
        type: "CONFIRMATION",
      });

      if (res.success) {
        successCount++;
        console.log(`  -> SUCCESS! Message ID: ${res.resendId}`);
      } else {
        failureCount++;
        console.error(`  -> FAILED: ${res.error}`);
      }
    } catch (err: any) {
      failureCount++;
      console.error(`  -> EXCEPTION: ${err.message}`);
    }

    // Delay 500ms between dispatches to maintain healthy SMTP rate limits
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n========================================`);
  console.log(`Email Dispatch Summary:`);
  console.log(`Total attempted: ${pendingParticipants.length}`);
  console.log(`Delivered: ${successCount}`);
  console.log(`Failed: ${failureCount}`);
  console.log(`========================================\n`);
}

main()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
