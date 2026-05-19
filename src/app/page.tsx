"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { BilliardBooking } from "@/components/BilliardBooking";
import { MenuSystem } from "@/components/MenuSystem";
import { MapPin, Clock, CalendarDays, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-black selection:bg-brand-amber/30 selection:text-white relative">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Jackpools Lively Atmosphere"
            fill
            priority
            className="object-cover object-center animate-pulse-slow scale-105"
          />
          {/* Gradient Overlays for Cinematic Feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-black/40 to-transparent z-10" />
        </div>

        {/* Floating Particles/Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-amber/10 rounded-full blur-[120px] z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[150px] z-10 pointer-events-none" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-amber/30 bg-brand-amber/10 backdrop-blur-md mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-brand-amber tracking-wide">Live: High Demand Tonight</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9] uppercase relative">
              <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">Play.</span>
              <span className="block text-brand-amber drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">Chill.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">Repeat.</span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-white/70 max-w-xl font-light leading-relaxed">
              The city&apos;s most exclusive premium billiard lounge. Where exceptional coffee meets late-night energy. 
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg group">
                Book a Table
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="glass" size="lg" className="w-full sm:w-auto">
                See Menu
              </Button>
            </div>
            
            <div className="mt-6 flex items-center gap-3 text-sm text-white/50">
              <Clock className="w-4 h-4 text-brand-orange" />
              <p>Peak hours start at 8 PM. <span className="text-white font-medium underline decoration-brand-amber underline-offset-4 cursor-pointer hover:text-brand-amber transition-colors">Only 3 VIP tables left.</span></p>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-white/40">Scroll to Explore</span>
          <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
            <motion.div 
              animate={{ y: [0, 48, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-brand-amber"
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <Section id="about" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative h-[500px] w-full rounded-2xl overflow-hidden glass-card p-2 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-amber/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
            <Image
              src="/gallery.png"
              alt="Lounge Vibe"
              fill
              className="object-cover rounded-xl grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Not Just a <span className="text-brand-amber italic">Game</span>. <br/> It&apos;s an <span className="text-brand-orange neon-glow">Experience</span>.
            </h2>
            <p className="text-lg text-white/60 leading-relaxed font-light">
              Step into a realm where the clack of billiard balls harmonizes with the hum of a lively crowd. Jackpools isn&apos;t a cheap cafe—it&apos;s a high-end sanctuary designed for those who appreciate the finer things.
            </p>
            <p className="text-lg text-white/60 leading-relaxed font-light">
              From our precision-leveled tournament tables to our masterfully crafted signature drinks, every detail is curated to elevate your night out.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-3xl font-bold text-white mb-1">12</p>
                <p className="text-sm text-brand-amber uppercase tracking-wider">Premium Tables</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">24/7</p>
                <p className="text-sm text-brand-amber uppercase tracking-wider">Good Vibes</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Billiard Booking Section (Interactive) */}
      <Section id="billiard" className="bg-gradient-to-b from-brand-black to-zinc-900/50">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">Reserve Your <span className="text-brand-amber">Arena</span></h2>
          <p className="text-white/60 max-w-2xl mx-auto">Walk-ins are welcome, but securing a table guarantees your spot during peak hours. Don&apos;t miss out.</p>
        </div>

        <BilliardBooking />
      </Section>

      {/* Menu Highlight Section (Interactive) */}
      <Section id="menu" className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Taste the <span className="text-brand-amber text-transparent bg-clip-text bg-gradient-to-r from-brand-amber to-brand-orange">Night</span></h2>
            <p className="text-white/60">Crafted beverages and premium bites designed to keep your energy high and your focus sharp.</p>
          </div>
        </div>

        <MenuSystem />
      </Section>

      {/* Gallery Section */}
      <Section id="gallery" className="relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white uppercase tracking-wider mb-4">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber to-brand-orange">Vibe</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 h-[400px] relative rounded-xl overflow-hidden group">
             <Image src="/gallery.png" alt="Gallery 1" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="h-[400px] relative rounded-xl overflow-hidden group">
             <Image src="/hero.png" alt="Gallery 2" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
        </div>
      </Section>

      {/* Events & Community */}
      <Section id="events" className="border-t border-white/5 bg-brand-black/50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <CalendarDays className="w-12 h-12 text-brand-amber mx-auto" />
          <h2 className="text-4xl font-bold text-white">Join the Community</h2>
          <p className="text-white/60 text-lg">Weekly tournaments, live DJ sets every Friday, and exclusive watch parties. Jackpools is where the city comes alive.</p>
          <div className="inline-flex flex-col sm:flex-row gap-4 p-6 glass-card rounded-2xl w-full text-left items-center justify-between">
            <div>
              <p className="text-brand-amber font-bold mb-1">UPCOMING EVENT</p>
              <h4 className="text-2xl text-white font-bold">Friday Night 9-Ball Tournament</h4>
              <p className="text-white/50 text-sm mt-1">Cash prize pool. Registration ends Thursday.</p>
            </div>
            <Button variant="primary">Register Now</Button>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials" className="overflow-hidden">
        <h2 className="text-3xl font-bold text-white text-center mb-12">What They Say</h2>
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
          {[
            { name: "Alex R.", text: "The vibe here is unmatched. Lighting is perfect for playing, and the music sets the right mood without being overpowering." },
            { name: "Sarah M.", text: "Finally a premium billiard spot that doesn't feel sketchy. The truffle fries are amazing and the tables are top-notch." },
            { name: "David T.", text: "Booked the VIP section for a birthday. The service was impeccable. Highly recommend if you want an exclusive feel." }
          ].map((review, i) => (
            <div key={i} className="min-w-[300px] md:min-w-[400px] glass-card p-8 snap-center shrink-0">
              <div className="flex text-brand-amber mb-4">
                {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-white/80 italic mb-6">&quot;{review.text}&quot;</p>
              <p className="text-white font-bold">— {review.name}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <div className="text-3xl font-bold tracking-tighter text-white">
              JACK<span className="text-brand-amber">POOLS</span>
            </div>
            <p className="text-white/50 text-sm">Play. Chill. Repeat. The ultimate premium billiard and cafe experience.</p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Location</h4>
            <ul className="space-y-3 text-white/50 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
                123 Midnight Boulevard,<br/>Neon District, NY 10001
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Hours</h4>
            <ul className="space-y-3 text-white/50 text-sm">
              <li className="flex justify-between"><span>Mon - Thu</span> <span>10 AM - 2 AM</span></li>
              <li className="flex justify-between text-brand-amber font-medium"><span>Fri - Sun</span> <span>10 AM - 4 AM</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-brand-amber hover:text-black transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              {/* Other socials can go here */}
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center border-t border-white/10 pt-8 text-white/30 text-xs">
          &copy; {new Date().getFullYear()} Jackpools. All rights reserved.
        </div>
      </footer>
      
      {/* Global styles fix for hide-scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  );
}
