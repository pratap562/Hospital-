import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, isSameDay, startOfToday, parseISO } from 'date-fns';
import { getPublicSlots, lockSlot, type PublicSlot, type SlotLockResult } from '@/services/api';

interface SlotSelectionStepProps {
  hospitalId: string;
  onSelect: (slot: PublicSlot, lockResult: SlotLockResult) => void;
  onBack: () => void;
}

const SlotSelectionStep: React.FC<SlotSelectionStepProps> = ({ hospitalId, onSelect, onBack }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [slots, setSlots] = useState<PublicSlot[]>([]);
  const [loading, setLoading] = useState(false);
  
  // New state for selection and processing
  const [selectedSlot, setSelectedSlot] = useState<PublicSlot | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate 7 days for the calendar strip
  const dates = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      setSelectedSlot(null); // Clear selection on date change
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const data = await getPublicSlots(hospitalId, dateStr);
        setSlots(data);
      } catch (err) {
        console.error('Failed to fetch slots:', err);
        setError('Failed to load slots. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [hospitalId, selectedDate]);

  const handleSlotSelect = (slot: PublicSlot) => {
    if (slot.availableCount <= 0) return;
    setSelectedSlot(slot);
    setError(null);
  };

  const handleProceed = async () => {
    if (!selectedSlot) return;

    setProcessing(true);
    setError(null);
    try {
      // Attempt to lock the slot
      const result = await lockSlot(selectedSlot.id);
      onSelect(selectedSlot, result);
    } catch (err: any) {
      console.error('Failed to lock slot:', err);
      // Determine error message
      const msg = err.response?.status === 409 
        ? 'Slot is no longer available. Please choose another.' 
        : 'Failed to secure slot. Please try again.';
      setError(msg);
      
      // Refresh slots to show up-to-date availability
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      getPublicSlots(hospitalId, dateStr).then(setSlots).catch(console.error);
      setSelectedSlot(null); // Deselect invalid slot
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-4xl mx-auto pb-24 relative">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full text-slate-600 hover:bg-slate-100">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div>
          <h2 className="text-3xl font-serif font-bold text-[var(--booking-primary)]">Select Appointment</h2>
          <p className="text-[var(--booking-text-light)]">Choose a convenient time for your visit.</p>
        </div>
      </div>

      {/* Date Selection Strip */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--booking-border)] mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[var(--booking-primary)] flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[var(--booking-secondary)]" /> 
            {format(selectedDate, 'MMMM yyyy')}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {dates.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, startOfToday());
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`
                  flex flex-col items-center justify-center min-w-[70px] h-24 rounded-2xl transition-all duration-300 border
                  ${isSelected 
                    ? 'bg-[var(--booking-primary)] border-[var(--booking-primary)] text-white shadow-lg shadow-[var(--booking-primary)]/20 scale-105' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-[var(--booking-secondary)] hover:bg-[var(--booking-secondary)]/5'
                  }
                `}
              >
                <span className={`text-xs font-medium uppercase mb-1 ${isSelected ? 'text-[var(--booking-accent)]' : 'text-slate-400'}`}>
                  {isToday ? 'Today' : format(date, 'EEE')}
                </span>
                <span className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                  {format(date, 'd')}
                </span>
                {isSelected && <div className="w-1.5 h-1.5 bg-[var(--booking-accent)] rounded-full mt-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 animate-headShake">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Slots Grid */}
      <div className="space-y-6">
        <h3 className="font-bold text-[var(--booking-primary)] flex items-center gap-2">
          <Clock className="w-5 h-5 text-[var(--booking-secondary)]" />
          Available Slots
        </h3>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
             {[...Array(8)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-2xl"></div>
             ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No slots available for this date.</p>
            <p className="text-slate-400 text-sm mt-1">Please select another date.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {slots.map((slot) => {
              const isFull = slot.availableCount <= 0;
              const isSelected = selectedSlot?.id === slot.id;
              
              return (
                <button
                  key={slot.id}
                  onClick={() => handleSlotSelect(slot)}
                  disabled={isFull}
                  className={`
                    relative p-4 rounded-2xl border text-left transition-all duration-200
                    ${isFull 
                      ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed' 
                      : isSelected
                        ? 'bg-[var(--booking-primary)] border-[var(--booking-primary)] text-white shadow-lg ring-2 ring-[var(--booking-primary)] ring-offset-2'
                        : 'bg-white border-slate-200 hover:border-[var(--booking-primary)] hover:shadow-md cursor-pointer'
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-lg font-bold ${isFull ? 'text-slate-400' : isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {format(parseISO(slot.startTime), 'h:mm a')}
                    </span>
                    {isSelected && <div className="h-3 w-3 bg-[var(--booking-accent)] rounded-full animate-pulse" />}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className={`${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                      {format(parseISO(slot.startTime), 'h:mm')} - {format(parseISO(slot.endTime), 'h:mm a')}
                    </span>
                  </div>

                  {!isFull && (
                    <div className="mt-3 flex items-center gap-1.5">
                      <div className={`h-1.5 flex-1 rounded-full overflow-hidden ${isSelected ? 'bg-white/20' : 'bg-slate-100'}`}>
                        <div 
                          className={`h-full ${isSelected ? 'bg-[var(--booking-accent)]' : 'bg-[var(--booking-secondary)]'}`}
                          style={{ width: `${Math.min((slot.availableCount / 10) * 100, 100)}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-[var(--booking-accent)]' : 'text-[var(--booking-secondary)]'}`}>
                        {slot.availableCount} left
                      </span>
                    </div>
                  )}

                  {isFull && (
                     <div className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                       Full
                     </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Floating Action Button - Target window level via Portal to escape containing blocks */}
      {selectedSlot && createPortal(
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-lg animate-fade-in pointer-events-none">
          <div className="bg-white/95 backdrop-blur-xl border border-[var(--booking-primary)]/20 shadow-[0_20px_50px_rgba(27,67,50,0.3)] rounded-[32px] p-2 flex items-center justify-between gap-4 pl-6 pointer-events-auto">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Appointment at</span>
              <span className="text-base font-bold text-[var(--booking-primary)]">
                {format(parseISO(selectedSlot.startTime), 'h:mm a')}
              </span>
            </div>
            <Button 
              size="lg" 
              onClick={handleProceed} 
              disabled={processing}
              className="bg-[var(--booking-primary)] hover:bg-[var(--booking-primary-dark)] text-white rounded-2xl px-10 h-14 shadow-lg shadow-[var(--booking-primary)]/20 font-bold text-lg min-w-[160px]"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Securing...
                </>
              ) : (
                <>
                  Confirm Slot
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SlotSelectionStep;
