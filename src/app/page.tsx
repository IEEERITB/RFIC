import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { ScrollExpandSection } from "@/components/ScrollExpandSection";
import { ToolchainMatrix } from "@/components/ToolchainMatrix";
import { CurriculumSection } from "@/components/CurriculumSection";
import { StakeholdersSection } from "@/components/StakeholdersSection";
import { CertificationSection } from "@/components/CertificationSection";
import { ScheduleSection } from "@/components/ScheduleSection";
import { RegistrationForm } from "@/components/RegistrationForm";
export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />
      <HeroSection />
      <ScrollExpandSection />
      <ToolchainMatrix />
      <CurriculumSection />
      <StakeholdersSection />
      <CertificationSection />
      <ScheduleSection />
      <RegistrationForm />
      <Footer />
    </main>
  );
}
