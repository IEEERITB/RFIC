import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[20rem] grid-cols-1 md:grid-cols-3 gap-5",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  badge,
}: {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: any;
  description: string;
  href?: string;
  cta?: string;
  badge?: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-xl hover:border-sky-300/80 transition-all duration-300 transform-gpu",
      className
    )}
  >
    {background && (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-300">
        {background}
      </div>
    )}

    <div className="relative z-10 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-700 group-hover:scale-105 transition-transform duration-200">
            <Icon className="h-6 w-6" />
          </div>
        )}
        {badge && (
          <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {badge}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-sky-700 transition-colors">
          {name}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>

    {cta && (
      <div className="relative z-10 pt-4 mt-auto">
        <a
          href={href || "#overview"}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 group-hover:text-sky-700 transition-colors"
        >
          <span>{cta}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>
    )}
  </div>
);
