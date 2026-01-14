import React from 'react';
import type { BookingState } from '../BookingApp';
import { CheckCircle2, Calendar, Clock, MapPin, User, ArrowRight, Video, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessStepProps {
  state: BookingState;
  onReset: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ state, onReset }) => {
  const bookingId = `SH-${Math.floor(100000 + Math.random() * 900000)}`;
  
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isOnline = state.type === 'online';

  return (
    <div className="animate-fade-in text-center py-8">
      <div className="flex justify-center mb-8">
        <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 className="h-14 w-14 text-green-600" />
        </div>
      </div>

      <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Thank You!</h2>
      <p className="text-slate-500 text-lg mb-10">Your {isOnline ? 'online consultation' : 'in-clinic visit'} has been successfully booked.</p>

      <div className="bg-white rounded-[40px] p-10 mb-10 text-left border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          {isOnline ? <Video size={120} /> : <Home size={120} />}
        </div>

        <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 tracking-widest block mb-1">Booking ID</span>
            <span className="font-mono text-2xl font-black text-indigo-600">{bookingId}</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-widest block mb-1">Status</span>
            <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold">Confirmed</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="flex items-start gap-5">
              <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                {isOnline ? <User className="h-6 w-6 text-indigo-500" /> : <MapPin className="h-6 w-6 text-indigo-500" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {isOnline ? 'Doctor' : 'Hospital'}
                </p>
                <p className="font-bold text-slate-900 text-lg">
                  {isOnline ? state.doctor?.name : state.hospital?.name}
                </p>
                <p className="text-sm text-slate-500">
                  {isOnline ? state.doctor?.specialty : state.hospital?.location}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                <Calendar className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                <p className="font-bold text-slate-900 text-lg">
                  {state.slot 
                    ? new Date(state.slot.startTime).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })
                    : new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-5">
              <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                <Clock className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Time</p>
                <p className="font-bold text-slate-900 text-lg">
                  {state.slot ? formatTime(state.slot.startTime) : 'Flexible'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                <ShieldCheck className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Payment</p>
                <p className="font-bold text-slate-900 text-lg">
                  {state.isFree ? 'Free Consultation' : 'Paid Successfully'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <Button 
          onClick={onReset}
          className="h-16 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-200 flex items-center gap-3"
        >
          Return to Home
          <ArrowRight size={20} />
        </Button>
        <p className="text-slate-400 text-sm">
          A confirmation email and SMS have been sent to your registered contact.
        </p>
      </div>
    </div>
  );
};

export default SuccessStep;
