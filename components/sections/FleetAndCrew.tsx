"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { TruckAnimationCanvas } from "../3d/TruckAnimationCanvas";
import { Shield, Sparkles, Truck } from "lucide-react";

export function FleetAndCrew() {
  return (
    <section className="py-[78px] bg-[var(--color-surface-2)] border-t border-b border-[var(--color-line)]" id="fleet">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <motion.div
          className="max-w-[720px] mx-auto mb-14 text-center"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 font-body font-bold text-[13px] tracking-[.14em] uppercase text-[var(--color-green-deep)]">
            <span className="w-[7px] h-[7px] rounded-full bg-[var(--color-lime)]" />
            Commercial Tech on Your Street
          </span>
          <h2 className="mt-3.5 text-[clamp(32px,4vw,48px)] text-[var(--color-ink)] leading-tight">
            Our Professional Fleet &amp; Crew
          </h2>
          <p className="mt-4 text-[18px] text-[var(--color-muted)]">
            We don't just rinse your bins with a hose. We bring custom-engineered, ultra-high pressure wash-trucks and local expert crews directly to your curb.
          </p>
        </motion.div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[40px] items-start">
          
          {/* Left Side: 3D Interactive Animation Canvas (Takes 7/12 cols on large screen) */}
          <motion.div 
            className="lg:col-span-7 space-y-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <TruckAnimationCanvas />
            
            <div className="p-5 rounded-[18px] bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
              <span className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-none">
                <Truck size={20} />
              </span>
              <div>
                <h4 className="text-[15px] font-extrabold text-slate-800">Custom Hydraulic Lift Mechanism</h4>
                <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">
                  Notice how our truck automatically lifts the bins and locks them upside down inside our self-contained spray bay. Zero splashing, zero dirty runoff left on your street.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Real Photo Cards (Takes 5/12 cols on large screen) */}
          <div className="lg:col-span-5 space-y-[24px]">
            
            {/* Card 1: Clean Truck Photo */}
            <motion.div
              className="group bg-white rounded-[22px] overflow-hidden border border-slate-200/80 shadow-[var(--shadow-card)] hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-[220px] overflow-hidden">
                <Image
                  src="/assets/cleaning-truck.jpg"
                  alt="Eco Bin Cleaning specialized truck"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-sm text-white rounded-lg text-[11px] font-extrabold tracking-wider uppercase">
                  OUR VEHICLE
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-500"><Sparkles size={16} /></span>
                  <h3 className="text-[19px] font-extrabold text-[var(--color-ink)]">Next-Gen Washing Truck</h3>
                </div>
                <p className="text-[14px] text-[var(--color-muted)] leading-relaxed">
                  Our white Eco Bin Cleaning rig runs self-contained 1300 bar water pumps. We filter and recycle our own water, leaving zero residue behind and saving precious water on every run.
                </p>
              </div>
            </motion.div>

            {/* Card 2: Service Tech Photo */}
            <motion.div
              className="group bg-white rounded-[22px] overflow-hidden border border-slate-200/80 shadow-[var(--shadow-card)] hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="relative h-[220px] overflow-hidden">
                <Image
                  src="/assets/tech-welcome.jpg"
                  alt="Friendly Eco Bin Cleaning technician"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-sm text-white rounded-lg text-[11px] font-extrabold tracking-wider uppercase">
                  OUR CREW
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-500"><Shield size={16} /></span>
                  <h3 className="text-[19px] font-extrabold text-[var(--color-ink)]">Your Local Service Team</h3>
                </div>
                <p className="text-[14px] text-[var(--color-muted)] leading-relaxed">
                  Our professional, background-checked operators handle everything right on your scheduled council collection day. Safe, biodegradable deodorisers and family-friendly products only.
                </p>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
