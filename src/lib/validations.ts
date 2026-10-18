import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  category: z.enum([
    "STUDENT_RIT",
    "STUDENT_EXTERNAL",
    "RESEARCH_SCHOLAR",
    "INDUSTRY_YP",
    "ACADEMIA"
  ], { required_error: "Please select a participant category." }),
  institutionOrCompany: z.string().min(2, "Institution or Company is required."),
  ieeeMember: z.boolean(),
  ieeeMembershipId: z.string().regex(/^\d*$/, "IEEE Membership ID must contain only numbers").optional(),
  githubHandle: z.string().optional(),
  experienceLevel: z.enum([
    "BEGINNER",
    "INTERMEDIATE_ANALOG",
    "ADVANCED_RF"
  ], { required_error: "Please select your experience level." }),
  joinedWhatsapp: z.boolean().refine((val) => val === true, {
    message: "Joining the WhatsApp group is mandatory to receive live session links and updates.",
  }),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
