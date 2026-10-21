export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  category: "guide" | "curator" | "advisor" | "mentor" | "organiser" | "resource";
  categoryLabel: string;
  organization: string;
  avatarUrl?: string;
  bio: string;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  emails?: string[];
}

export const advisoryStakeholders: Stakeholder[] = [
  {
    id: "vinayak_pachkawade",
    name: "Dr. Vinayak Pachkawade",
    role: "Series Guide & Mentor",
    category: "guide",
    categoryLabel: "Series Guide & Mentor",
    organization: "Advisory and Technical Governance across STEM sectors, VPACHKAWADE",
    avatarUrl: "/stakeholders/vinayak-pachkawade.jpg",
    bio: "Advisor and non-executive independent director specializing in solid-state electronics, precision sensor systems, and micro-nanotechnology. Backed by Ph.D. in Engineering and Technology Sciences and long-standing international experience, his expertise and technical frameworks are published across high-impact global platforms.",
    linkedInUrl: "https://www.linkedin.com/in/pachkawade/",
    portfolioUrl: "https://www.vpachkawadeworld.com",
  },
  {
    id: "sumanto_kar",
    name: "Sumanto Kar",
    role: "Technical Mentor • Module 1.1 Lead",
    category: "mentor",
    categoryLabel: "Technical Mentor",
    organization: "Project Research Engineer, FOSSEE, IIT Bombay • Open-Source EDA",
    avatarUrl: "/stakeholders/sumanto-kar.jpg",
    bio: "Sumanto Kar completed his M.Tech in Industrial Engineering & Operations Research from IIT Bombay and B.E. in Electronics Engineering from Mumbai University. His interests lie in contributing to open-source EDA tools. He is actively involved with the FOSSEE project, contributing to the development, integration, documentation, and outreach of eSim, an open-source EDA platform used across universities in India. His work focuses on strengthening open technical ecosystems, enabling reproducible engineering workflows, and bridging the gap between academic research and community-driven software development.",
    linkedInUrl: "https://www.linkedin.com/in/sumanto-kar-0424391a9",
    portfolioUrl: "https://homepages.iitb.ac.in/~sumantokar/",
    githubUrl: "https://github.com/Eyantra698Sumanto",
  },
  {
    id: "dr_darshak_bhatt",
    name: "Dr. Darshak Bhatt",
    role: "Technical Mentor • Module 1.2 & 5 Lead",
    category: "mentor",
    categoryLabel: "Technical Mentor",
    organization: "Associate Professor, Dept. of ECE, IIT Roorkee",
    avatarUrl: "/stakeholders/darshak-bhatt.jpg",
    bio: "Associate Professor in the Department of Electronics and Communication Engineering at Indian Institute of Technology Roorkee (IIT Roorkee). His specialized research domains encompass RF and Mixed-Signal IC design, high-frequency transceiver architectures, frequency synthesizers (PLLs), and analog/RF open-source EDA methodologies.",
    linkedInUrl: "https://www.linkedin.com/in/darshak-bhatt-b0576424",
    portfolioUrl: "https://iitr.ac.in/Departments/Electronics%20and%20Communication%20Engineering%20Department/People/Faculty/100822.html",
  },
  {
    id: "souhadra_shrivastava",
    name: "Souhadra Shrivastava",
    role: "Course Curator",
    category: "curator",
    categoryLabel: "Course Curator",
    organization: "SDE at Kodnest • Ex-Sarvm AI • IEEE-Published Researcher",
    avatarUrl: "/stakeholders/souhadra-shrivastava.jpeg",
    bio: "Electronics & Telecommunication Engineering graduate from MS Ramaiah Institute of Technology, Bangalore, currently working as an SDE at Kodnest. Previously, he worked as an AI Product Manager at Sarvm AI, focusing on multilingual text-to-speech technologies.\n\nHis research focuses on silicon photonics and EDA, where he builds AI-driven tools that use topology optimization to discover novel photonic chip structures, with GDSII export and fabrication constraints for foundry-ready layouts. He has also developed edge-AI hardware systems, including a real-time Braille-to-English converter on Jetson Orin, and built multi-agent AI systems at hackathons. Independently, he explores AI evaluations and agent memory, consults for educational institutions on AI adoption, and works as a freelance writer.\n\nBeyond technology and research, he is actively involved in social service, volunteering for animal welfare and participating in rescue missions during natural disasters. His commitment to helping vulnerable animals and communities reflects his sense of compassion, responsibility, and service.\n\nA former Chair of the IEEE Sensors Council RIT-B and recipient of the Best Outgoing EC Member Award 2025, he brings strong leadership, collaboration, and teamwork skills. He has also co-authored an IEEE publication on machine learning analysis of biological signal responses to music.",
    linkedInUrl: "https://in.linkedin.com/in/souhadra-shrivastava",
    githubUrl: "https://github.com/Souhadra",
  },
  {
    id: "dr_ramya_hr",
    name: "Dr. Ramya H. R.",
    role: "Faculty Advisor",
    category: "advisor",
    categoryLabel: "Faculty Advisor",
    organization: "Associate Professor, Dept. of ETE, Ramaiah Institute of Technology (MSRIT)",
    avatarUrl: "/stakeholders/dr-ramya-hr.jpg",
    bio: "Associate Professor in the Department of Electronics and Telecommunication Engineering at M.S. Ramaiah Institute of Technology with 21 years of experience. Her research interests span neural networks, fuzzy logic, machine learning, and Verilog design. She has published extensively in Scopus-indexed journals and conferences, with focus on medical image fusion, machine learning applications in healthcare, and signal processing. Dr. Ramya has established industry collaborations with Intel-Altera, Texas Instruments India, and Starcom Information Technology Limited to develop specialized labs and courses. She holds a design patent for \"Multiband Antenna Tuning Device for 5G Networks\" (Patent No. 450853-001).",
    portfolioUrl: "https://www.msrit.edu/department/faculty-detail.html?dept=te&ID=8",
  },
];

