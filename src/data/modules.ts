export interface Module {
  moduleNumber: number;
  title: string;
  focusArea: string;
  technicalTopics: string[];
  fossTooling: string[];
  date: string;
  time: string;
  speakerIds: string[];
}

export const modules: Module[] = [
  {
    moduleNumber: 1,
    title: "High-Frequency Wireless Transceiver Architectures",
    focusArea: "Architectural Theory",
    technicalTopics: [
      "Homodyne vs Heterodyne",
      "Image Rejection",
      "Link Budget",
      "Noise Figure (NF)",
      "Linearity (1-dB Compression & IIP3)"
    ],
    fossTooling: [],
    date: "Sept 5, 2026",
    time: "10:00 AM - 1:00 PM IST",
    speakerIds: []
  },
  {
    moduleNumber: 2,
    title: "High-Frequency Device Modeling & PDK Architecture",
    focusArea: "Device Physics & PDK",
    technicalTopics: [
      "High-frequency parasitic behaviors in MOSFETs",
      "Semiconductor & BiCMOS physics",
      "Deep dive into Open-Source PDKs (OS PDKs)"
    ],
    fossTooling: ["Xschem", "Ngspice"],
    date: "Sept 6, 2026",
    time: "10:00 AM - 1:00 PM IST",
    speakerIds: ["abdur_rahman"]
  },
  {
    moduleNumber: 3,
    title: "Low Noise Amplifier (LNA) Design & Impedance Matching",
    focusArea: "LNA Design",
    technicalTopics: [
      "Inductive Degeneration",
      "Common-Gate topologies",
      "Noise matching optimization",
      "Wideband matching"
    ],
    fossTooling: ["Xschem", "Ngspice", "Python (scikit-rf, matplotlib)"],
    date: "Sept 12, 2026",
    time: "10:00 AM - 1:00 PM IST",
    speakerIds: []
  },
  {
    moduleNumber: 4,
    title: "High-Efficiency Power Amplifiers (PA) for Transmitters",
    focusArea: "PA Design",
    technicalTopics: [
      "Linear classes (A, AB, B, C) vs Switching classes (D, E, F)",
      "PAE calculations",
      "Load-pull analysis",
      "Thermal bottlenecks"
    ],
    fossTooling: ["Xschem", "Ngspice"],
    date: "Sept 13, 2026",
    time: "10:00 AM - 1:00 PM IST",
    speakerIds: []
  },
  {
    moduleNumber: 5,
    title: "Frequency Mixers & Local Oscillator Interfacing",
    focusArea: "Mixers & LO",
    technicalTopics: [
      "Passive vs Active Mixers",
      "Double-Balanced Gilbert Cells",
      "Conversion gain",
      "Isolation parameters",
      "PLL synthesizer interface"
    ],
    fossTooling: ["Ngspice (Multi-tone analysis)"],
    date: "Sept 19, 2026",
    time: "10:00 AM - 1:00 PM IST",
    speakerIds: []
  },
  {
    moduleNumber: 6,
    title: "Physical RF Design & Custom Layout Strategies",
    focusArea: "Layout",
    technicalTopics: [
      "Substrate noise coupling minimization",
      "Cross-talk reduction",
      "Symmetrical differential pairs",
      "Guard rings",
      "On-chip planar inductors"
    ],
    fossTooling: ["KLayout"],
    date: "Sept 20, 2026",
    time: "10:00 AM - 1:00 PM IST",
    speakerIds: []
  },
  {
    moduleNumber: 7,
    title: "Physical Verification (DRC/LVS) & EM Parasitic Extraction",
    focusArea: "Verification & Extraction",
    technicalTopics: [
      "Geometric DRC rules",
      "Netgen LVS mechanisms",
      "Parasitic Extraction (PEX)",
      "Post-layout re-simulation"
    ],
    fossTooling: ["KLayout Geometry DRC", "Netgen", "openEMS"],
    date: "Sept 26, 2026",
    time: "10:00 AM - 1:00 PM IST",
    speakerIds: ["yegappan_sethu", "sumanto_kar"]
  },
  {
    moduleNumber: 8,
    title: "Silicon Validation, Tape-Out Pipelines & Career Roadmap",
    focusArea: "Tape-Out & Careers",
    technicalTopics: [
      "Multi-Project Wafer (MPW) pipelines",
      "Open MPW shuttle submission & Student Tape-Out",
      "Vector Network Analyzer (VNA) validation",
      "Career roadmap & silicon tape-out pathways"
    ],
    fossTooling: ["Open-Silicon Tape-Out Flow"],
    date: "Sept 27, 2026",
    time: "10:00 AM - 1:00 PM IST",
    speakerIds: ["dr_gs_javed", "krzysztof_herman"]
  }
];
