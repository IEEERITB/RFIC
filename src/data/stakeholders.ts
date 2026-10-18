export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  category: "guide" | "curator" | "advisor" | "organiser";
  categoryLabel: string;
  organization: string;
  avatarUrl?: string;
  bio: string;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  emails?: string[];
}

export const stakeholders: Stakeholder[] = [
  {
    id: "vinayak_pachkawade",
    name: "Dr. Vinayak Pachkawade",
    role: "Series Guide & Mentor",
    category: "guide",
    categoryLabel: "Series Guide & Mentor",
    organization: "Founder & Director, VPACHKAWADE Advisory • Ex-Univ. of Liège",
    avatarUrl: "/stakeholders/vinayak-pachkawade.jpg",
    bio: "Advanced non-executive advisor and researcher specializing in solid-state electronics, precision sensor systems, and micro-nanotechnology. Backed by Ph.D.-level expertise in Engineering and Technology Sciences from the University of Liège, Belgium, and author of Springer reference literature in 21st-century micro-nano systems.",
    linkedInUrl: "https://www.linkedin.com/in/pachkawade/",
    portfolioUrl: "https://www.vpachkawadeworld.com",
  },
  {
    id: "souhadra_shrivastava",
    name: "Souhadra Shrivastava",
    role: "Course Curator",
    category: "curator",
    categoryLabel: "Course Curator",
    organization: "AI Engineer & IEEE-Published Researcher",
    avatarUrl: "/stakeholders/souhadra-shrivastava.jpeg",
    bio: "Electronics & Telecom engineer, AI Engineer, and IEEE-published researcher working at the intersection of photonics and AI/ML.",
    linkedInUrl: "https://in.linkedin.com/in/souhadra-shrivastava",
    githubUrl: "https://github.com/Souhadra",
    portfolioUrl: "https://github.com/Souhadra",
  },
  {
    id: "dr_ramya_hr",
    name: "Dr. Ramya H. R.",
    role: "Faculty Advisor",
    category: "advisor",
    categoryLabel: "Faculty Advisor",
    organization: "Assistant Professor, Dept. of ETE, Ramaiah Institute of Technology (MSRIT)",
    avatarUrl: "/stakeholders/dr-ramya-hr.jpg",
    bio: "Assistant Professor in the Department of Electronics & Telecommunication Engineering at M.S. Ramaiah Institute of Technology, Bengaluru. Holds a Ph.D. and M.Tech from VTU with over 18+ years of academic and research experience across Logic Design, Microcontrollers, and Applied Machine Learning, actively mentoring student professional chapters.",
    portfolioUrl: "https://www.msrit.edu/department/faculty-detail.html?dept=te&ID=8",
    emails: ["ramya_hr@msrit.edu"],
  },
  {
    id: "priyanshu_trivedi",
    name: "Priyanshu Trivedi",
    role: "Lead Organiser",
    category: "organiser",
    categoryLabel: "Organiser",
    organization: "Chair, IEEE Sensors Council RIT-B • Founding Chair, IEEE TEMS RIT-B",
    avatarUrl: "/stakeholders/priyanshu-trivedi.jpg",
    bio: "Final-year Electronics and Telecommunication Engineering undergraduate at M.S. Ramaiah Institute of Technology, Bengaluru, working across embedded hardware, digital IC verification, and edge AI. Engineering experience spans designing electromechanical avionics systems for Edhitha UAS, building accelerated computer vision pipelines on embedded accelerators, and deploying agentic workflows. As Chair of IEEE Sensors Council RIT-B and Founding Chair of IEEE TEMS RIT-B, spearheads large-scale student initiatives, bridging academic study with open-source EDA workflows and physical silicon fabrication via the IEEE Open Silicon initiative.",
    linkedInUrl: "https://www.linkedin.com/in/priyanshu-trivedi-4a8746293",
    emails: ["trivedipriyanshu@ieee.org", "priyanshuranjan.academic@gmail.com"],
  },
  {
    id: "yashitha_d",
    name: "Yashitha D",
    role: "Course Manager",
    category: "organiser",
    categoryLabel: "Organiser",
    organization: "Vice Secretary, IEEE Sensors Council RIT-B",
    avatarUrl: "/stakeholders/yashitha-dore.jpeg",
    bio: "ECE undergraduate with experience in FPGA design, Verilog HDL, RTL verification, and embedded systems. Gained industry experience at Bharat Electronics Limited (BEL) and Vaidisys Technologies, working on FPGA design, synthesis, and timing analysis. Hands-on experience in ALU design, ESP32-based battery management systems, and sensor-integrated wearable technology. Vice Secretary of the IEEE Sensors Council, contributing to technical events and student engagement.",
    linkedInUrl: "https://www.linkedin.com/in/yashitha-dore-b58834326",
  },
  {
    id: "athar_sudhir_rao",
    name: "Athar Sudhir Rao",
    role: "Technical Lead",
    category: "organiser",
    categoryLabel: "Organiser",
    organization: "Mixed-Signal & RF Specialist • Ex-Intern, NAL",
    avatarUrl: "/stakeholders/atharv-rao.jpeg",
    bio: "Final-year Electronics and Telecommunication Engineering student with hands-on experience across mixed-signal architectures, RF systems, and VLSI design. Previously interned at National Aerospace Laboratories, where they designed a 16-bit SAR ADC using discrete ICs, and developed wearable textile antennas for healthcare applications. Technical expertise spans digital design with Verilog, FPGA-based prototyping, PCB layout in KiCad, and electromagnetic modeling using Ansys HFSS.",
    linkedInUrl: "https://www.linkedin.com/in/atharv-rao-42aa422a0",
  },
  {
    id: "yug_bhimani",
    name: "Yug Bhimani",
    role: "Webmaster & Technical Lead",
    category: "organiser",
    categoryLabel: "Organiser",
    organization: "Full-Stack Developer & Platform Architect",
    avatarUrl: "/stakeholders/yug-bhimani.png",
    bio: "Full-Stack Developer and Engineering Student leading the web platform architecture, digital infrastructure, and registration systems for the IEEE RF IC Design Series.",
    linkedInUrl: "https://www.linkedin.com/in/yug-bhimani-628407337",
  },
];
