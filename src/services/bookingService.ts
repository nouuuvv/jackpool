export interface BookingDetails {
  date: string;
  timeSlot: string;
  tableType: 'Standard' | 'VIP';
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  message?: string;
}

// Simulated backend data
const BOOKED_SLOTS: Record<string, string[]> = {
  // Mock data: some slots are already booked on specific days
  '2026-05-06': ['18:00', '19:00', '20:00'],
  '2026-05-07': ['21:00', '22:00'],
};

export const bookingService = {
  /**
   * Check if a specific time slot is available
   */
  async checkAvailability(date: string, timeSlot: string): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    const bookedForDate = BOOKED_SLOTS[date] || [];
    return !bookedForDate.includes(timeSlot);
  },

  /**
   * Calculate dynamic pricing based on time
   * Peak hours: 18:00 and later
   */
  calculatePrice(tableType: 'Standard' | 'VIP', timeSlot: string): number {
    const hour = parseInt(timeSlot.split(':')[0], 10);
    const isPeak = hour >= 18;
    
    if (tableType === 'VIP') {
      return isPeak ? 45 : 35;
    } else {
      return isPeak ? 25 : 15;
    }
  },

  /**
   * Submit the booking
   */
  async createBooking(details: BookingDetails): Promise<BookingResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Simulate random failure (10% chance) to show error handling
    if (Math.random() < 0.1) {
      throw new Error("Failed to secure the booking. The table might have just been taken.");
    }
    
    return {
      success: true,
      bookingId: `JP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
  }
};