export const resourcePersons: Stakeholder[] = [
  {
    id: "dr_gs_javed",
    name: "Dr. G S Javed",
    role: "Resource Person • Analog IC Architect",
    category: "resource",
    categoryLabel: "Resource Person",
    organization: "VLSI Coach, JSG Labs • CIO, King Consultants • Ex-Intel Foundry",
    avatarUrl: "/stakeholders/dr-gs-javed.jpeg",
    bio: `Dr G S Javed is an Architect and Analog IC design manager with 17+ years of experience in design of Analog Mixed Signal (AMS) and SerDes IP Circuits. Currently, he is VLSI Coach and Semiconductor Consultant at JSG Labs and Chief Innovation Officer (CIO) at King Consultants Education.

He received his M.S. and Ph.D. from the Indian Institute of Science (IISc), Bangalore. He worked on low power integrated instrumentation circuits for sensing applications. In 2015, he founded King Consultants Education (http://tiny.cc/KingConsultants) to work on Design Thinking and Experiential Learning. He also is an advisor/guide for PhD aspirants.

⚜️ From 2023 - 2026, he was the Analog IP Design Manager in the Advanced Design division at Intel Foundry.

⚜️ From 2020 - 2023, he was the Technical Lead - Analog for the High Bandwidth Memory (HBM) and DDR PHY team in Intel.

⚜️ From 2016 - 2020, he led the team on High Speed Circuits, setup and managed the R&D team and managed a team of 10+ designers at Terminus Circuits Pvt Ltd.

⚜️ From 2012 - 2016, he was a Senior Research Fellow at IISc working on integrated sensor interfaces. He has over 35 peer reviewed journals and IEEE conference publications to his credit.

He is an active IEEE volunteer of 17 years. He is a Senior Member of the IEEE (2016) and was inducted into the IEEE Eta Kappa Nu (HKN) - the Honour society of IEEE in 2017 for Academic Excellence. He has served as the Chairperson of IEEE Technology Engineering and Management Society (TEMS) Bangalore Chapter in 2023. He is associated as a Member of the EXECOM of IEEE CASS, SSCS, Sensors Council, SIGHT, Consultant Network and RFID council in Bangalore. He was the Educational activities Chair/Co-Chair in the IEEE Bangalore Section execom from 2017 - 2019. He is the 2025-2026 Chairperson, IEEE Consultant Network Affinity Group (CNAG) Bangalore Chapter.

He is also an active speaker and motivator on Analog Mixed Signal Circuit Design, High Speed SerDes Design, Design Thinking, Entrepreneurship, Research Methodologies and Technical Writing. He has delivered 200+ invited talks on his topics of interest.

Dr G S Javed
Founder, King Consultants Education
Chief Mentor and VLSI Coach, JSG Labs

Chair, 2026 IEEE CNAG Bangalore Chapter
Chair, 2023 IEEE TEMS Bangalore Chapter`,
    linkedInUrl: "https://in.linkedin.com/in/javed-g-s-phd-612491a",
    portfolioUrl: "http://tiny.cc/KingConsultants",
  },
  {
    id: "sumanto_kar_resource",
    name: "Sumanto Kar",
    role: "Resource Person • Open-Source EDA",
    category: "resource",
    categoryLabel: "Resource Person",
    organization: "Project Research Engineer, FOSSEE, IIT Bombay • Open-Source EDA",
    avatarUrl: "/stakeholders/sumanto-kar.jpg",
    bio: "Sumanto Kar completed his M.Tech in Industrial Engineering & Operations Research from IIT Bombay and B.E. in Electronics Engineering from Mumbai University. His interests lie in contributing to open-source EDA tools. He is actively involved with the FOSSEE project, contributing to the development, integration, documentation, and outreach of eSim, an open-source EDA platform used across universities in India. His work focuses on strengthening open technical ecosystems, enabling reproducible engineering workflows, and bridging the gap between academic research and community-driven software development.",
    linkedInUrl: "https://www.linkedin.com/in/sumanto-kar-0424391a9",
    portfolioUrl: "https://homepages.iitb.ac.in/~sumantokar/",
    githubUrl: "https://github.com/Eyantra698Sumanto",
  },
  {
    id: "dr_darshak_bhatt_resource",
    name: "Dr. Darshak Bhatt",
    role: "Resource Person • RF & Mixed-Signal IC",
    category: "resource",
    categoryLabel: "Resource Person",
    organization: "Associate Professor, Dept. of ECE, IIT Roorkee",
    avatarUrl: "/stakeholders/darshak-bhatt.jpg",
    bio: "Associate Professor in the Department of Electronics and Communication Engineering at Indian Institute of Technology Roorkee (IIT Roorkee). His specialized research domains encompass RF and Mixed-Signal IC design, high-frequency transceiver architectures, frequency synthesizers (PLLs), and analog/RF open-source EDA methodologies.",
    linkedInUrl: "https://www.linkedin.com/in/darshak-bhatt-b0576424",
    portfolioUrl: "https://iitr.ac.in/Departments/Electronics%20and%20Communication%20Engineering%20Department/People/Faculty/100822.html",
  },
];

export const organisingCommittee: Stakeholder[] = [
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
    emails: ["trivedipriyanshu@ieee.org"],
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

export const stakeholders: Stakeholder[] = [
  ...advisoryStakeholders,
  resourcePersons[0], // Dr. G S Javed
  ...organisingCommittee,
];
