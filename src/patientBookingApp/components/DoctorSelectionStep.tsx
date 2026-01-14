import React from 'react';
import { mockDoctors, type Doctor } from '@/services/mocks/doctorData';
import { Star, Award, Clock, ChevronLeft, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DoctorSelectionStepProps {
  onSelect: (doctor: Doctor | null, isFree: boolean) => void;
  onBack: () => void;
}

const DoctorSelectionStep: React.FC<DoctorSelectionStepProps> = ({ onSelect, onBack }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Select an Expert Doctor</h2>
          <p className="text-slate-500">Consult with India's top Ayurvedic specialists online.</p>
        </div>
      </div>

      <div className="doctor-ad-grid">
        {mockDoctors.map((doc) => (
          <div key={doc.id} className="doctor-ad-card" onClick={() => onSelect(doc, false)}>
            <div className="doctor-image-container">
              <img src={doc.photo} alt={doc.name} />
              <div className="doctor-pricing-tag">₹{doc.pricing}</div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Star className="h-3 w-3 text-amber-500 fill-current" />
                <span className="text-xs font-bold text-slate-900">{doc.rating}</span>
              </div>
            </div>
            <div className="doctor-info-content">
              <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">
                <Award size={12} /> {doc.specialty}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{doc.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{doc.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
                  <Clock size={14} /> {doc.experience} Exp
                </div>
                <div className="text-primary font-bold text-sm flex items-center gap-1">
                  Book Now <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[32px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-200">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <Gift size={32} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">First Consultation Free?</h3>
            <p className="text-white/80 text-sm">Get a quick 5-minute consultation with our available doctor.</p>
          </div>
        </div>
        <Button 
          onClick={() => onSelect(null, true)}
          className="bg-white text-indigo-600 hover:bg-white/90 h-14 px-8 rounded-2xl font-bold text-lg shadow-lg"
        >
          Claim Free Consultation
        </Button>
      </div>
    </div>
  );
};

export default DoctorSelectionStep;
