export interface Speaker {
  id: string;
  name: string;
  roleTitle: string;
  organization: string;
  avatarUrl?: string;
  bio: string;
  linkedInUrl?: string;
}

export const speakers: Speaker[] = [
  {
    id: "sumanto_kar",
    name: "Sumanto Kar",
    roleTitle: "Series Lead Mentor & Module 1.1 Lead",
    organization: "FOSSEE, IIT Bombay",
    avatarUrl: "/stakeholders/sumanto-kar.jpg",
    bio: "Project Research Engineer at FOSSEE, IIT Bombay. Lead contributor to eSim open-source EDA platform and Technical Mentor for the IEEE RF IC Design Series.",
    linkedInUrl: "https://www.linkedin.com/in/sumanto-kar-0424391a9",
  },
  {
    id: "dr_darshak_bhatt",
    name: "Dr. Darshak Bhatt",
    roleTitle: "Associate Professor, IIT Roorkee • Module 1.2 & 5 Lead",
    organization: "Department of ECE, IIT Roorkee",
    avatarUrl: "/stakeholders/darshak-bhatt.jpg",
    bio: "Associate Professor in the Department of Electronics and Communication Engineering at IIT Roorkee. Research domains include RF & Mixed-Signal IC design, high-frequency transceiver architectures, frequency synthesizers (PLLs), and analog/RF EDA.",
    linkedInUrl: "https://www.linkedin.com/in/darshak-bhatt-b0576424",
  },

  {
    id: "abdur_rahman",
    name: "Abdur Rahman",
    roleTitle: "Module 2 Device Modeling Lead",
    organization: "IHP Microelectronics",
    bio: "Specializes in high-frequency device modeling and SiGe BiCMOS physics at IHP.",
  },
  {
    id: "yegappan_sethu",
    name: "Yegappan Sethu",
    roleTitle: "Module 7 EM Parasitics Extraction",
    organization: "Field Solver & EDA Specialist",
    bio: "Specialist in 3D Electromagnetic solving and parasitic extraction for physical verification.",
  },
  {
    id: "krzysztof_herman",
    name: "Krzysztof Herman",
    roleTitle: "Module 8 MPW Tape-Out Submission Pipeline",
    organization: "IHP Open-Silicon Team",
    bio: "Provides insights on MPW pipelines and Efabless/IHP open shuttle submissions.",
  },
  {
    id: "rene_scholz",
    name: "Rene Scholz",
    roleTitle: "Series Advisor & Contributor",
    organization: "IHP Microelectronics",
    bio: "Provides advisory insights on the complete FOSS to silicon flow.",
  }
];
