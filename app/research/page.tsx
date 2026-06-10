"use client";

import React from "react";
import Link from "next/link";
import { 
  Printer, 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar, 
  Flame, 
  CheckCircle2, 
  ExternalLink,
  Target,
  Sparkles,
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";

export default function ResearchPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F6F8F4] text-[#0F2A1E] font-sans antialiased selection:bg-emerald-100 selection:text-emerald-800">
      
      {/* Floating Interactive Toolbar (Hidden on Print) */}
      <div className="no-print sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E3EADD] px-6 py-4 shadow-sm">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 font-semibold text-sm text-[#586b5e] hover:text-[#2E9A4F] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to EcoBins Homepage
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-[#2E9A4F] text-white font-extrabold text-sm px-5 py-2.5 rounded-full hover:bg-[#1F7A3D] transition-all shadow-[0_4px_14px_rgba(46,154,79,0.25)] active:scale-[0.98]"
          >
            <Printer size={16} />
            Save as PDF / Print Report
          </button>
        </div>
      </div>

      {/* Main Dossier Container */}
      <main className="mx-auto max-w-5xl px-6 py-12 md:py-16 print:py-0 print:px-0">
        
        {/* Document Border Frame (Screen Only) */}
        <article className="bg-white rounded-[24px] border border-[#E3EADD] shadow-[0_8px_30px_rgba(15,42,30,0.04)] overflow-hidden p-8 md:p-14 print:border-none print:shadow-none print:p-0">
          
          {/* Executive Header */}
          <header className="border-b-2 border-[#E3EADD] pb-10 mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-[#1F7A3D] text-[11px] font-extrabold tracking-wider uppercase rounded-md mb-3.5 print:bg-transparent print:p-0 print:text-[#1F7A3D]">
                  <Sparkles size={12} />
                  EcoBins Strategic Marketing Dossier
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0F2A1E]">
                  Melbourne's West Market Intel &amp; Local SEO Report
                </h1>
                <p className="mt-3 text-lg text-[#586b5e]">
                  A comprehensive regional study covering competitor pricing, search behaviors, and local government constraints in the City of Wyndham.
                </p>
              </div>
              <div className="flex-none bg-[#FAFCF8] border border-[#E3EADD] p-5 rounded-2xl md:text-right print:bg-transparent">
                <p className="text-xs font-bold text-[#586b5e] uppercase tracking-wider">Date Published</p>
                <p className="text-sm font-extrabold text-[#0F2A1E] mt-0.5">June 10, 2026</p>
                <p className="text-xs font-bold text-[#586b5e] uppercase tracking-wider mt-3">Author</p>
                <p className="text-sm font-extrabold text-[#0F2A1E] mt-0.5">EcoBins Growth Team</p>
                <p className="text-xs font-bold text-[#586b5e] uppercase tracking-wider mt-3">Target Region</p>
                <p className="text-sm font-extrabold text-[#0F2A1E] mt-0.5">Wyndham City Council, VIC</p>
              </div>
            </div>
          </header>

          {/* SECTION 1: Market & Demographics */}
          <section className="mb-14 print:break-inside-avoid">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-9 h-9 rounded-xl bg-emerald-50 text-[#2E9A4F] flex items-center justify-center print:bg-transparent">
                <TrendingUp size={20} />
              </span>
              <h2 className="text-2xl font-black text-[#0F2A1E] tracking-tight">
                1. The Wyndham Market Opportunity &amp; Catalysts
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#FAFCF8] border border-[#E3EADD] p-6 rounded-2xl print:bg-transparent">
                <h3 className="font-bold text-sm text-[#0C3A52] uppercase tracking-wider mb-2">The FOGO Opportunity</h3>
                <p className="text-[14px] text-[#586b5e] leading-relaxed">
                  Full <strong>green-lid FOGO bin rollout</strong> completed in March 2026. Unbagged raw food scraps rotting for up to 14 days have caused immediate demands for odor/maggot sanitisation.
                </p>
              </div>
              <div className="bg-[#FAFCF8] border border-[#E3EADD] p-6 rounded-2xl print:bg-transparent">
                <h3 className="font-bold text-sm text-[#0C3A52] uppercase tracking-wider mb-2">Booming Outer West</h3>
                <p className="text-[14px] text-[#586b5e] leading-relaxed">
                  Wyndham is one of Australia's fastest-growing municipal areas. High household sizes and young families produce massive waste volumes weekly.
                </p>
              </div>
              <div className="bg-[#FAFCF8] border border-[#E3EADD] p-6 rounded-2xl print:bg-transparent">
                <h3 className="font-bold text-sm text-[#0C3A52] uppercase tracking-wider mb-2">Council's Freeze Advice</h3>
                <p className="text-[14px] text-[#586b5e] leading-relaxed">
                  Council officially suggests residents <strong>freeze food scraps in home freezers</strong> until bin night. This highly unpopular DIY advice is a massive copy catalyst.
                </p>
              </div>
            </div>

            <div className="border border-[#E3EADD] rounded-2xl p-6 bg-amber-50/20 border-amber-200/50 print:bg-transparent print:border-[#E3EADD]">
              <h4 className="font-extrabold text-[#0C3A52] text-md mb-2 flex items-center gap-2">
                <Flame size={18} className="text-amber-600" />
                Strategic Executive Takeaway:
              </h4>
              <p className="text-[14.5px] text-[#586b5e] leading-relaxed">
                The combination of unlined green-lid bin regulations and zero public bin replacements for bad odours has generated a huge wave of household frustration. By pairing premium sanitisation services directly with scheduled local bin collection cycles, EcoBins can capture high-intent leads who are desperate to clear bad odours from their driveways.
              </p>
            </div>
          </section>

          {/* Page Break for Print */}
          <div className="page-break" />

          {/* SECTION 2: Competitor Analysis */}
          <section className="mb-14 print:break-inside-avoid">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-9 h-9 rounded-xl bg-emerald-50 text-[#2E9A4F] flex items-center justify-center print:bg-transparent">
                <FileSpreadsheet size={20} />
              </span>
              <h2 className="text-2xl font-black text-[#0F2A1E] tracking-tight">
                2. Regional Competitor Intelligence Breakdown
              </h2>
            </div>
            
            <p className="text-[#586b5e] text-sm mb-6">
              An auditing pass of active mobile operators across Melbourne's Outer West reveals key structural, pricing, and timing gaps that EcoBins can easily exploit:
            </p>

            <div className="space-y-6">
              
              {/* Competitor A */}
              <div className="border border-[#E3EADD] p-6 rounded-2xl relative">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                  <div>
                    <h3 className="font-black text-lg text-[#0F2A1E]">Competitor A: Eco Bin Cleaning</h3>
                    <p className="text-xs font-semibold text-[#2E9A4F] mt-0.5">Active across Altona, Tarneit, Hoppers Crossing, Sunshine</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 border border-[#E3EADD] text-[#2E9A4F] text-[11px] font-extrabold rounded-full print:bg-transparent">
                    Same-Day Cleans
                  </span>
                </div>
                <ul className="text-sm text-[#586b5e] space-y-2 mt-4">
                  <li>• <strong>Pricing:</strong> $12.00 (Weekly), $14.00 (Fortnightly), $18.00 (Monthly), $25.00 (One-Off). Add-on bins: $10.00</li>
                  <li>• <strong>Operational Model:</strong> Same-day cleaning. Self-contained wash rigs that filter and recycle runoff water. No lock-in contracts.</li>
                  <li>• <strong>Core Weakness:</strong> Flat basic website; pricing sits on the lower end, which may feel "cheap" or low-quality to premium master-planned estates (like Sanctuary Lakes).</li>
                </ul>
              </div>

              {/* Competitor B */}
              <div className="border border-[#E3EADD] p-6 rounded-2xl relative">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                  <div>
                    <h3 className="font-black text-lg text-[#0F2A1E]">Competitor B: Bin Juicer</h3>
                    <p className="text-xs font-semibold text-sky-600 mt-0.5">Active across Metro Melbourne &amp; Western Suburbs</p>
                  </div>
                  <span className="px-3 py-1 bg-sky-50 border border-sky-100 text-sky-700 text-[11px] font-extrabold rounded-full print:bg-transparent">
                    Subscription Focused
                  </span>
                </div>
                <ul className="text-sm text-[#586b5e] space-y-2 mt-4">
                  <li>• <strong>Pricing:</strong> $15.00 (Fortnightly - min 5 cleans), $17.50 (Monthly - min 3 cleans), $99.00 (One-Off, up to 2 bins)</li>
                  <li>• <strong>Operational Model:</strong> Mandatory automated payments. Scented soap rinse. Impose a rigid $15 "No Bin Left Out" card charge.</li>
                  <li>• <strong>Core Weakness:</strong> Heavy lock-in rules (e.g., minimum 5 cleans) and extremely expensive single entry point ($99 minimum) scares away casual customers.</li>
                </ul>
              </div>

              {/* Competitor C */}
              <div className="border border-[#E3EADD] p-6 rounded-2xl relative">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                  <div>
                    <h3 className="font-black text-lg text-[#0F2A1E]">Competitor C: The Bin Butlers</h3>
                    <p className="text-xs font-semibold text-amber-600 mt-0.5">Inner Melbourne West and Wyndham boundaries</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-50 border border-amber-100 text-amber-800 text-[11px] font-extrabold rounded-full print:bg-transparent">
                    Next-Day / Commercial
                  </span>
                </div>
                <ul className="text-sm text-[#586b5e] space-y-2 mt-4">
                  <li>• <strong>Pricing:</strong> Starts at $60.00 (First bin on One-off), quarterly options work out to ~$54.00 per clean.</li>
                  <li>• <strong>Operational Model:</strong> Cleans bins on the <strong>next business day</strong> following council empty. Hot-water high pressure rigs.</li>
                  <li>• <strong>Core Weakness:</strong> Extremely expensive for typical residential households. Cleaning the day after empty forces families to leave bins out overnight, violating council clearway guidelines.</li>
                </ul>
              </div>

            </div>
          </section>

          {/* Page Break for Print */}
          <div className="page-break" />

          {/* SECTION 3: Suburb Landing Page Strategy */}
          <section className="mb-14 print:break-inside-avoid">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-9 h-9 rounded-xl bg-emerald-50 text-[#2E9A4F] flex items-center justify-center print:bg-transparent">
                <Users size={20} />
              </span>
              <h2 className="text-2xl font-black text-[#0F2A1E] tracking-tight">
                3. Suburb Profiles &amp; Copywriting Angles
              </h2>
            </div>

            <p className="text-[#586b5e] text-sm mb-8">
              Rather than using a "one-size-fits-all" message, we will establish dedicated suburb pages with tailored demographic hooks to achieve maximum psychological resonance:
            </p>

            <div className="space-y-8">
              
              {/* Profile A */}
              <div className="border-l-4 border-[#2E9A4F] pl-6 py-2">
                <span className="text-xs font-extrabold tracking-wider uppercase text-[#2E9A4F]">Core Audience A</span>
                <h3 className="font-black text-xl text-[#0F2A1E] mt-0.5">Tarneit &amp; Truganina (Busy Young Families)</h3>
                <p className="text-sm text-[#586b5e] mt-2 leading-relaxed">
                  Rapidly expanding master estates packed with double-income professionals and toddler/infant households. Main pain points are zero free time, smelly diaper waste build-up, and green-lid FOGO maggots.
                </p>
                <div className="bg-[#FAFCF8] p-4 rounded-xl border border-[#E3EADD] mt-3.5 print:bg-transparent">
                  <p className="text-xs font-bold text-[#0F2A1E] uppercase tracking-wide">Target Landing Page Headline Hook:</p>
                  <p className="text-sm italic text-[#586b5e] mt-1 leading-relaxed">
                    "Tarneit families, you've got enough on your hands without scrubbing maggots out of green FOGO bins. Let us handle the dirtiest job on your street while you focus on the kids."
                  </p>
                </div>
              </div>

              {/* Profile B */}
              <div className="border-l-4 border-[#0C3A52] pl-6 py-2">
                <span className="text-xs font-extrabold tracking-wider uppercase text-[#0C3A52]">Core Audience B</span>
                <h3 className="font-black text-xl text-[#0F2A1E] mt-0.5">Point Cook &amp; Williams Landing (House-Proud Owners)</h3>
                <p className="text-sm text-[#586b5e] mt-2 leading-relaxed">
                  High-income earners in pristine estate communities (like Sanctuary Lakes) under strict owners corporations. Highly sensitive to curb appeal, stained driveways, and spider nests around garage bins.
                </p>
                <div className="bg-[#FAFCF8] p-4 rounded-xl border border-[#E3EADD] mt-3.5 print:bg-transparent">
                  <p className="text-xs font-bold text-[#0F2A1E] uppercase tracking-wide">Target Landing Page Headline Hook:</p>
                  <p className="text-sm italic text-[#586b5e] mt-1 leading-relaxed">
                    "Keep your Point Cook home pristine inside and out. Don't let foul-smelling, stained wheelie bins ruin your curb appeal or attract spider nests to your garage."
                  </p>
                </div>
              </div>

              {/* Profile C */}
              <div className="border-l-4 border-amber-500 pl-6 py-2">
                <span className="text-xs font-extrabold tracking-wider uppercase text-amber-600">Core Audience C</span>
                <h3 className="font-black text-xl text-[#0F2A1E] mt-0.5">Werribee &amp; Hoppers Crossing (Established Locals)</h3>
                <p className="text-sm text-[#586b5e] mt-2 leading-relaxed">
                  Older established residential properties, seniors, and long-standing homeowners. Main issues are years of stubborn grime build-up, pet-waste smell, and the back-breaking physical difficulty of scrubbing.
                </p>
                <div className="bg-[#FAFCF8] p-4 rounded-xl border border-[#E3EADD] mt-3.5 print:bg-transparent">
                  <p className="text-xs font-bold text-[#0F2A1E] uppercase tracking-wide">Target Landing Page Headline Hook:</p>
                  <p className="text-sm italic text-[#586b5e] mt-1 leading-relaxed">
                    "Stop struggling on your driveway with a hose and broom. Manual wheelie bin scrubbing is back-breaking work—our automated truck sanitises and deodorises in under 60 seconds."
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Page Break for Print */}
          <div className="page-break" />

          {/* SECTION 4: High-Intent SEO Keywords */}
          <section className="mb-14 print:break-inside-avoid">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-9 h-9 rounded-xl bg-emerald-50 text-[#2E9A4F] flex items-center justify-center print:bg-transparent">
                <Target size={20} />
              </span>
              <h2 className="text-2xl font-black text-[#0F2A1E] tracking-tight">
                4. High-Intent Local Keywords Strategy
              </h2>
            </div>

            <p className="text-[#586b5e] text-sm mb-6">
              Each dynamic landing page will target high-conversion keyword groups, blending geographical intent with purchase-ready intent:
            </p>

            <div className="space-y-6">
              
              <div className="border border-[#E3EADD] p-6 rounded-2xl">
                <h3 className="font-extrabold text-sm text-[#0F2A1E] uppercase tracking-wider mb-3.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2E9A4F]" />
                  Suburb-Specific Search Phrases
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-[#FAFCF8] p-4 rounded-xl border border-[#E3EADD] print:bg-transparent">
                  <div>
                    <p className="text-[#0F2A1E] font-bold">• wheelie bin cleaning Tarneit</p>
                    <p className="text-[#0F2A1E] font-bold mt-1.5">• wheelie bin cleaning Truganina</p>
                    <p className="text-[#0F2A1E] font-bold mt-1.5">• wheelie bin cleaning Werribee</p>
                  </div>
                  <div>
                    <p className="text-[#0F2A1E] font-bold">• wheelie bin cleaning Point Cook</p>
                    <p className="text-[#0F2A1E] font-bold mt-1.5">• wheelie bin cleaning Hoppers Crossing</p>
                    <p className="text-[#0F2A1E] font-bold mt-1.5">• bin washing Wyndham Vale</p>
                  </div>
                </div>
              </div>

              <div className="border border-[#E3EADD] p-6 rounded-2xl">
                <h3 className="font-extrabold text-sm text-[#0F2A1E] uppercase tracking-wider mb-3.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0C3A52]" />
                  Generic Local Intent (Local Map Pack triggers)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-[#FAFCF8] p-4 rounded-xl border border-[#E3EADD] print:bg-transparent">
                  <div>
                    <p className="text-[#0F2A1E] font-bold">• wheelie bin cleaning near me</p>
                    <p className="text-[#0F2A1E] font-bold mt-1.5">• bin washing service near me</p>
                  </div>
                  <div>
                    <p className="text-[#0F2A1E] font-bold">• local bin cleaners Wyndham</p>
                    <p className="text-[#0F2A1E] font-bold mt-1.5">• garbage bin cleaning service near me</p>
                  </div>
                </div>
              </div>

              <div className="border border-[#E3EADD] p-6 rounded-2xl">
                <h3 className="font-extrabold text-sm text-[#0F2A1E] uppercase tracking-wider mb-3.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Problem-Solution &amp; Informational Searches
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-[#FAFCF8] p-4 rounded-xl border border-[#E3EADD] print:bg-transparent">
                  <div>
                    <p className="text-[#0F2A1E] font-bold">• Wyndham council bin cleaning</p>
                    <p className="text-[#0F2A1E] font-bold mt-1.5">• smelly FOGO bin solutions</p>
                  </div>
                  <div>
                    <p className="text-[#0F2A1E] font-bold">• how to get rid of maggots in green bin</p>
                    <p className="text-[#0F2A1E] font-bold mt-1.5">• Wyndham council smelly bin replacement</p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Page Break for Print */}
          <div className="page-break" />

          {/* SECTION 5: Operational Council Sync */}
          <section className="mb-8 print:break-inside-avoid">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-9 h-9 rounded-xl bg-emerald-50 text-[#2E9A4F] flex items-center justify-center print:bg-transparent">
                <Calendar size={20} />
              </span>
              <h2 className="text-2xl font-black text-[#0F2A1E] tracking-tight">
                5. Wyndham Council Scheduling &amp; Operations
              </h2>
            </div>

            <p className="text-[#586b5e] text-sm mb-6">
              Aligning our mobile wash schedules with Wyndham City Council's bin collection days is crucial for frictionless customer delivery and legal sidewalk compliance.
            </p>

            <div className="border border-[#E3EADD] rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-[#0F2A1E] text-md mb-3">Wyndham Council 3-Bin Rotation Pattern</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-xs text-[#586b5e] uppercase tracking-wider">The Standard Cycle</h4>
                  <ul className="text-sm text-[#0F2A1E] space-y-2.5 mt-2">
                    <li className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-red-600 flex-none" />
                      <strong>Red-Lid Bin (Garbage):</strong> Collected Weekly
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-yellow-400 flex-none" />
                      <strong>Yellow-Lid Bin (Recycling):</strong> Fortnightly (Week A)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-emerald-600 flex-none" />
                      <strong>Green-Lid Bin (FOGO):</strong> Fortnightly (Week B)
                    </li>
                  </ul>
                </div>
                <div className="bg-[#FAFCF8] p-4 rounded-xl border border-[#E3EADD] text-sm text-[#586b5e] leading-relaxed print:bg-transparent">
                  <p className="font-extrabold text-[#0F2A1E] mb-1">Alternating Week Packages:</p>
                  Our landing pages should offer an alternating week washing option to match this cycle:
                  <p className="mt-2"><strong>Week A:</strong> Red Bin + Yellow Bin Cleans</p>
                  <p className="mt-0.5"><strong>Week B:</strong> Red Bin + Green Bin (FOGO) Cleans</p>
                </div>
              </div>
            </div>

            <div className="bg-[#FAFCF8] border border-[#E3EADD] p-6 rounded-2xl print:bg-transparent">
              <h3 className="font-extrabold text-[#0F2A1E] text-md mb-2 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#2E9A4F]" />
                Compliance Guarantee Angle:
              </h3>
              <p className="text-sm text-[#586b5e] leading-relaxed">
                Wyndham guidelines state empty bins must be returned inside property bounds promptly on collection day. We clean bins <strong>on the same day they are emptied</strong>. Our technicians wash and immediately roll the sparkling clean containers back inside the resident's boundary, keeping sidewalks clear, safe, and beautiful.
              </p>
            </div>
          </section>

          {/* Report Footer */}
          <footer className="border-t border-[#E3EADD] pt-8 mt-12 text-center text-xs text-[#586b5e] flex flex-col sm:flex-row sm:justify-between gap-4">
            <p>© 2026 EcoBins Australia. All proprietary research rights reserved.</p>
            <p className="font-mono">Document Hash: AGY-8C879053-MKT-INTEL</p>
          </footer>

        </article>

      </main>

      {/* Global CSS Inject for Print Page Formatting */}
      <style jsx global>{`
        @media print {
          /* Hide interactive screen components */
          .no-print {
            display: none !important;
          }
          
          /* Set standard print page margins and styles */
          @page {
            size: A4 portrait;
            margin: 15mm 20mm 20mm 20mm;
          }
          
          body {
            background-color: #ffffff !important;
            color: #0f2a1e !important;
            font-size: 12pt !important;
            line-height: 1.5 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Force page breaking on container borders */
          .page-break {
            clear: both;
            display: block;
            page-break-after: always;
            break-after: page;
            height: 0;
            margin: 0;
            padding: 0;
          }

          h1, h2, h3, h4 {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Prevent items from snapping in half on page cut */
          section, .border {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

    </div>
  );
}
