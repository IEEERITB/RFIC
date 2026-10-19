"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { registrationSchema, RegistrationFormValues } from "@/lib/validations";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, CheckCircle2, X, AlertCircle, ShieldCheck, User, Building, Award, MessageCircle, Loader2 } from "lucide-react";
import { ShimmerButton } from "./magicui/shimmer-button";

export const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/H8zM8URfnS98mMCONT2E2L";

export function RegistrationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIeeeMember, setIsIeeeMember] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [formErrorCount, setFormErrorCount] = useState(0);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "+91 ",
      category: "",
      institutionOrCompany: "",
      ieeeMember: false,
      ieeeMembershipId: "",
      linkedinUrl: "",
      githubHandle: "",
      experienceLevel: "",
      joinedWhatsapp: false,
    },
  });

  async function onSubmit(data: RegistrationFormValues) {
    setIsSubmitting(true);
    setFormErrorCount(0);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration could not be completed. Please check your inputs.");
      }

      toast({
        title: "Registration Confirmed!",
        description: "Your spot has been reserved. Joining the official WhatsApp group is compulsory for session links.",
        variant: "default",
        className: "bg-emerald-600 text-white border-none",
      });

      setRegistrationSuccess(true);
      setShowWhatsAppModal(true);

      // Attempt to immediately open WhatsApp invite link in a new tab
      try {
        window.open(WHATSAPP_GROUP_URL, "_blank");
      } catch (err) {
        console.warn("Popup blocked by browser:", err);
      }

      form.reset();
    } catch (error: any) {
      toast({
        title: "Submission Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const onError = (errors: any) => {
    const count = Object.keys(errors).length;
    setFormErrorCount(count);
    if (errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  };

  return (
    <section
      className="py-20 sm:py-24 bg-gradient-to-b from-sky-50/60 to-white border-t border-slate-200/60 relative"
      id="register"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200 mb-3">
            Free IEEE Micro-Specialization
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Secure Your Participant Seat
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
            Zero tuition fees. All toolchain access credentials, Zoom links, and student silicon tape-out slots are granted upon confirmed registration.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl">
          {registrationSuccess ? (
            <div className="text-center py-6 sm:py-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Registration Successfully Confirmed!
                </h3>
                <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                  Your seat for the IEEE RF IC Design Micro-Specialization masterclass is reserved.
                </p>
              </div>

              {/* Compulsory Next Step Banner */}
              <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-500/50 max-w-lg mx-auto text-left space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Compulsory Action
                  </span>
                  <h4 className="font-bold text-emerald-950 text-base">
                    Join the Official WhatsApp Community
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                  All live lecture Zoom links, EDA lab credentials, design files, and physical silicon <strong>TAPEOUT announcements</strong> are shared exclusively through this community group.
                </p>
                <a
                  href={WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md shadow-emerald-600/30 transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <span>Join Official WhatsApp Group</span>
                  <ExternalLink size={16} />
                </a>
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setRegistrationSuccess(false)}
                  className="text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Register Another Participant
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
                {/* Accessible Error Summary if Validation Fails */}
                {formErrorCount > 0 && (
                  <div
                    ref={errorSummaryRef}
                    tabIndex={-1}
                    role="alert"
                    aria-labelledby="error-summary-title"
                    className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <div className="flex items-center gap-2 font-bold mb-1" id="error-summary-title">
                      <AlertCircle size={16} className="text-red-600" />
                      <span>Please review and fix the {formErrorCount} required field(s) below:</span>
                    </div>
                    <p className="text-red-700 text-xs">
                      Make sure your email, phone, category, institution, and WhatsApp confirmation are properly completed.
                    </p>
                  </div>
                )}

                {/* Section 1: Candidate Identification */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <User size={14} className="text-sky-600" />
                    <span>Personal & Contact Information</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-800 font-semibold text-xs sm:text-sm">
                            Full Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Priyanshu Trivedi"
                              className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-800 font-semibold text-xs sm:text-sm">
                            Email Address <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              inputMode="email"
                              placeholder="e.g. name@university.edu"
                              className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-800 font-semibold text-xs sm:text-sm">
                          Phone Number <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            inputMode="tel"
                            placeholder="+91 98765 43210"
                            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-[11px] text-slate-500">
                          For critical tape-out coordination and lab access updates via SMS/WhatsApp.
                        </FormDescription>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 2: Affiliation & Experience */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Building size={14} className="text-teal-600" />
                    <span>Academic / Professional Profile</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-800 font-semibold text-xs sm:text-sm">
                            Participant Category <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                              <SelectTrigger className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl">
                                <SelectValue placeholder="Select your category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-xl rounded-xl">
                              <SelectItem value="Student (Ramaiah / MSRIT)">Student (Ramaiah / MSRIT)</SelectItem>
                              <SelectItem value="Student (External College / University)">Student (External College / University)</SelectItem>
                              <SelectItem value="Research Scholar / PhD Candidate">Research Scholar / PhD Candidate</SelectItem>
                              <SelectItem value="Industry / Working Professional">Industry / Working Professional</SelectItem>
                              <SelectItem value="Faculty / Academia">Faculty / Academia</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experienceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-800 font-semibold text-xs sm:text-sm">
                            Experience Level <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                              <SelectTrigger className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl">
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-xl rounded-xl">
                              <SelectItem value="Beginner (No prior tape-out)">Beginner (No prior tape-out)</SelectItem>
                              <SelectItem value="Intermediate (Basic Analog/VLSI)">Intermediate (Basic Analog/VLSI)</SelectItem>
                              <SelectItem value="Advanced (RF IC / Past Tape-outs)">Advanced (RF IC / Past Tape-outs)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="institutionOrCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-800 font-semibold text-xs sm:text-sm">
                          Institution or Company Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Ramaiah Institute of Technology / Intel / TI"
                            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 3: Technical Links */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Award size={14} className="text-indigo-600" />
                    <span>Profiles & Design Portfolios (Optional)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="linkedinUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-800 font-semibold text-xs sm:text-sm">
                            LinkedIn Profile
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://linkedin.com/in/username"
                              className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="githubHandle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-800 font-semibold text-xs sm:text-sm">
                            GitHub Profile / Handle
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. username or https://github.com/..."
                              className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl font-mono"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section 4: IEEE Membership Status */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
                  <FormField
                    control={form.control}
                    name="ieeeMember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-bold text-slate-900 flex items-center gap-1.5 cursor-pointer">
                            <ShieldCheck size={16} className="text-sky-600" />
                            <span>Current IEEE Member?</span>
                          </FormLabel>
                          <FormDescription className="text-xs text-slate-500">
                            Check if you currently hold an active student or professional IEEE membership.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.checked);
                              setIsIeeeMember(e.target.checked);
                            }}
                            className="w-5 h-5 accent-sky-600 bg-white border-slate-300 rounded-md cursor-pointer"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {isIeeeMember && (
                    <div className="pt-3 border-t border-slate-200/60 animate-in fade-in duration-200">
                      <FormField
                        control={form.control}
                        name="ieeeMembershipId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-800 font-semibold text-xs sm:text-sm">
                              IEEE Membership ID (Numbers only)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="e.g. 98765432"
                                className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl font-mono"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Section 5: WhatsApp Community Access (Mandatory) */}
                <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/60 p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20 font-bold text-sm">
                        <MessageCircle size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                          <span>Official WhatsApp Community Group</span>
                          <span className="text-red-500 font-black">*</span>
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          All live lecture links, EDA lab credentials, and physical tape-out announcements are shared exclusively here.
                        </p>
                      </div>
                    </div>

                    <a
                      href={WHATSAPP_GROUP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => form.setValue("joinedWhatsapp", true, { shouldValidate: true })}
                      className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <span>Join WhatsApp Group</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  <FormField
                    control={form.control}
                    name="joinedWhatsapp"
                    render={({ field }) => (
                      <FormItem className="pt-2 border-t border-emerald-200/80">
                        <div className="flex items-center gap-3">
                          <FormControl>
                            <input
                              type="checkbox"
                              id="joinedWhatsappCheckbox"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="w-5 h-5 accent-emerald-600 bg-white border-emerald-400 rounded-md cursor-pointer shrink-0"
                            />
                          </FormControl>
                          <label
                            htmlFor="joinedWhatsappCheckbox"
                            className="text-xs sm:text-sm text-slate-800 font-semibold cursor-pointer select-none"
                          >
                            I confirm that I have joined / will join the official WhatsApp Community Group <span className="text-red-500 font-bold">*</span>
                          </label>
                        </div>
                        <FormMessage className="text-red-600 text-xs font-semibold mt-1" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <ShimmerButton
                    type="submit"
                    disabled={isSubmitting}
                    shimmerColor="#38bdf8"
                    background="#0284c7"
                    borderRadius="16px"
                    className="w-full h-14 text-base sm:text-lg font-bold shadow-xl shadow-sky-600/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        <span>Confirming Seat...</span>
                      </span>
                    ) : (
                      <span>Complete Free Registration</span>
                    )}
                  </ShimmerButton>
                  <p className="text-center text-[11px] text-slate-500 mt-3">
                    By registering, you agree to receive session links and technical lab credentials via email and WhatsApp.
                  </p>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>

      {/* Compulsory WhatsApp Notification Modal Popup */}
      {showWhatsAppModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-emerald-500 p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowWhatsAppModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close notification"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
              <MessageCircle size={36} />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 border border-red-200 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Compulsory Action
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Join the Official WhatsApp Community
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto pt-1">
                Your spot is confirmed! All live lecture Zoom links, EDA lab credentials, design resources, and <strong>physical silicon TAPEOUT announcements</strong> are distributed <strong>exclusively</strong> via our official WhatsApp community.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowWhatsAppModal(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 text-sm sm:text-base shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Join Official WhatsApp Group Now</span>
                <ExternalLink size={18} />
              </a>

              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="w-full text-xs font-semibold text-slate-500 hover:text-slate-800 py-1.5 transition-colors"
              >
                I have already joined the WhatsApp group
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
