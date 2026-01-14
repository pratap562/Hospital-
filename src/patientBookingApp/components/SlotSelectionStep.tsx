import React, { useEffect, useState, useMemo } from 'react';
import { getSlots } from '@/services/api';
import type { Slot } from '@/services/mocks/slotData';
import { Loader2, Clock, ChevronLeft, Calendar as CalendarIcon, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SlotSelectionStepProps {
  hospitalId: string;
  onSelect: (slot: Slot) => void;
  onBack: () => void;
}

const SlotSelectionStep: React.FC<SlotSelectionStepProps> = ({ hospitalId, onSelect, onBack }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const result = await getSlots(hospitalId);
        setSlots(result);
      } catch (error) {
        console.error('Failed to fetch slots:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [hospitalId]);

  const next30Days = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });
  }, []);

  const filteredSlots = useMemo(() => {
    return slots.filter(s => s.startTime.startsWith(selectedDate));
  }, [slots, selectedDate]);

  const handleProceed = () => {
    const slot = slots.find(s => s.id === selectedSlotId);
    if (slot) {
      onSelect(slot);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\s/g, '');
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Choose a Time Slot</h2>
          <p className="text-slate-500">Select your preferred date and time for the visit.</p>
        </div>
      </div>

      <div className="mb-10">
        <label className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-4 block">Select Date</label>
        <div className="date-strip">
          {next30Days.map((d) => {
            const dateObj = new Date(d);
            const isActive = selectedDate === d;
            return (
              <div 
                key={d}
                className={`date-card ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDate(d);
                  setSelectedSlotId(null); // Reset slot when date changes
                }}
              >
                <span className="text-[10px] font-bold uppercase opacity-70">{dateObj.toLocaleDateString([], { weekday: 'short' })}</span>
                <span className="text-xl font-bold">{dateObj.getDate()}</span>
                <span className="text-[10px] font-medium opacity-70">{dateObj.toLocaleDateString([], { month: 'short' })}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Available Slots</label>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500"></div> Available
            <div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300 ml-2"></div> Booked
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-slate-500 font-medium">Loading slots...</p>
          </div>
        ) : filteredSlots.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Info className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 font-medium">No slots available for this date.</p>
          </div>
        ) : (
          <div className="slot-grid-container">
            {filteredSlots.map((slot) => {
              const isFull = slot.bookedCount >= slot.maxCapacity;
              const remaining = slot.maxCapacity - slot.bookedCount;
              const isSelected = selectedSlotId === slot.id;
              
              return (
                <div 
                  key={slot.id}
                  className={`slot-box ${isFull ? 'disabled' : ''} ${isSelected ? 'active' : ''}`}
                  onClick={() => !isFull && setSelectedSlotId(slot.id)}
                >
                  <div className="text-[13px] font-bold text-slate-900 whitespace-nowrap mb-1">
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </div>
                  <div className={`capacity-indicator ${remaining <= 2 ? 'text-red-500' : 'text-green-600'}`}>
                    {isFull ? 'Fully Booked' : `${remaining} slots left`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-12 flex flex-col gap-6">
        <Button 
          onClick={handleProceed}
          disabled={!selectedSlotId}
          className="h-16 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-200"
        >
          Proceed to Payment
        </Button>

        <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-start gap-4">
        <div className="bg-white p-2 rounded-xl shadow-sm">
          <Info className="h-5 w-5 text-indigo-500" />
        </div>
        <div className="text-sm text-indigo-900 leading-relaxed">
          <p className="font-bold mb-1">Important Note</p>
          Please arrive 15 minutes before your scheduled time for registration and preliminary checkup.
        </div>
      </div>
      </div>
    </div>
  );
};

export default SlotSelectionStep;
