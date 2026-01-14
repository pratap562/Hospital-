import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Loader2, ChevronLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PaymentStepProps {
  amount: number;
  onSuccess: () => void;
  onBack: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ amount, onSuccess, onBack }) => {
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="animate-fade-in max-w-md mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Secure Payment</h2>
          <p className="text-slate-500">Complete your booking with a secure payment.</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl p-8">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Total Amount</span>
          <span className="text-3xl font-extrabold text-slate-900">₹{amount}</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-400">Card Number</Label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="0000 0000 0000 0000" 
                className="pl-12 h-14 rounded-2xl border-slate-200 focus:border-primary text-lg"
                defaultValue="4242 4242 4242 4242"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-400">Expiry Date</Label>
              <Input 
                placeholder="MM/YY" 
                className="h-14 rounded-2xl border-slate-200 focus:border-primary text-lg"
                defaultValue="12/28"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-400">CVV</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="123" 
                  className="pl-12 h-14 rounded-2xl border-slate-200 focus:border-primary text-lg"
                  defaultValue="123"
                  type="password"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handlePayment}
            disabled={processing}
            className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg mt-4"
          >
            {processing ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              `Pay ₹${amount}`
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">
            <ShieldCheck size={16} className="text-green-500" /> 256-bit SSL Encrypted
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-6 opacity-40 grayscale">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="Paypal" className="h-4" />
      </div>
    </div>
  );
};

export default PaymentStep;
