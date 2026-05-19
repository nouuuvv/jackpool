"use client";

import { useState, useEffect } from "react";
import { bookingService, BookingDetails, BookingResponse } from "@/services/bookingService";
import { Button } from "@/components/Button";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function BilliardBooking() {
  const [tableType, setTableType] = useState<'Standard' | 'VIP' | null>(null);
  const [date, setDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(0);
  
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<BookingResponse | null>(null);

  // Generate next 7 days for the date selector
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  // Generate time slots from 10:00 to 23:00
  const allTimeSlots = Array.from({ length: 14 }).map((_, i) => {
    const hour = 10 + i;
    return `${hour}:00`;
  });

  // Calculate dynamic price when selections change
  useEffect(() => {
    if (tableType && timeSlot) {
      setPrice(bookingService.calculatePrice(tableType, timeSlot));
    } else {
      setPrice(0);
    }
  }, [tableType, timeSlot]);

  // Check availability when date changes
  useEffect(() => {
    if (!date) return;
    
    const checkSlots = async () => {
      setIsChecking(true);
      setTimeSlot('');
      
      const available: string[] = [];
      for (const slot of allTimeSlots) {
        // Simulate checking each slot (in reality, backend would return available slots)
        const isAvail = await bookingService.checkAvailability(date, slot);
        if (isAvail) available.push(slot);
      }
      
      setAvailableTimes(available);
      setIsChecking(false);
    };
    
    checkSlots();
  }, [date]);

  const handleSubmit = async () => {
    if (!tableType || !date || !timeSlot) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await bookingService.createBooking({
        tableType,
        date,
        timeSlot,
      });
      setSuccessData(response);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBooking = () => {
    setSuccessData(null);
    setTableType(null);
    setDate('');
    setTimeSlot('');
    setError(null);
  };

  if (successData) {
    return (
      <div className="glass-card p-8 md:p-12 text-center max-w-2xl mx-auto border-brand-amber/50 animate-fade-in">
        <CheckCircle2 className="w-20 h-20 text-brand-amber mx-auto mb-6" />
        <h3 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h3>
        <p className="text-white/60 mb-8">Your arena is ready. See you at Jackpools.</p>
        
        <div className="bg-black/50 p-6 rounded-xl text-left border border-white/5 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/40 uppercase tracking-wider mb-1">Booking ID</p>
              <p className="text-lg font-mono text-brand-amber font-bold">{successData.bookingId}</p>
            </div>
            <div>
              <p className="text-sm text-white/40 uppercase tracking-wider mb-1">Table</p>
              <p className="text-lg text-white font-medium">{tableType} Lounge</p>
            </div>
            <div>
              <p className="text-sm text-white/40 uppercase tracking-wider mb-1">Date</p>
              <p className="text-lg text-white font-medium">{date}</p>
            </div>
            <div>
              <p className="text-sm text-white/40 uppercase tracking-wider mb-1">Time</p>
              <p className="text-lg text-white font-medium">{timeSlot}</p>
            </div>
          </div>
        </div>
        
        <Button onClick={resetBooking} variant="outline" className="w-full">Book Another Table</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left side: Selection Flow */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* 1. Table Type */}
        <div className="glass-card p-6 border-white/5">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="bg-brand-amber text-black w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">1</span> 
            Select Experience
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => setTableType('Standard')}
              className={`p-4 rounded-xl border text-left transition-all ${tableType === 'Standard' ? 'border-brand-amber bg-brand-amber/10' : 'border-white/10 hover:border-white/30'}`}
            >
              <p className="font-bold text-white text-lg">Standard</p>
              <p className="text-sm text-white/50">Base rate from $15/hr</p>
            </button>
            <button 
              onClick={() => setTableType('VIP')}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${tableType === 'VIP' ? 'border-brand-orange bg-brand-orange/10' : 'border-white/10 hover:border-white/30'}`}
            >
              <div className="absolute top-0 right-0 bg-brand-orange text-xs font-bold px-2 py-1 rounded-bl-lg text-white">POPULAR</div>
              <p className="font-bold text-brand-amber text-lg">VIP Exclusive</p>
              <p className="text-sm text-white/50">Base rate from $35/hr</p>
            </button>
          </div>
        </div>

        {/* 2. Date */}
        <div className={`glass-card p-6 border-white/5 transition-opacity ${!tableType ? 'opacity-50 pointer-events-none' : ''}`}>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="bg-brand-amber text-black w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">2</span> 
            Select Date
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {dates.map((d) => {
              const displayDate = new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
              return (
                <button
                  key={d}
                  onClick={() => setDate(d)}
                  className={`flex-shrink-0 px-4 py-3 rounded-lg border transition-all ${date === d ? 'border-brand-amber bg-brand-amber text-black font-bold' : 'border-white/10 text-white/70 hover:border-white/30'}`}
                >
                  {displayDate}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Time Slot */}
        <div className={`glass-card p-6 border-white/5 transition-opacity ${!date ? 'opacity-50 pointer-events-none' : ''}`}>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="bg-brand-amber text-black w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">3</span> 
            Select Time
          </h3>
          
          {isChecking ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-brand-amber animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {allTimeSlots.map((slot) => {
                const hour = parseInt(slot.split(':')[0], 10);
                const isPeak = hour >= 18;
                const isAvailable = availableTimes.includes(slot);
                
                return (
                  <button
                    key={slot}
                    disabled={!isAvailable}
                    onClick={() => setTimeSlot(slot)}
                    className={`relative py-2 rounded-lg border text-center transition-all 
                      ${!isAvailable ? 'border-red-900/30 bg-red-900/10 text-white/20 cursor-not-allowed' : 
                        timeSlot === slot ? 'border-brand-amber bg-brand-amber/20 text-brand-amber font-bold' : 
                        'border-white/10 text-white/70 hover:border-brand-amber/50 hover:text-white'}
                    `}
                  >
                    {slot}
                    {isPeak && isAvailable && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-brand-orange" title="Peak Hour" />}
                  </button>
                );
              })}
            </div>
          )}
          {!isChecking && date && (
            <p className="text-xs text-brand-orange mt-4 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-orange inline-block" /> Indicates peak pricing hour
            </p>
          )}
        </div>
      </div>

      {/* Right side: Summary Panel */}
      <div className="lg:col-span-1">
        <div className="glass-card p-6 sticky top-24 border-brand-amber/20">
          <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Booking Summary</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-white/50">Experience</span>
              <span className="text-white font-medium">{tableType || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/50">Date</span>
              <span className="text-white font-medium">{date || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/50">Time</span>
              <span className="text-white font-medium">{timeSlot || '-'}</span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 mb-8">
            <div className="flex justify-between items-end">
              <span className="text-white/70 text-lg">Total Price</span>
              <div className="text-right">
                <span className="text-3xl font-bold text-brand-amber">${price}</span>
                <span className="text-sm text-white/40 block">/ hour</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <Button 
            variant="primary" 
            className="w-full h-14 text-lg font-bold"
            disabled={!tableType || !date || !timeSlot || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Processing...</span>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
