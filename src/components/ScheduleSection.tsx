export function ScheduleSection() {
  return (
    <section className="py-20 bg-transparent transition-colors duration-500" id="schedule" data-bgcolor="#f8fafc" data-textcolor="#0f172a">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Program Schedule</h2>
        <p className="text-slate-600 mb-8">4 Weekends • Saturdays & Sundays • Starting October 24, 2026</p>
        <div className="inline-flex flex-col gap-4">
          <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h4 className="text-xl font-bold text-slate-900">Weekend 1-4</h4>
              <p className="text-slate-600 text-sm">From 7:30 PM IST (Saturdays & Sundays)</p>
            </div>
            <a 
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=IEEE+RF+IC+Design+Micro-Specialization&details=4+Weekends+%E2%80%A2+Saturdays+%26+Sundays+%E2%80%A2+From+7%3A30+PM+IST&dates=20261024T140000Z/20261024T160000Z&recur=RRULE:FREQ=WEEKLY;BYDAY=SA,SU;COUNT=8" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sky-600 border border-sky-300 hover:bg-sky-50 px-6 py-3 rounded-full transition-colors text-sm font-medium whitespace-nowrap"
            >
              Add to Google Calendar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
