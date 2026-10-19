import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(1, "Phone number is required.").refine(
    (val) => val.trim().replace(/^\+91\s*/, "").length >= 5,
    { message: "Please enter a valid phone number." }
  ),
  category: z.string().min(1, "Please select a participant category."),
  institutionOrCompany: z.string().min(2, "Institution or company name is required."),
  ieeeMember: z.boolean(),
  ieeeMembershipId: z.string().regex(/^\d*$/, "IEEE Membership ID must contain only numbers").optional(),
  linkedinUrl: z.string().optional(),
  githubHandle: z.string().optional(),
  experienceLevel: z.string().min(1, "Please select your experience level."),
  joinedWhatsapp: z.boolean().refine((val) => val === true, {
    message: "Joining the WhatsApp group is required to complete registration.",
  }),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
