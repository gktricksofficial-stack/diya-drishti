
import { db } from './firebase';
// import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { BirthDetailsForm, ChartResponse, UserProfile } from '../types';

export interface HistoryItem {
  id: string;
  userId: string;
  birthDetails: BirthDetailsForm;
  chartData: ChartResponse;
  timestamp: any;
}

const COLLECTION_NAME = 'user_charts';
const FEEDBACK_COLLECTION = 'feedback';

// Logic: If hostname is localhost, use port 8000. 
// If deployed (Render/Netlify where frontend is served by backend), use empty string for relative path.
const getBackendUrl = () => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:8000';
    }
    return ''; // Relative path for production
};

const BACKEND_URL = getBackendUrl();

/**
 * Saves a generated chart to the user's history
 */
export const saveUserChart = async (user: UserProfile, birthDetails: BirthDetailsForm, chartData: ChartResponse) => {
  // Always use local storage for this demo version to avoid Firebase dependency issues
    const history = JSON.parse(localStorage.getItem('demo_history') || '[]');
    const newItem = {
      id: Date.now().toString(),
      userId: user.uid,
      birthDetails,
      chartData,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('demo_history', JSON.stringify([newItem, ...history]));
    return;
};

/**
 * Fetches user's previous charts
 */
export const getUserHistory = async (user: UserProfile): Promise<HistoryItem[]> => {
  // Always use local storage for this demo version
    const data = JSON.parse(localStorage.getItem('demo_history') || '[]');
    // Filter by the current user's UID to show only their data
    const userHistory = data.filter((item: any) => item.userId === user.uid);
    
    return userHistory.map((d: any) => ({
        ...d,
        timestamp: new Date(d.timestamp) // simple string to date conversion for demo
    }));
};

/**
 * Saves user feedback to Firestore AND sends an email via Python Backend
 */
export const saveFeedback = async (type: 'feedback' | 'contact', message: string, email?: string) => {
    // 1. Save to Local Log (Mock Database Record)
    console.log("Saving feedback locally:", { type, message, email });

    // 2. Send Email via Backend
    try {
        const response = await fetch(`${BACKEND_URL}/submit_feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type,
                message,
                email: email || 'anonymous'
            })
        });
        
        if (!response.ok) {
            console.warn("Backend email service unreachable");
        }
    } catch (e) {
        console.error("Error sending email via backend:", e);
    }
};
