import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, LocalFlorist } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Mínimo 8 caracteres');
  if (!/[A-Z]/.test(password)) errors.push('Debe contener mayúscula');
  if (!/[a-z]/.test(password)) errors.push('Debe contener minúscula');
  if (!/[0-9]/.test(password)) errors.push('Debe contener número');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Debe contener carácter especial');
  return errors;
};

const Login: React.FC = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'ingeniero'>('ingeniero');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Todos los campos son requeridos');
      return;
    }

    if (isSignup) {
      const errors = validatePassword(password);
      if (errors.length > 0) {
        setPasswordErrors(errors);
        return;
      }
      setPasswordErrors([]);
    }

    setLoading(true);
    try {
      if (isSignup) {
        await signup(email, password, role);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err: any) {
      const code = err.code;
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setError('Credenciales inválidas');
      } else if (code === 'auth/email-already-in-use') {
        setError('El correo ya está registrado');
      } else if (code === 'auth/weak-password') {
        setError('La contraseña es muy débil');
      } else if (code === 'auth/configuration-not-found') {
        setError('Firebase Auth no está activado. Ve a Firebase Console > Authentication > Sign-in method y activa Email/Password.');
      } else {
        setError(err.message || 'Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      bgcolor: 'var(--bg-secondary)',
      p: 2
    }}>
      <Card sx={{ maxWidth: 420, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} sx={{ alignItems: 'center' }}>
            <LocalFlorist sx={{ fontSize: 48, color: 'var(--green-primary)' }} />
            <Typography variant="h4" className="u-font-weight-bold u-text-green-primary">
              AgroApp
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isSignup ? 'Crear cuenta nueva' : 'Iniciar sesión'}
            </Typography>

            {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Stack spacing={2}>
                <TextField
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordErrors([]); }}
                  fullWidth
                  required
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                {isSignup && passwordErrors.length > 0 && (
                  <Alert severity="warning">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>La contraseña debe cumplir:</Typography>
                    {passwordErrors.map((err, i) => (
                      <Typography key={i} variant="caption" sx={{ display: 'block' }}>• {err}</Typography>
                    ))}
                  </Alert>
                )}

                {isSignup && (
                  <FormControl fullWidth required>
                    <InputLabel>Rol</InputLabel>
                    <Select value={role} label="Rol" onChange={(e) => setRole(e.target.value as 'admin' | 'ingeniero')}>
                      <MenuItem value="admin">Administrador</MenuItem>
                      <MenuItem value="ingeniero">Ingeniero</MenuItem>
                    </Select>
                  </FormControl>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : isSignup ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </Button>
              </Stack>
            </Box>

            <Button
              variant="text"
              color="primary"
              onClick={() => { setIsSignup(!isSignup); setError(''); setPasswordErrors([]); }}
            >
              {isSignup ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
