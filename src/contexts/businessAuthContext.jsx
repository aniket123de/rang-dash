import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { businessAuth, businessDb } from '../firebase/businessFirebase';

const BusinessAuthContext = createContext(null);

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-black">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

const BusinessAuthProvider = ({ children }) => {
  const [state, setState] = useState({
    currentUser: null,
    businessData: null,
    loading: true,
    initialized: false
  });

  // Initialize persistence
  useEffect(() => {
    const init = async () => {
      try {
        await setPersistence(businessAuth, browserLocalPersistence);
      } catch (error) {
        console.error('Error setting persistence:', error);
      } finally {
        setState(prev => ({ ...prev, initialized: true }));
      }
    };
    init();
  }, []);

  // Handle auth state changes
  useEffect(() => {
    if (!state.initialized) return;

    const unsubscribe = onAuthStateChanged(businessAuth, async (user) => {
      if (!user) {
        setState(prev => ({
          ...prev,
          currentUser: null,
          businessData: null,
          loading: false
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        currentUser: user,
        loading: true
      }));

      try {
        const businessDoc = await getDoc(doc(businessDb, 'businesses', user.uid));
        setState(prev => ({
          ...prev,
          businessData: businessDoc.exists() ? businessDoc.data() : null,
          loading: false
        }));
      } catch (error) {
        console.error('Error fetching business data:', error);
        setState(prev => ({
          ...prev,
          businessData: null,
          loading: false
        }));
      }
    });

    return () => unsubscribe();
  }, [state.initialized]);

  const signup = async (email, password, businessInfo) => {
    const userCredential = await createUserWithEmailAndPassword(businessAuth, email, password);
    if (businessInfo) {
      const businessData = {
        ...businessInfo,
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(businessDb, 'businesses', userCredential.user.uid), businessData);
      setState(prev => ({
        ...prev,
        businessData
      }));
    }
    return userCredential;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(businessAuth, email, password);
    try {
      const businessDoc = await getDoc(doc(businessDb, 'businesses', userCredential.user.uid));
      if (businessDoc.exists()) {
        setState(prev => ({
          ...prev,
          businessData: businessDoc.data()
        }));
      }
    } catch (error) {
      console.error('Error fetching business data during login:', error);
    }
    return userCredential;
  };

  const logout = async () => {
    await signOut(businessAuth);
    setState(prev => ({
      ...prev,
      currentUser: null,
      businessData: null
    }));
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(businessAuth, email);
  };

  const updateBusinessInfo = async (businessInfo) => {
    if (!state.currentUser) throw new Error('No business user logged in');
    
    const updatedData = {
      ...businessInfo,
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(doc(businessDb, 'businesses', state.currentUser.uid), updatedData, { merge: true });
    
    setState(prev => ({
      ...prev,
      businessData: {
        ...prev.businessData,
        ...updatedData
      }
    }));
  };

  const value = {
    currentUser: state.currentUser,
    businessData: state.businessData,
    loading: state.loading || !state.initialized,
    signup,
    login,
    logout,
    resetPassword,
    updateBusinessInfo
  };

  if (value.loading) {
    return <LoadingSpinner />;
  }

  return (
    <BusinessAuthContext.Provider value={value}>
      {children}
    </BusinessAuthContext.Provider>
  );
};

const useBusinessAuth = () => {
  const context = useContext(BusinessAuthContext);
  if (context === null) {
    throw new Error('useBusinessAuth must be used within a BusinessAuthProvider');
  }
  return context;
};

export { BusinessAuthProvider, useBusinessAuth }; 