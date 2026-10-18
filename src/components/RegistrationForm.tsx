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
import { ExternalLink, CheckCircle2 } from "lucide-react";

export function RegistrationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIeeeMember, setIsIeeeMember] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      category: "STUDENT_RIT",
      institutionOrCompany: "",
      ieeeMember: false,
      ieeeMembershipId: "",
      githubHandle: "",
      experienceLevel: "BEGINNER",
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
        description: "Your spot has been reserved! Make sure you join the official WhatsApp group for live access links.",
        variant: "default",
        className: "bg-sky-600 text-white border-none",
      });
      
      setRegistrationSuccess(true);
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
    <section className="py-20 bg-slate-50 border-t border-slate-200" id="register">
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
                  href="https://chat.whatsapp.com/IEEE-RFIC-OpenSilicon"
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
                        <Input placeholder="John Doe" className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500" {...field} />
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
                        <Input type="email" placeholder="john@example.com" className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500" {...field} />
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
                        <Input type="tel" placeholder="+1..." className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500">
                          <SelectItem value="STUDENT_RIT">Student (RIT)</SelectItem>
                          <SelectItem value="STUDENT_EXTERNAL">Student (External)</SelectItem>
                          <SelectItem value="RESEARCH_SCHOLAR">Research Scholar / PhD</SelectItem>
                          <SelectItem value="INDUSTRY_YP">Industry / Young Professional</SelectItem>
                          <SelectItem value="ACADEMIA">Academia / Faculty</SelectItem>
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
                      <Input placeholder="University of XYZ / Intel" className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-500">
                          <SelectItem value="BEGINNER">Beginner (No prior tape-out)</SelectItem>
                          <SelectItem value="INTERMEDIATE_ANALOG">Intermediate (Basic Analog/VLSI)</SelectItem>
                          <SelectItem value="ADVANCED_RF">Advanced (RF IC / Past Tape-outs)</SelectItem>
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
                    href="https://chat.whatsapp.com/IEEE-RFIC-OpenSilicon"
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
    </section>
  );
}
