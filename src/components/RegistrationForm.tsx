"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
import { ExternalLink, CheckCircle2, X } from "lucide-react";

export const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/H8zM8URfnS98mMCONT2E2L";

export function RegistrationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIeeeMember, setIsIeeeMember] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      category: "",
      institutionOrCompany: "",
      ieeeMember: false,
      ieeeMembershipId: "",
      githubHandle: "",
      experienceLevel: "",
      joinedWhatsapp: false,
    },
  });

  async function onSubmit(data: RegistrationFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      toast({
        title: "Registration Successful!",
        description: "Your spot has been reserved! Joining the WhatsApp community is mandatory for all access links.",
        variant: "default",
        className: "bg-emerald-600 text-white border-none",
      });
      
      setRegistrationSuccess(true);
      setShowWhatsAppModal(true);

      // Attempt to immediately open WhatsApp invite link in a new tab
      try {
        window.open(WHATSAPP_GROUP_URL, "_blank");
      } catch (err) {
        console.error("Popup was prevented:", err);
      }

      form.reset();
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200 relative" id="register">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Secure Your Spot</h2>
          <p className="text-slate-600">Register for the IEEE RF IC Design Micro-Specialization series.</p>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-xl border border-slate-200 shadow-md">
          {registrationSuccess ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Registration Confirmed!</h3>
                <p className="text-slate-600 max-w-md mx-auto text-sm">
                  Your registration for the IEEE RF IC Design Series has been received.
                </p>
              </div>

              {/* Compulsory Next Step Banner */}
              <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-500/50 max-w-lg mx-auto text-left space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Mandatory Action
                  </span>
                  <h4 className="font-bold text-emerald-950 text-base">Join the Official WhatsApp Community</h4>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  All live lecture Zoom links, EDA lab credentials, design files, and physical silicon <strong>TAPEOUT announcements</strong> are shared exclusively through this community group.
                </p>
                <a
                  href={WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md shadow-emerald-600/30 transition-transform hover:scale-[1.02]"
                >
                  <span>Join Official WhatsApp Group</span>
                  <ExternalLink size={16} />
                </a>
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setRegistrationSuccess(false)}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Register Another Participant
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900">Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your official / student email address" className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900">Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+91 98765 43210" className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900">Participant Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500">
                          <SelectItem value="Student (Ramaiah / MSRIT)">Student (Ramaiah / MSRIT)</SelectItem>
                          <SelectItem value="Student (External College / University)">Student (External College / University)</SelectItem>
                          <SelectItem value="Research Scholar / PhD Candidate">Research Scholar / PhD Candidate</SelectItem>
                          <SelectItem value="Industry / Working Professional">Industry / Working Professional</SelectItem>
                          <SelectItem value="Faculty / Academia">Faculty / Academia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="institutionOrCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900">Institution or Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Ramaiah Institute of Technology / Intel / TI" className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-200 pt-6 mt-6">
                 <FormField
                  control={form.control}
                  name="ieeeMember"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base text-slate-900">
                          IEEE Member
                        </FormLabel>
                        <FormDescription className="text-slate-500">
                          Are you a current IEEE member?
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
                          className="w-5 h-5 accent-sky-600 bg-white border-slate-300 rounded"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {isIeeeMember && (
                  <FormField
                    control={form.control}
                    name="ieeeMembershipId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-900">IEEE Membership ID</FormLabel>
                        <FormControl>
                          <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Enter your ID (numbers only)" className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900">Experience Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500">
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500">
                          <SelectItem value="Beginner (No prior tape-out)">Beginner (No prior tape-out)</SelectItem>
                          <SelectItem value="Intermediate (Basic Analog/VLSI)">Intermediate (Basic Analog/VLSI)</SelectItem>
                          <SelectItem value="Advanced (RF IC / Past Tape-outs)">Advanced (RF IC / Past Tape-outs)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="githubHandle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900">GitHub Profile URL (For Capstone)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/username" className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Compulsory WhatsApp Community Group Section */}
              <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-50/50 p-5 space-y-4 mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20 font-bold text-sm">
                      WA
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">Official WhatsApp Community Group</h4>
                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Compulsory
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Joining is <strong>mandatory</strong> for all registered participants. Meeting links, lab toolchains, and student silicon tape-out updates will be posted here.
                      </p>
                    </div>
                  </div>

                  <a
                    href={WHATSAPP_GROUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => form.setValue("joinedWhatsapp", true, { shouldValidate: true })}
                    className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                  >
                    <span>Join WhatsApp Group</span>
                    <ExternalLink size={14} />
                  </a>
                </div>

                <FormField
                  control={form.control}
                  name="joinedWhatsapp"
                  render={({ field }) => (
                    <FormItem className="pt-2 border-t border-emerald-200/60">
                      <div className="flex items-center gap-3">
                        <FormControl>
                          <input
                            type="checkbox"
                            id="joinedWhatsappCheckbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="w-5 h-5 accent-emerald-600 bg-white border-emerald-400 rounded cursor-pointer"
                          />
                        </FormControl>
                        <label htmlFor="joinedWhatsappCheckbox" className="text-xs sm:text-sm text-slate-800 font-medium cursor-pointer">
                          I confirm that I have joined / will join the official WhatsApp Community Group (Mandatory) <span className="text-red-500 font-bold">*</span>
                        </label>
                      </div>
                      <FormMessage className="text-red-600 text-xs font-semibold mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold h-12 text-lg shadow-md shadow-sky-600/20 mt-8">
                {isSubmitting ? "Registering..." : "Submit Registration"}
              </Button>
            </form>
          </Form>
        )}
      </div>
      </div>

      {/* Compulsory WhatsApp Notification Modal Popup */}
      {showWhatsAppModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-emerald-500 p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowWhatsAppModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close notification"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
              <svg className="w-10 h-10 fill-emerald-600" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.974.55 1.954.88 2.8.88 3.179 0 5.767-2.587 5.768-5.766.001-3.18-2.586-5.766-5.772-5.766zm6.73 9.475c-.328.92-1.639 1.704-2.28 1.765-.635.06-1.465.083-2.392-.214-1.127-.361-2.525-1.144-3.69-2.308-1.428-1.427-2.38-3.158-2.677-4.102-.303-.967-.02-1.928.384-2.454.275-.357.653-.52 1.017-.52.235 0 .445.023.616.035.215.015.424-.047.585.344.209.51.714 1.745.777 1.874.063.129.105.281.02.45-.084.17-.126.275-.252.423-.127.148-.27.33-.385.443-.128.125-.262.261-.113.518.148.256.66 1.088 1.417 1.762.974.869 1.796 1.139 2.052 1.267.257.128.406.107.558-.069.152-.176.654-.763.83-1.024.175-.262.35-.218.59-.129.24.088 1.52.717 1.782.848.262.131.437.197.502.307.065.109.065.633-.263 1.553z" />
              </svg>
            </div>

            {/* Notification Text */}
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 border border-red-200 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Compulsory Step Required
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Join the Official WhatsApp Community
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto pt-1">
                Your spot is confirmed! However, all live lecture Zoom links, EDA lab credentials, design resources, and <strong>physical silicon TAPEOUT announcements</strong> are distributed <strong>exclusively</strong> via our official WhatsApp community.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <a
                href={WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowWhatsAppModal(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 text-base shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95"
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
