import React from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardHeader, Stack, Button,
  Chip, Alert,
} from '@mui/material';
import {
  LocalFlorist, Analytics, Chat, WaterDrop,
  BugReport, Download, Notifications, Agriculture, Spa, CalendarMonth,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { firebaseService } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { seedsDatabase } from '../data/seeds';
import { exportCropsToCSV, exportSeedsToCSV } from '../utils/exportData';
import { requestNotificationPermission, sendWeatherAlert } from '../utils/notifications';

const BarChart: React.FC<{ data: { label: string; value: number; color: string }[]; height?: number }> = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barWidth = Math.max(20, Math.min(60, 600 / data.length - 8));
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height, px: 1 }}>
      {data.map((item, i) => (
        <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>{item.value}</Typography>
          <Box sx={{ width: barWidth, height: `${(item.value / maxValue) * (height - 40)}px`, bgcolor: item.color, borderRadius: '4px 4px 0 0', transition: 'height 0.3s', minHeight: 4 }} />
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.65rem' }}>{item.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [crops, setCrops] = React.useState<any[]>([]);
  const [irrigations, setIrrigations] = React.useState<any[]>([]);
  const [weatherData, setWeatherData] = React.useState<any>(null);
  const [diagnoses, setDiagnoses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [notifGranted, setNotifGranted] = React.useState(false);

  React.useEffect(() => {
    if (user) loadData();
  }, [user]);

  React.useEffect(() => {
    setNotifGranted(Notification.permission === 'granted');
  }, []);

  const loadData = async () => {
    try {
      const [cropsData, weatherDataResult, diagnosesData] = await Promise.all([
        firebaseService.getCrops(user!.uid),
        firebaseService.getWeatherData(),
        firebaseService.getDiagnoses(),
      ]);
      setCrops(cropsData);
      setWeatherData(weatherDataResult);
      setDiagnoses(diagnosesData);

      const allIrrigations: any[] = [];
      for (const crop of cropsData) {
        try {
          const irrs = await firebaseService.getIrrigations(crop.id);
          allIrrigations.push(...irrs);
        } catch { /* silent */ }
      }
      setIrrigations(allIrrigations);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeCrops = crops.filter(c => c.status === 'active');
  const harvestedCrops = crops.filter(c => c.status === 'harvested');
  const totalIrrigation = irrigations.reduce((sum, ir) => sum + (ir.amount || 0), 0);
  const recentDiagnoses = diagnoses.slice(0, 5);

  const cropVarieties: Record<string, number> = {};
  activeCrops.forEach(c => {
    cropVarieties[c.cropVariety] = (cropVarieties[c.cropVariety] || 0) + 1;
  });
  const cropChartData = Object.entries(cropVarieties).slice(0, 6).map(([name, count]) => ({
    label: name,
    value: count,
    color: name === 'Maíz' ? 'var(--green-primary)' :
           name === 'Arroz' ? 'var(--green-primary-light)' :
           name === 'Frijol' ? 'var(--brown-primary)' :
           name === 'Tomate' ? 'var(--accent-yellow)' :
           name === 'Café Arábica' ? 'var(--accent-blue)' : 'var(--green-primary-lighter)',
  }));

  const totalArea = crops.reduce((sum, c) => sum + (c.area || 0), 0);
  const avgSoilMoisture = weatherData?.humidity ? Math.min(100, weatherData.humidity * 0.8 + 20) : 0;

  const handleExport = () => {
    if (crops.length > 0) {
      exportCropsToCSV(crops);
    } else {
      alert('No hay cultivos registrados para exportar.');
    }
  };

  const handleExportSeeds = () => {
    exportSeedsToCSV(seedsDatabase);
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotifGranted(granted);
    if (granted) {
      sendWeatherAlert('Notificaciones activadas — recibirás alertas de riego y clima');
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'center', pt: 8 }}>
        <Typography variant="h6" color="text.secondary">Cargando panel de control...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" className="u-font-weight-semibold u-text-green-primary">
          Panel de Control
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {!notifGranted && (
            <Button variant="contained" size="small" startIcon={<Notifications />} onClick={handleEnableNotifications} sx={{ fontSize: '0.7rem', bgcolor: '#1976D2', color: '#fff', '&:hover': { bgcolor: '#1565C0' } }}>
              Activar Notif
            </Button>
          )}
          {notifGranted && (
            <Chip icon={<Notifications />} label="Notif activas" color="success" size="small" variant="outlined" />
          )}
          <Button variant="contained" size="small" startIcon={<Download />} onClick={handleExport} sx={{ fontSize: '0.7rem', bgcolor: crops.length > 0 ? '#1976D2' : '#9E9E9E', color: '#fff', '&:hover': { bgcolor: crops.length > 0 ? '#1565C0' : '#757575' } }}>
            Export Cult
          </Button>
          <Button variant="contained" size="small" startIcon={<Download />} onClick={handleExportSeeds} sx={{ fontSize: '0.7rem', bgcolor: '#388E3C', color: '#fff', '&:hover': { bgcolor: '#2E7D32' } }}>
            Export Sem
          </Button>
        </Stack>
      </Box>

      {crops.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }} action={
          <Button color="inherit" size="small" component={Link} to="/crops">Ir a Cultivos</Button>
        }>
          No hay cultivos registrados. Comienza agregando tu primer cultivo.
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card className="u-bg-card u-shadow-sm" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Cultivos Activos</Typography>
                  <Agriculture sx={{ fontSize: 20, color: 'var(--green-primary)' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>{activeCrops.length}</Typography>
                <Box sx={{ height: 6, bgcolor: 'var(--green-primary-lightest)', borderRadius: 3 }}>
                  <Box sx={{ width: `${activeCrops.length > 0 ? Math.min(100, (activeCrops.length / (crops.length || 1)) * 100) : 0}%`, height: '100%', bgcolor: 'var(--green-primary)', borderRadius: 3 }} />
                </Box>
                {totalArea > 0 && <Typography variant="caption" color="text.secondary">{totalArea.toFixed(1)} ha totales</Typography>}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card className="u-bg-card u-shadow-sm" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Humedad del Suelo</Typography>
                  <WaterDrop sx={{ fontSize: 20, color: 'var(--accent-blue)' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4FC3F7' }}>{avgSoilMoisture.toFixed(0)}%</Typography>
                <Box sx={{ height: 6, bgcolor: 'var(--info-bg)', borderRadius: 3 }}>
                  <Box sx={{ width: `${avgSoilMoisture}%`, height: '100%', bgcolor: 'var(--accent-blue)', borderRadius: 3 }} />
                </Box>
                <Typography variant="caption" color="text.secondary">Basado en datos climáticos</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card className="u-bg-card u-shadow-sm" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Riego Total</Typography>
                  <WaterDrop sx={{ fontSize: 20, color: 'var(--brown-primary)' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#8D6E63' }}>{totalIrrigation.toFixed(0)} mm</Typography>
                <Box sx={{ height: 6, bgcolor: 'var(--brown-primary-lightest)', borderRadius: 3 }}>
                  <Box sx={{ width: `${Math.min(100, totalIrrigation / 2)}%`, height: '100%', bgcolor: 'var(--brown-primary)', borderRadius: 3 }} />
                </Box>
                <Typography variant="caption" color="text.secondary">{irrigations.length} riegos registrados</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card className="u-bg-card u-shadow-sm" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Diagnósticos</Typography>
                  <BugReport sx={{ fontSize: 20, color: 'var(--error)' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#F44336' }}>{diagnoses.length}</Typography>
                <Box sx={{ height: 6, bgcolor: 'var(--error-bg)', borderRadius: 3 }}>
                  <Box sx={{ width: `${Math.min(100, diagnoses.length * 10)}%`, height: '100%', bgcolor: 'var(--error)', borderRadius: 3 }} />
                </Box>
                <Typography variant="caption" color="text.secondery">análisis realizados</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="u-bg-card u-shadow-sm" sx={{ height: '100%' }}>
            <CardHeader
              title="Cultivos por Variedad"
              subheader={activeCrops.length > 0 ? `${activeCrops.length} cultivos activos` : 'Sin datos'}
              className="u-bg-green-primary-light"
              titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
            />
            <CardContent>
              {cropChartData.length > 0 ? (
                <BarChart data={cropChartData} height={180} />
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  Agrega cultivos para ver la distribución
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="u-bg-card u-shadow-sm" sx={{ height: '100%' }}>
            <CardHeader
              title="Resumen Rápido"
              className="u-bg-green-primary-light"
              titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
            />
            <CardContent>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Cultivos activos</Typography>
                  <Chip label={activeCrops.length} color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Cosechados</Typography>
                  <Chip label={harvestedCrops.length} color="info" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Variedades distintas</Typography>
                  <Chip label={Object.keys(cropVarieties).length} color="primary" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Total área cultivada</Typography>
                  <Chip label={`${totalArea.toFixed(1)} ha`} color="secondary" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Temperatura actual</Typography>
                  <Chip label={weatherData?.temperature ? `${weatherData.temperature}°C` : '—'} size="small" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card className="u-bg-card u-shadow-sm" sx={{ height: '100%' }}>
            <CardHeader
              title="Actividad Reciente"
              className="u-bg-green-primary-light"
              titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
            />
            <CardContent>
              <Stack spacing={1.5}>
                {crops.length === 0 && irrigations.length === 0 && diagnoses.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                    No hay actividad reciente. Comienza agregando un cultivo.
                  </Typography>
                ) : (
                  <>
                    {crops.slice(0, 3).map((crop: any) => (
                      <Box key={crop.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', pb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Spa fontSize="small" color="success" />
                          <Typography variant="body2">{crop.name} — {crop.cropVariety}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {crop.createdAt?.toDate?.()?.toLocaleDateString?.('es-ES') || 'Recién agregado'}
                        </Typography>
                      </Box>
                    ))}
                    {irrigations.slice(0, 3).map((ir: any) => (
                      <Box key={ir.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', pb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WaterDrop fontSize="small" color="info" />
                          <Typography variant="body2">Riego: {ir.amount} {ir.unit}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {ir.date ? new Date(ir.date).toLocaleDateString('es-ES') : ''}
                        </Typography>
                      </Box>
                    ))}
                    {recentDiagnoses.map((d: any) => (
                      <Box key={d.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Analytics fontSize="small" color="warning" />
                          <Typography variant="body2">{d.cropType || 'Diagnóstico'} — {d.result || d.disease || 'Saludable'}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {d.createdAt?.toDate?.()?.toLocaleDateString?.('es-ES') || ''}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="u-bg-card u-shadow-sm" sx={{ height: '100%' }}>
            <CardHeader
              title="Accesos Rápidos"
              className="u-bg-green-primary-light"
              titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
            />
            <CardContent>
              <Stack spacing={1.5}>
                <Button variant="contained" color="primary" size="small" fullWidth startIcon={<Agriculture />} component={Link} to="/crops">
                  Gestionar Cultivos
                </Button>
                <Button variant="contained" color="secondary" size="small" fullWidth startIcon={<WaterDrop />} component={Link} to="/irrigation">
                  Necesidades de Riego
                </Button>
                <Button variant="outlined" color="primary" size="small" fullWidth startIcon={<LocalFlorist />} component={Link} to="/seeds">
                  Identificar Semillas
                </Button>
                <Button variant="outlined" color="secondary" size="small" fullWidth startIcon={<CalendarMonth />} component={Link} to="/calendar">
                  Calendario de Cultivos
                </Button>
                <Button variant="outlined" size="small" fullWidth startIcon={<Chat />} component={Link} to="/chat">
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
