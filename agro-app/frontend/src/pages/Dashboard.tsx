import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Stack,
} from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Box component="main" sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom className="u-font-weight-semibold u-text-green-primary">
        Panel de Control
      </Typography>
      
      <Grid container spacing={3}>
        {/* Métrica 1: Estado del Campo */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
            <CardHeader
              title="Estado del Campo"
              subheader="Actualizado hace 2 horas"
              className="u-bg-green-primary-light u-text-green-primary-dark"
            />
            <CardContent>
              <Typography variant="h2" className="u-text-green-primary u-font-weight-bold">
                85%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Salud general del cultivo
              </Typography>
              <Box mt={2}>
                <div className="u-bg-green-primary-lighter u-rounded-sm" style={{ height: 8 }}>
                  <div className="u-bg-green-primary u-rounded-sm" style={{ width: '85%', height: '100%' }}></div>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Métrica 2: Próximo Riego */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
            <CardHeader
              title="Próximo Riego"
              subheader="En 18 horas"
              className="u-bg-blue-light u-text-blue-dark"
            />
            <CardContent>
              <Typography variant="h2" className="u-text-accent-blue u-font-weight-bold">
                18h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tiempo hasta el próximo riego programado
              </Typography>
              <Box mt={2}>
                <div className="u-bg-accent-blue-lighter u-rounded-sm" style={{ height: 8 }}>
                  <div className="u-bg-accent-blue u-rounded-sm" style={{ width: '40%', height: '100%' }}></div>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Métrica 3: Humedad del Suelo */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
            <CardHeader
              title="Humedad del Suelo"
              subheader="Óptima"
              className="u-bg-brown-primary-light u-text-brown-primary-dark"
            />
            <CardContent>
              <Typography variant="h2" className="u-text-brown-primary u-font-weight-bold">
                62%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nivel actual de humedad
              </Typography>
              <Box mt={2}>
                <div className="u-bg-brown-primary-lighter u-rounded-sm" style={{ height: 8 }}>
                  <div className="u-bg-brown-primary u-rounded-sm" style={{ width: '62%', height: '100%' }}></div>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Métrica 4: Pronóstico del Clima */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
            <CardHeader
              title="Pronóstico"
              subheader="Próximos 5 días"
              className="u-bg-yellow-light u-text-yellow-dark"
            />
            <CardContent>
              <Typography variant="h2" className="u-text-accent-yellow u-font-weight-bold">
                22°
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Temperatura promedio esperada
              </Typography>
              <Box mt={2} display="flex" justifyContent="space-around">
                <div className="u-text-center">
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>
                    ☀️
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Soleado
                  </Typography>
                </div>
                <div className="u-text-center">
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>
                    🌤️
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Parcialmente nublado
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Segunda fila de tarjetas */}
      <Grid container spacing={3} mt={4}>
        {/* Actividad Reciente */}
        <Grid item xs={12} md={8}>
          <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
            <CardHeader
              title="Actividad Reciente"
              className="u-bg-green-primary-light u-text-green-primary-dark"
            />
            <CardContent>
              <Stack spacing={2}>
                <div className="u-flex u-justify-between u-border-b u-pb-2">
                  <Typography variant="body1" className="u-font-weight-medium">
                    Análisis de muestra de suelo
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hoy, 10:30 AM
                  </Typography>
                </div>
                <div className="u-flex u-justify-between u-border-b u-pb-2">
                  <Typography variant="body1" className="u-font-weight-medium">
                    Programa de fertilización actualizado
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Ayer, 3:45 PM
                  </Typography>
                </div>
                <div className="u-flex u-justify-between u-border-b u-pb-2">
                  <Typography variant="body1" className="u-font-weight-medium">
                    Alerta de plaga detectada en lote 3
                  </Typography>
                  <Typography variant="caption" color="text.error">
                    Hoy, 8:15 AM
                  </Typography>
                </div>
                <div className="u-flex u-justify-between">
                  <Typography variant="body1" className="u-font-weight-medium">
                    Recomendación de rotación de cultivos
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Ayer, 6:20 PM
                  </Typography>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Accesos Rápidos */}
        <Grid item xs={12} md={4}>
          <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
            <CardHeader
              title="Accesos Rápidos"
              className="u-bg-green-primary-light u-text-green-primary-dark"
            />
            <CardContent>
              <Stack spacing={2}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  fullWidth
                  startIcon={<LocalFloristIcon fontSize="inherit" />}
                >
                  Identificar Semillas
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  fullWidth
                  startIcon={<AnalyticsIcon fontSize="inherit" />}
                >
                  Diagnóstico de Cultivo
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="large"
                  fullWidth
                  startIcon={<CalculateIcon fontSize="inherit" />}
                >
                  Calculadora de Cosecha
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  size="large"
                  fullWidth
                  startIcon={<ChatIcon fontSize="inherit" />}
                >
                  Chat con Agrónomo IA
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;