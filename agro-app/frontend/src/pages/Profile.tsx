import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Stack,
  Avatar,
  Switch,
  FormControlLabel,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Person,
  Save,
  Language,
  Logout,
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { darkMode, toggleDarkMode } = useThemeMode();
  const [name, setName] = React.useState('Juan Pérez');
  const [email, setEmail] = React.useState('juan@agroapp.com');
  const [farmName, setFarmName] = React.useState('Finca El Progreso');
  const [location, setLocation] = React.useState('Chiriquí, Panamá');
  const [language, setLanguage] = React.useState('es');
  const [notifications, setNotifications] = React.useState(true);
  const { logout } = useAuth();
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box component="main" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom className="u-font-weight-semibold u-text-green-primary">
        Perfil y Configuración
      </Typography>

      <Stack spacing={3}>
        <Card className="u-bg-card u-shadow-sm">
          <CardHeader
            title="Información Personal"
            avatar={<Avatar sx={{ bgcolor: 'var(--green-primary)' }}><Person /></Avatar>}
            className="u-bg-green-primary-light"
          />
          <CardContent>
            <Stack spacing={2}>
              <TextField label="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              <TextField label="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
              <TextField label="Nombre de la finca" value={farmName} onChange={(e) => setFarmName(e.target.value)} fullWidth />
              <TextField label="Ubicación" value={location} onChange={(e) => setLocation(e.target.value)} fullWidth />
            </Stack>
          </CardContent>
        </Card>

        <Card className="u-bg-card u-shadow-sm">
          <CardHeader
            title="Preferencias"
            avatar={<Avatar sx={{ bgcolor: 'var(--brown-primary)' }}><Language /></Avatar>}
            className="u-bg-brown-primary-light"
          />
          <CardContent>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Idioma</InputLabel>
                <Select value={language} label="Idioma" onChange={(e) => setLanguage(e.target.value)}>
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="pt">Português</MenuItem>
                </Select>
              </FormControl>
              <Divider />
              <FormControlLabel
                control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
                label="Modo oscuro"
              />
              <FormControlLabel
                control={<Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />}
                label="Notificaciones push"
              />
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Save />}
            onClick={handleSave}
          >
            {saved ? 'Guardado ✓' : 'Guardar Cambios'}
          </Button>
        </Box>

        <Card className="u-bg-card u-shadow-sm">
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Button
              variant="outlined"
              color="error"
              size="large"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{ px: 4 }}
            >
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default Profile;
