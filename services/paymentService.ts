// Logic: If hostname is localhost, use port 8000. 
const getBackendUrl = () => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:8000';
    }
    return ''; // Relative path for production
};

const BACKEND_URL = getBackendUrl();

export const createRazorpayOrder = async (amount: number) => {
    try {
        const response = await fetch(`${BACKEND_URL}/create_order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });
        
        if (!response.ok) throw new Error("Failed to create order");
        return await response.json();
    } catch (error) {
        console.error("Payment Error:", error);
        throw error;
    }
};

export const verifyRazorpayPayment = async (paymentData: any) => {
    try {
        const response = await fetch(`${BACKEND_URL}/verify_payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });
        
        if (!response.ok) throw new Error("Payment Verification Failed");
        return await response.json();
    } catch (error) {
        console.error("Verification Error:", error);
        throw error;
    }
};