import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './BookingApp.css';
import ConsultationTypeStep from './components/ConsultationTypeStep';
import HospitalSelectionStep from './components/HospitalSelectionStep';
import SlotSelectionStep from './components/SlotSelectionStep';
import DoctorSelectionStep from './components/DoctorSelectionStep';
import PaymentStep from './components/PaymentStep';
import SuccessStep from './components/SuccessStep';
import type { Hospital } from '@/services/mocks/hospitalData';
import type { Doctor } from '@/services/mocks/doctorData';
import { getLeadById, updateLeadStatus, type ILead, type PublicSlot, type SlotLockResult } from '@/services/api';

export type ConsultationType = 'online' | 'offline';

export interface BookingState {
  leadId: string | null;
  leadData: ILead | null;
  type: ConsultationType | null;
  hospital: Hospital | null;
  slot: PublicSlot | null;
  lockId: string | null;
  lockResult: SlotLockResult | null;
  doctor: Doctor | null;
  isFree: boolean;
  paymentDone: boolean;
  appointmentId: string | null;
  duration: number;
  totalAmount: number;
}

const BookingApp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [loadingLead, setLoadingLead] = useState(false);
  const [state, setState] = useState<BookingState>({
    leadId: searchParams.get('leadId'),
    leadData: null,
    type: null,
    hospital: null,
    slot: null,
    lockId: null,
    lockResult: null,
    doctor: null,
    isFree: false,
    paymentDone: false,
    appointmentId: null,
    duration: 0,
    totalAmount: 0,
  });

  React.useEffect(() => {
    const fetchLead = async () => {
      const lid = searchParams.get('leadId');
      if (lid) {
        setLoadingLead(true);
        try {
          const data = await getLeadById(lid);
          setState(prev => ({ ...prev, leadData: data }));
        } catch (error) {
          console.error('Failed to fetch lead data:', error);
        } finally {
          setLoadingLead(false);
        }
      }
    };
    fetchLead();
  }, [searchParams]);

  const handleBookingSuccess = async () => {
    if (state.leadId) {
      try {
        await updateLeadStatus(state.leadId, true);
        console.log('Lead converted successfully');
      } catch (error) {
        console.error('Failed to update lead status:', error);
      }
    }
  };

  const nextStep = () => {
    // If we're moving to the final success step, trigger conversion
    const totalSteps = state.isFree ? 3 : (state.type === 'offline' ? 5 : 4);
    if (step === totalSteps - 1) {
       handleBookingSuccess();
    }
    setStep(s => s + 1);
  };
  const prevStep = () => setStep(s => s - 1);

  const updateState = (updates: Partial<BookingState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Progress calculation
  const totalSteps = state.isFree ? 3 : (state.type === 'offline' ? 5 : 4);
  const progress = Math.min((step / totalSteps) * 100, 100);

  const handleReset = () => {
    setStep(1);
    setState(prev => ({ 
      ...prev, 
      type: null, 
      hospital: null, 
      slot: null,
      lockId: null,
      lockResult: null,
      doctor: null, 
      isFree: false, 
      paymentDone: false,
      appointmentId: null,
      duration: 0,
      totalAmount: 0,
    }));
  };

  return (
    <div className="booking-app-wrapper">
      <div className="booking-container">
        <div className="booking-nav">
          <div className="booking-logo">Sagar Health</div>
          <div className="text-right">
            {loadingLead ? (
              <span className="text-xs text-slate-400 animate-pulse">Loading lead info...</span>
            ) : state.leadData ? (
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-primary">{state.leadData.name}</span>
                <span className="text-[10px] text-muted-foreground">{state.leadData.phoneNumber} | {state.leadData.city}</span>
              </div>
            ) : (
              <div className="text-sm font-medium text-slate-500">
                {state.leadId ? `Lead ID: ${state.leadId}` : 'New Booking'}
              </div>
            )}
          </div>
        </div>

        <div className="booking-card-main">
          <div className="booking-progress-bar">
            <div 
              className="booking-progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="booking-step-content">
            {step === 1 && (
              <ConsultationTypeStep 
                onSelect={(type) => {
                  updateState({ type });
                  nextStep();
                }} 
              />
            )}

            {step === 2 && state.type === 'offline' && (
              <HospitalSelectionStep 
                onSelect={(hospital) => {
                  // Clear potentially stale slot/doctor data when hospital changes
                  updateState({ hospital, slot: null, lockId: null, lockResult: null, doctor: null });
                  nextStep();
                }}
                onBack={prevStep}
              />
            )}

            {step === 2 && state.type === 'online' && (
              <DoctorSelectionStep 
                onSelect={(doctor, duration, amount, isFree) => {
                  updateState({ doctor, duration, totalAmount: amount, isFree, slot: null, lockId: null, lockResult: null });
                  nextStep();
                }}
                onBack={prevStep}
              />
            )}

            {step === 3 && state.type === 'offline' && (
              <SlotSelectionStep 
                hospitalId={state.hospital?.id || ''}
                onSelect={(slot, lockResult) => {
                  updateState({ slot, lockId: lockResult.lockId, lockResult });
                  nextStep();
                }}
                onBack={prevStep}
              />
            )}

            {step === 3 && state.type === 'online' && (
              state.isFree ? (
                <SuccessStep state={state} onReset={handleReset} />
              ) : (
                <PaymentStep 
                  amount={state.totalAmount}
                  duration={state.duration}
                  bookingData={{
                    name: state.leadData?.name || 'Patient',
                    email: state.leadData?.email || 'patient@example.com',
                    phoneNo: state.leadData?.phoneNumber || '9999999999',
                    healthIssue: state.leadData?.healthIssue || 'other',
                    doctorId: state.doctor?.id || '',
                    doctorName: state.doctor?.name || '',
                  }}
                  onSuccess={(appointmentId?: string) => {
                    updateState({ paymentDone: true, appointmentId: appointmentId || null });
                    nextStep();
                  }}
                  onBack={prevStep}
                />
              )
            )}

            {step === 4 && state.type === 'offline' && (
              <PaymentStep 
                amount={200}
                lockId={state.lockId}
                bookingData={{
                  name: state.leadData?.name || 'Patient',
                  email: state.leadData?.email || 'patient@example.com',
                  phoneNo: state.leadData?.phoneNumber || '9999999999',
                  healthIssue: state.leadData?.healthIssue || 'other',
                  doctorId: '000000000000000000000000', // Default doctor for offline
                  doctorName: 'General Physician',
                }}
                onSuccess={(appointmentId?: string) => {
                  updateState({ paymentDone: true, appointmentId: appointmentId || null });
                  nextStep();
                }}
                onBack={() => {
                  // Go back to slot selection - lock will be released in PaymentStep
                  prevStep();
                }}
                onLockReleased={() => {
                  // Clear lock data when released
                  updateState({ lockId: null, lockResult: null, slot: null });
                }}
              />
            )}

            {step === 4 && state.type === 'online' && !state.isFree && (
              <SuccessStep state={state} onReset={handleReset} />
            )}

            {step === 5 && state.type === 'offline' && (
              <SuccessStep state={state} onReset={handleReset} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingApp;
