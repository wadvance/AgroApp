import React from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { InstallMobile } from '@mui/icons-material';

let deferredPrompt: any = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
});

const isIOS = () => {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window);
};

const isStandalone = () => {
  return window.matchMedia('(display-mode: standalone)').matches;
};

const InstallPrompt: React.FC = () => {
  const [showBanner, setShowBanner] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if (isStandalone() || dismissed) return;

    const checkPrompt = () => {
      if (isIOS()) {
        setShowBanner(true);
        return;
      }
      if (deferredPrompt) {
        setShowBanner(true);
        return;
      }
    };

    checkPrompt();

    const onPrompt = () => {
      if (deferredPrompt) setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);

    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, [dismissed]);

  const handleInstall = async () => {
    if (isIOS()) {
      setShowBanner(false);
      return;
    }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
  };

  if (!showBanner) return null;

  return (
    <Snackbar
      open={showBanner}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ mb: 7 }}
    >
      <Alert
        severity="success"
        variant="filled"
        icon={<InstallMobile />}
        action={
          <>
            <Button color="inherit" size="small" onClick={handleInstall} sx={{ fontWeight: 600 }}>
              {isIOS() ? 'Ver cómo' : 'Instalar'}
            </Button>
            <Button color="inherit" size="small" onClick={handleDismiss}>
              Ahora no
            </Button>
          </>
        }
      >
        {isIOS()
          ? 'Instala AgroApp: toca Compartir y luego "Agregar a Inicio"'
          : 'Instala AgroApp en tu celular para acceso rápido'}
      </Alert>
    </Snackbar>
  );
};

export default InstallPrompt;
