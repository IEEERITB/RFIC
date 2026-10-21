import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";

export function ScheduleSection() {
  const weekends = [
    {
      weekend: "Weekend 1",
      dates: "Oct 24 - Oct 25, 2026",
      title: "Architecture & Device Physics",
      modules: "Module 1 (Part 1.1 & 1.2) & Module 2",
      lead: "Sumanto Kar (IIT-B), Dr. Darshak Bhatt (IIT-R), Abdur Rahman (IHP)",
      status: "Session 1 & 2",
    },
    {
      weekend: "Weekend 2",
      dates: "Oct 31 - Nov 01, 2026",
      title: "RF Circuits & S-Parameters",
      modules: "Module 3 (High-Frequency LNA) & Module 4 (Mixers)",
      lead: "Industry Mentors & Technical Leads",
      status: "Session 3 & 4",
    },
    {
      weekend: "Weekend 3",
      dates: "Nov 07 - Nov 08, 2026",
      title: "Mask Layout & 3D EM Parasitics",
      modules: "Module 5 (Mask Layout) & Module 6 (openEMS Modeling)",
      lead: "Dr. Darshak Bhatt & Yegappan Sethu",
      status: "Session 5 & 6",
    },
    {
      weekend: "Weekend 4",
      dates: "Nov 14 - Nov 15, 2026",
      title: "Tape-Out Pipeline & Sign-off",
      modules: "Module 7 (DRC/LVS) & Module 8 (MPW Submission)",
      lead: "Krzysztof Herman (IHP) & Rene Scholz",
      status: "Session 7 & 8",
    },
  ];

  const calendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=IEEE+RF+IC+Design+Micro-Specialization&details=4+Weekends+%E2%80%A2+Saturdays+%26+Sundays+%E2%80%A2+From+7%3A30+PM+IST&dates=20261024T140000Z/20261024T160000Z&recur=RRULE:FREQ=WEEKLY;BYDAY=SA,SU;COUNT=8";

  return (
    <section
      className="py-20 sm:py-24 bg-slate-50 border-b border-slate-200/60"
      id="schedule"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-12 sm:mb-16">
          <Badge
            variant="outline"
            className="mb-4 border-sky-300 text-sky-700 bg-sky-50 px-3 py-1 text-xs uppercase tracking-wider font-semibold"
          >
            Live Online Masterclass
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Masterclass Schedule & Roadmap
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            Structured across 4 consecutive weekends with live online lectures, interactive hands-on lab sessions, and live tape-out office hours.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 bg-white/90 border border-slate-200 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs">
            <Clock size={16} className="text-teal-600" />
            <span>Every Saturday & Sunday • 7:30 PM – 9:30 PM IST (UTC+5:30)</span>
          </div>
        </div>

        {/* 4 Weekends Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {weekends.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-sky-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono font-bold text-xs bg-sky-100 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-lg">
                    {item.weekend}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Calendar size={13} className="text-sky-600" />
                    <span>{item.dates}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-medium text-sky-700 mb-3">
                  {item.modules}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  <span className="font-semibold text-slate-700">Instructors: </span>
                  {item.lead}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>Interactive EDA Lab Included</span>
                </span>
                <span>{item.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar Sync Card */}
        <div className="bg-gradient-to-r from-sky-600 to-teal-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Add Masterclass Sessions to Calendar
            </h3>
            <p className="text-sky-100 text-xs sm:text-sm max-w-lg">
              Never miss a live session. Sync all 8 weekend lectures and lab milestones directly to Google Calendar.
            </p>
          </div>

          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-white hover:bg-sky-50 text-sky-900 font-bold px-6 py-3.5 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-sm"
          >
            <Calendar size={16} className="text-sky-600" />
            <span>Add to Google Calendar</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
