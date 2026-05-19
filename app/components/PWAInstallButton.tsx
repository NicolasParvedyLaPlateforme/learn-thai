'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as PWA (standalone)
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone === true;
    setIsStandalone(isPWA);

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If we don't have the prompt event, we can show a user instruction tooltip or alert
      // This is typical for iOS Safari where beforeinstallprompt is not supported
      alert("Pour installer l'application sur iOS : appuyez sur l'icône de partage 📤, puis sélectionnez 'Sur l'écran d'accueil'.");
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  // Only show on non-standalone
  if (isStandalone) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors md:hidden shrink-0"
      title="Installer l'application"
    >
      <Download size={18} strokeWidth={2.5} />
    </button>
  );
}
