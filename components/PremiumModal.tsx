
import React, { useState, useEffect } from 'react';
import { X, Check, Smartphone, CreditCard, ShieldCheck, Banknote } from 'lucide-react';
import { Language } from '../types';
import { createRazorpayOrder, verifyRazorpayPayment } from '../services/paymentService';

interface PremiumModalProps {
  onClose: () => void;
  onSuccess: () => void;
  lang: Language;
  config?: {
    type: 'subscription' | 'one-time';
    amount?: number;
    title?: string;
    description?: string;
  };
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ 
  onClose, 
  onSuccess, 
  lang, 
  config = { type: 'subscription' } 
}) => {
  // If one-time payment, skip 'plans' step and go straight to 'method'
  const [step, setStep] = useState<'plans' | 'method' | 'processing' | 'success'>(
    config.type === 'one-time' ? 'method' : 'plans'
  );
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');

  // Load Razorpay Script dynamically
  const loadRazorpayScript = (src: string) => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setStep('processing');
    setError('');

    try {
        const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
            setError('Razorpay SDK failed to load. Check internet.');
            setStep('plans');
            return;
        }

        let amount = 0;
        let description = "";

        if (config.type === 'one-time') {
            amount = config.amount || 5;
            description = config.description || "One-time Purchase";
        } else {
            // Updated Pricing Logic
            amount = selectedPlan === 'monthly' ? 99 : 599;
            description = `Premium Membership (${selectedPlan})`;
        }
        
        // 1. Create Order on Backend
        const order = await createRazorpayOrder(amount);

        const options = {
            key: order.key_id, // Loaded from backend
            amount: order.amount,
            currency: order.currency,
            name: "Divya Drishti",
            description: description,
            image: "https://via.placeholder.com/150/ffa000/000000?text=Divya+Drishti",
            order_id: order.id,
            handler: async function (response: any) {
                try {
                    // 2. Verify Payment on Backend
                    const verifyRes = await verifyRazorpayPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    });

                    if (verifyRes.status === 'success') {
                        setStep('success');
                        setTimeout(() => {
                            onSuccess();
                        }, 2000);
                    } else {
                        setError("Payment Verification Failed");
                        setStep(config.type === 'one-time' ? 'method' : 'plans');
                    }
                } catch (err) {
                    console.error(err);
                    setError("Verification Error");
                    setStep(config.type === 'one-time' ? 'method' : 'plans');
                }
            },
            prefill: {
                name: "Seeker",
                email: "seeker@example.com",
                contact: "9999999999",
                vpa: upiId, 
                method: paymentMethod === 'upi' ? 'upi' : (paymentMethod === 'card' ? 'card' : 'netbanking')
            },
            theme: {
                color: "#b45309" // Saffron-700
            }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
        paymentObject.on('payment.failed', function (response: any){
             setError(response.error.description || "Payment Failed");
             setStep(config.type === 'one-time' ? 'method' : 'plans');
        });

    } catch (err) {
        console.error("Payment Init Error", err);
        setError("Failed to initiate payment. Backend might be offline.");
        setStep(config.type === 'one-time' ? 'method' : 'plans');
    }
  };

  const renderPlans = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-serif text-saffron-100">Unlock Cosmic Wisdom</h3>
        <p className="text-saffron-600/80 text-sm">Get unlimited access to Gemstones, Numerology, and Advanced Kundali Reports.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => setSelectedPlan('monthly')}
          className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedPlan === 'monthly' ? 'bg-saffron-900/30 border-saffron-500 shadow-lg shadow-saffron-900/20' : 'bg-black/20 border-saffron-900/30 opacity-70 hover:opacity-100'}`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-saffron-200 font-bold">Monthly</span>
            {selectedPlan === 'monthly' && <Check size={16} className="text-saffron-500" />}
          </div>
          <div className="text-3xl font-serif text-white mb-1">₹99</div>
          <div className="text-xs text-saffron-600">billed monthly</div>
        </div>

        <div 
          onClick={() => setSelectedPlan('yearly')}
          className={`relative border rounded-xl p-4 cursor-pointer transition-all ${selectedPlan === 'yearly' ? 'bg-saffron-900/30 border-saffron-500 shadow-lg shadow-saffron-900/20' : 'bg-black/20 border-saffron-900/30 opacity-70 hover:opacity-100'}`}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-saffron-600 text-maroon-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
            BEST VALUE
          </div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-saffron-200 font-bold">Yearly</span>
            {selectedPlan === 'yearly' && <Check size={16} className="text-saffron-500" />}
          </div>
          <div className="text-3xl font-serif text-white mb-1">₹599</div>
          <div className="text-xs text-saffron-600">₹50/month (Save 50%)</div>
        </div>
      </div>

      {error && <p className="text-red-400 text-xs text-center animate-pulse">{error}</p>}

      <button 
        onClick={() => setStep('method')}
        className="w-full py-3 bg-gradient-to-r from-saffron-600 to-red-700 text-white font-bold rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all"
      >
        Continue to Payment
      </button>
    </div>
  );

  const renderMethod = () => {
    const amountDisplay = config.type === 'one-time' 
        ? `₹${config.amount}` 
        : (selectedPlan === 'monthly' ? '₹99' : '₹599');

    const titleDisplay = config.type === 'one-time' 
        ? config.title 
        : (selectedPlan === 'monthly' ? 'Monthly Premium' : 'Yearly Premium');

    return (
      <div className="space-y-6">
         <div className="flex items-center gap-2 mb-2">
            {config.type === 'subscription' && (
                <button onClick={() => setStep('plans')} className="text-saffron-500 text-sm hover:underline">Change Plan</button>
            )}
            <div className="flex-grow"></div>
            <div className="text-right">
                <div className="text-[10px] text-saffron-500 uppercase tracking-widest">{titleDisplay}</div>
                <span className="font-bold text-saffron-100 text-xl">{amountDisplay}</span>
            </div>
         </div>
  
         <div className="space-y-3">
            <h4 className="text-saffron-200 font-medium text-sm">Select Payment Mode</h4>
            
            {/* UPI Selection */}
            <div 
              onClick={() => setPaymentMethod('upi')}
              className={`border rounded-xl p-3 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'bg-saffron-900/20 border-saffron-500 shadow-sm shadow-saffron-500/10' : 'bg-black/20 border-saffron-900/30 opacity-80'}`}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-full ${paymentMethod === 'upi' ? 'bg-saffron-500/20 text-saffron-400' : 'bg-black/40 text-saffron-700'}`}>
                        <Smartphone size={20} />
                    </div>
                    <div className="flex-1">
                        <div className="text-saffron-100 font-medium text-sm">UPI / Apps</div>
                        <div className="text-[10px] text-saffron-600">Google Pay, PhonePe, Paytm</div>
                    </div>
                    {paymentMethod === 'upi' && <div className="w-5 h-5 bg-saffron-500 rounded-full p-1 flex items-center justify-center"><Check size={12} className="text-black stroke-[3]"/></div>}
                </div>
                
                {paymentMethod === 'upi' && (
                    <div className="mt-3 animate-fade-in pl-2">
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setUpiApp('gpay'); setUpiId(''); }} 
                                className={`py-2 px-1 rounded-lg border text-xs font-medium transition-all ${upiApp === 'gpay' && !upiId ? 'bg-white text-black border-white shadow-md' : 'border-saffron-900/30 text-saffron-400 hover:bg-white/5'}`}
                            >
                                Google Pay
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setUpiApp('phonepe'); setUpiId(''); }} 
                                className={`py-2 px-1 rounded-lg border text-xs font-medium transition-all ${upiApp === 'phonepe' && !upiId ? 'bg-[#5f259f] text-white border-[#5f259f] shadow-md' : 'border-saffron-900/30 text-saffron-400 hover:bg-white/5'}`}
                            >
                                PhonePe
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setUpiApp('paytm'); setUpiId(''); }} 
                                className={`py-2 px-1 rounded-lg border text-xs font-medium transition-all ${upiApp === 'paytm' && !upiId ? 'bg-[#00b9f1] text-white border-[#00b9f1] shadow-md' : 'border-saffron-900/30 text-saffron-400 hover:bg-white/5'}`}
                            >
                                Paytm
                            </button>
                        </div>
                        
                        {/* Separator */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-[1px] bg-saffron-900/30 flex-1"></div>
                            <span className="text-[10px] text-saffron-600 uppercase">OR</span>
                            <div className="h-[1px] bg-saffron-900/30 flex-1"></div>
                        </div>

                        {/* UPI ID Input */}
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <input 
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="Enter UPI ID (e.g. username@okicici)"
                                className="w-full bg-black/40 border border-saffron-900/30 rounded-lg py-2 px-3 text-xs text-saffron-100 placeholder-saffron-800/50 focus:border-saffron-500 outline-none transition-colors"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Card Selection */}
            <div 
              onClick={() => setPaymentMethod('card')}
              className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer transition-all ${paymentMethod === 'card' ? 'bg-saffron-900/20 border-saffron-500 shadow-sm shadow-saffron-500/10' : 'bg-black/20 border-saffron-900/30 opacity-80'}`}
            >
                <div className={`p-2 rounded-full ${paymentMethod === 'card' ? 'bg-green-500/20 text-green-400' : 'bg-black/40 text-saffron-700'}`}>
                    <CreditCard size={20} />
                </div>
                <div className="flex-1">
                    <div className="text-saffron-100 font-medium text-sm">Credit / Debit Card</div>
                    <div className="text-[10px] text-saffron-600">Visa, Mastercard, RuPay</div>
                </div>
                {paymentMethod === 'card' && <div className="w-5 h-5 bg-saffron-500 rounded-full p-1 flex items-center justify-center"><Check size={12} className="text-black stroke-[3]"/></div>}
            </div>

            {/* Netbanking */}
             <div 
              onClick={() => setPaymentMethod('netbanking')}
              className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'bg-saffron-900/20 border-saffron-500 shadow-sm shadow-saffron-500/10' : 'bg-black/20 border-saffron-900/30 opacity-80'}`}
            >
                <div className={`p-2 rounded-full ${paymentMethod === 'netbanking' ? 'bg-blue-500/20 text-blue-400' : 'bg-black/40 text-saffron-700'}`}>
                    <Banknote size={20} />
                </div>
                <div className="flex-1">
                    <div className="text-saffron-100 font-medium text-sm">Net Banking</div>
                    <div className="text-[10px] text-saffron-600">All Indian Banks Supported</div>
                </div>
                {paymentMethod === 'netbanking' && <div className="w-5 h-5 bg-saffron-500 rounded-full p-1 flex items-center justify-center"><Check size={12} className="text-black stroke-[3]"/></div>}
            </div>
         </div>
  
         {error && <p className="text-red-400 text-xs text-center animate-pulse">{error}</p>}
  
         <button 
          onClick={handlePayment}
          className="w-full py-3 bg-gradient-to-r from-saffron-600 to-red-700 text-white font-bold rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-4"
         >
           <ShieldCheck size={18} /> 
           Pay {amountDisplay} via {paymentMethod === 'upi' ? (upiId ? 'UPI ID' : (upiApp === 'gpay' ? 'GPay' : upiApp === 'phonepe' ? 'PhonePe' : 'Paytm')) : (paymentMethod === 'card' ? 'Card' : 'NetBanking')}
         </button>
         
         <div className="text-center text-[10px] text-saffron-600 flex items-center justify-center gap-1">
            <ShieldCheck size={10} /> 100% Secure Payment via Razorpay
         </div>
      </div>
    );
  };

  const renderProcessing = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
       <div className="w-16 h-16 border-4 border-saffron-900 border-t-saffron-500 rounded-full animate-spin"></div>
       <div>
         <h3 className="text-xl font-serif text-saffron-200">Processing Transaction...</h3>
         <p className="text-saffron-600 text-sm">Please wait. Do not refresh.</p>
       </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 animate-fade-in">
       <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500">
          <Check size={40} className="text-green-500" />
       </div>
       <div>
         <h3 className="text-2xl font-serif text-white">Payment Successful!</h3>
         <p className="text-saffron-400">{config.type === 'one-time' ? 'Download Unlocked' : 'Welcome to Premium'}</p>
       </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-maroon-900 border border-saffron-500/50 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Header Pattern */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-saffron-500 to-transparent"></div>
        
        {step !== 'success' && step !== 'processing' && (
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-saffron-500 hover:text-white transition-colors z-10"
            >
                <X size={24} />
            </button>
        )}

        <div className="p-6 sm:p-8">
            {step === 'plans' && renderPlans()}
            {step === 'method' && renderMethod()}
            {step === 'processing' && renderProcessing()}
            {step === 'success' && renderSuccess()}
        </div>
      </div>
    </div>
  );
};
