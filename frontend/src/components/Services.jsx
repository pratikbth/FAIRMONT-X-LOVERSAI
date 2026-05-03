import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Services() {
  return (
    <section className="px-6 py-16 md:py-20" data-testid="services-section">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/studio"
          className="group block rounded-2xl glass-panel-heavy border border-[#C5A059]/35 px-8 py-12 text-white opacity-0 animate-fade-in-up transition-all duration-500 hover:-translate-y-1 hover:border-[#C5A059]/70 hover:bg-white/10 md:px-12 md:py-14"
        >
          <p className="text-center text-[11px] uppercase tracking-[0.34em] text-[#C5A059]">
            Fairmont Signature Collection
          </p>

          <h2 className="mt-5 text-center text-4xl leading-tight md:text-6xl">GOLD SERVICES</h2>

          <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-relaxed text-white/75 md:text-lg">
            A private tier crafted for guests who expect anticipation, discretion, and flawless
            execution at every moment.
          </p>

          <div className="mx-auto mt-8 h-px w-40 bg-[#C5A059]/55" />

          <div className="mt-8 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.28em] text-[#C5A059]">
            <span>Enter Gold Services</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.7}
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
