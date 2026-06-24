import React from 'react';
import {
  Box, Typography, Card, CardContent, CardHeader, Stack,
  MenuItem, TextField, Grid, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, LinearProgress, Alert,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import {
  WaterDrop, ExpandMore, Opacity, CalendarToday, ShowChart,
  Thermostat, CheckCircle, Info,
} from '@mui/icons-material';
import { firebaseService } from '../firebase';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

interface Crop {
  id: string;
  name: string;
  cropVariety: string;
  area: number;
  areaUnit: string;
  irrigationSystem: string;
  soilType: string;
  sowingDate: string;
  plantingFrame: string;
  crownDiameter: number;
  units: string;
  status: string;
}

interface WaterStatus {
  id: string;
  cropId: string;
  date: string;
  soilMoisture: number;
  etc: number;
  precipitation: number;
  irrigation: number;
  waterBalance: number;
}

const soilCoefficients: Record<string, number> = {
  'Arcilloso': 0.8, 'Arenoso': 0.5, 'Franco': 0.7, 'Limoso': 0.75,
  'Turboso': 0.85, 'Cretáceo': 0.55, 'Franco-arenoso': 0.6,
  'Franco-arcilloso': 0.75, 'Franco-limoso': 0.7,
  'Arcillo-arenoso': 0.7, 'Arcillo-limoso': 0.75,
};

const cropKcValues: Record<string, { ini: number; mid: number; end: number; days: { ini: number; dev: number; mid: number; end: number } }> = {
  'Maiz': { ini: 0.3, mid: 1.2, end: 0.6, days: { ini: 20, dev: 35, mid: 40, end: 30 } },
  'Trigo': { ini: 0.3, mid: 1.15, end: 0.4, days: { ini: 20, dev: 30, mid: 40, end: 30 } },
  'Soja': { ini: 0.3, mid: 1.1, end: 0.5, days: { ini: 20, dev: 30, mid: 40, end: 25 } },
  'Arroz': { ini: 1.05, mid: 1.2, end: 1.0, days: { ini: 30, dev: 30, mid: 60, end: 30 } },
  'Frijol': { ini: 0.3, mid: 1.05, end: 0.6, days: { ini: 15, dev: 25, mid: 35, end: 20 } },
  'Tomate': { ini: 0.4, mid: 1.15, end: 0.8, days: { ini: 20, dev: 30, mid: 40, end: 25 } },
  'Cafe Arabica': { ini: 0.3, mid: 1.1, end: 0.8, days: { ini: 30, dev: 40, mid: 60, end: 30 } },
  'Cacao': { ini: 0.3, mid: 1.1, end: 0.8, days: { ini: 30, dev: 40, mid: 60, end: 30 } },
  'Papa': { ini: 0.4, mid: 1.15, end: 0.75, days: { ini: 20, dev: 30, mid: 35, end: 25 } },
  'Yuca': { ini: 0.3, mid: 1.1, end: 0.7, days: { ini: 25, dev: 35, mid: 50, end: 30 } },
  'Cebolla': { ini: 0.4, mid: 1.0, end: 0.75, days: { ini: 15, dev: 25, mid: 35, end: 20 } },
  'Zanahoria': { ini: 0.4, mid: 1.05, end: 0.7, days: { ini: 20, dev: 25, mid: 35, end: 25 } },
  'Lechuga': { ini: 0.3, mid: 0.95, end: 0.7, days: { ini: 15, dev: 20, mid: 25, end: 15 } },
  'Arveja': { ini: 0.3, mid: 1.05, end: 0.65, days: { ini: 15, dev: 25, mid: 35, end: 20 } },
  'Cana de Azucar': { ini: 0.4, mid: 1.25, end: 0.75, days: { ini: 35, dev: 50, mid: 70, end: 40 } },
  'Platano': { ini: 0.5, mid: 1.2, end: 0.9, days: { ini: 30, dev: 40, mid: 60, end: 30 } },
  'Mango': { ini: 0.3, mid: 1.1, end: 0.7, days: { ini: 30, dev: 40, mid: 60, end: 30 } },
  'Aguacate': { ini: 0.4, mid: 1.15, end: 0.8, days: { ini: 30, dev: 40, mid: 60, end: 30 } },
  'Naranja': { ini: 0.3, mid: 1.1, end: 0.65, days: { ini: 30, dev: 40, mid: 60, end: 30 } },
  'Uva': { ini: 0.3, mid: 1.1, end: 0.6, days: { ini: 20, dev: 30, mid: 50, end: 30 } },
};

const getGrowthStage = (sowingDate: string, variety: string): { stage: string; kc: number; daysSincePlanting: number } => {
  if (!sowingDate) return { stage: 'Desconocido', kc: 0.7, daysSincePlanting: 0 };
  const sowing = new Date(sowingDate);
  const now = new Date();
  const daysSince = Math.floor((now.getTime() - sowing.getTime()) / (1000 * 60 * 60 * 24));
  const kcData = cropKcValues[variety];
  if (!kcData) return { stage: 'No definido', kc: 0.7, daysSincePlanting: daysSince };
  const { ini, mid, end: endKc, days: d } = kcData;
  const totalDays = d.ini + d.dev + d.mid + d.end;
  if (daysSince <= d.ini) return { stage: 'Inicial', kc: ini, daysSincePlanting: daysSince };
  if (daysSince <= d.ini + d.dev) {
    const progress = (daysSince - d.ini) / d.dev;
    return { stage: 'Desarrollo', kc: ini + (mid - ini) * progress, daysSincePlanting: daysSince };
  }
  if (daysSince <= d.ini + d.dev + d.mid) return { stage: 'Media temporada', kc: mid, daysSincePlanting: daysSince };
  if (daysSince <= totalDays) {
    const progress = (daysSince - d.ini - d.dev - d.mid) / d.end;
    return { stage: 'Maduración', kc: mid - (mid - endKc) * progress, daysSincePlanting: daysSince };
  }
  return { stage: 'Cosechado', kc: endKc, daysSincePlanting: daysSince };
};

const calculateET0 = (temp: number, humidity: number, windSpeed: number): number => {
  const delta = 4098 * (0.6108 * Math.exp((17.27 * temp) / (temp + 237.3))) / Math.pow(temp + 237.3, 2);
  const gamma = 0.665e-3 * 101.3;
  const es = 0.6108 * Math.exp((17.27 * temp) / (temp + 237.3));
  const ea = es * (humidity / 100);
  const et0 = (0.408 * delta * (1.0) + gamma * (900 / (temp + 273)) * windSpeed * (es - ea)) / (delta + gamma * (1 + 0.34 * windSpeed));
  return Math.max(0, parseFloat(et0.toFixed(2)));
};

const getWeatherForET0 = () => {
  const hour = new Date().getHours();
  const baseTemp = 22 + Math.sin((hour - 6) * Math.PI / 12) * 5;
  return {
    temperature: parseFloat((baseTemp + (Math.random() - 0.5) * 4).toFixed(1)),
    humidity: parseFloat((60 + (Math.random() - 0.5) * 20).toFixed(0)),
    windSpeed: parseFloat((10 + Math.random() * 10).toFixed(1)),
  };
};

const Irrigation: React.FC = () => {
  const { user } = useAuth();
  const [crops, setCrops] = React.useState<Crop[]>([]);
  const [selectedCropId, setSelectedCropId] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);
  const [dailyNeeds, setDailyNeeds] = React.useState<any[]>([]);
  const [weeklySummary, setWeeklySummary] = React.useState<any>(null);
  const [waterStatus, setWaterStatus] = React.useState<WaterStatus[]>([]);
  const [growingInfo, setGrowingInfo] = React.useState<any>(null);

  React.useEffect(() => {
    if (user) loadInitialData();
  }, [user]);

  React.useEffect(() => {
    if (selectedCropId) calculateData();
  }, [selectedCropId]);

  const loadInitialData = async () => {
    try {
      const data = await firebaseService.getCrops(user!.uid);
      setCrops(data as Crop[]);
      if (data.length > 0) setSelectedCropId(data[0].id);
    } catch (err) {
      console.error('Error loading crops:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateData = async () => {
    const crop = crops.find(c => c.id === selectedCropId);
    if (!crop) return;

    const weather = getWeatherForET0();
    const et0 = calculateET0(weather.temperature, weather.humidity, weather.windSpeed);
    const soilCoef = soilCoefficients[crop.soilType] || 0.7;
    const growth = getGrowthStage(crop.sowingDate, crop.cropVariety);
    setGrowingInfo(growth);

    const kc = growth.kc;
    const etc = parseFloat((et0 * kc * soilCoef).toFixed(2));

    const days: any[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayWeather = getWeatherForET0();
      const dayET0 = calculateET0(dayWeather.temperature, dayWeather.humidity, dayWeather.windSpeed);
      const dayETc = parseFloat((dayET0 * kc * soilCoef).toFixed(2));
      days.push({
        date: d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' }),
        et0: dayET0,
        etc: dayETc,
        temp: dayWeather.temperature,
        humidity: dayWeather.humidity,
        wind: dayWeather.windSpeed,
        irrigationNeed: dayETc,
      });
    }
    setDailyNeeds(days);

    const totalWeeklyETc = days.reduce((sum, d) => sum + d.etc, 0);
    const avgTemp = days.reduce((sum, d) => sum + d.temp, 0) / days.length;
    setWeeklySummary({
      totalETc: parseFloat(totalWeeklyETc.toFixed(1)),
      avgTemp: parseFloat(avgTemp.toFixed(1)),
      avgKc: kc,
      growthStage: growth.stage,
      daysSincePlanting: growth.daysSincePlanting,
    });

    try {
      const statusData = await firebaseService.getWaterStatus(crop.id);
      setWaterStatus(statusData as WaterStatus[]);

      await firebaseService.saveWaterStatus({
        cropId: crop.id,
        date: new Date().toISOString(),
        soilMoisture: parseFloat((50 + Math.random() * 30).toFixed(1)),
        etc,
        precipitation: 0,
        irrigation: 0,
        waterBalance: parseFloat((etc * 1.2).toFixed(1)),
      });
    } catch (err) {
      console.error('Error with water status:', err);
    }
  };

  const selectedCrop = crops.find(c => c.id === selectedCropId);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', pt: 8 }}>
        <Typography variant="h6" color="text.secondary">Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <BackButton />
      <Typography variant="h4" gutterBottom className="u-font-weight-semibold u-text-green-primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WaterDrop /> Necesidades de Riego
      </Typography>

      {crops.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <WaterDrop sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay cultivos registrados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Primero registra un cultivo en la sección "Cultivos" para ver sus necesidades de riego.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={3}>
          {/* Crop selector */}
          <Card>
            <CardContent>
              <TextField
                select fullWidth label="Seleccionar cultivo"
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
              >
                {crops.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name} — {c.cropVariety} ({c.area} {c.areaUnit})
                  </MenuItem>
                ))}
              </TextField>
            </CardContent>
          </Card>

          {selectedCrop && growingInfo && (
            <>
              {/* Growing info */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Card variant="outlined" sx={{ textAlign: 'center', height: '100%' }}>
                    <CardContent>
                      <CalendarToday color="primary" sx={{ mb: 0.5 }} />
                      <Typography variant="h6">{growingInfo.daysSincePlanting}</Typography>
                      <Typography variant="caption" color="text.secondary">días desde siembra</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Card variant="outlined" sx={{ textAlign: 'center', height: '100%' }}>
                    <CardContent>
                      <ShowChart color="primary" sx={{ mb: 0.5 }} />
                      <Chip label={growingInfo.stage} color="primary" size="small" sx={{ mb: 0.5 }} />
                      <Typography variant="caption" color="text.secondary">etapa fenológica</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Card variant="outlined" sx={{ textAlign: 'center', height: '100%' }}>
                    <CardContent>
                      <Opacity color="primary" sx={{ mb: 0.5 }} />
                      <Typography variant="h6">{growingInfo.kc.toFixed(2)}</Typography>
                      <Typography variant="caption" color="text.secondary">coef. cultivo (Kc)</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Card variant="outlined" sx={{ textAlign: 'center', height: '100%' }}>
                    <CardContent>
                      <WaterDrop color="primary" sx={{ mb: 0.5 }} />
                      <Typography variant="h6">{selectedCrop.irrigationSystem || '—'}</Typography>
                      <Typography variant="caption" color="text.secondary">sistema de riego</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Daily irrigation needs */}
              <Card>
                <CardHeader
                  title="Necesidades de Riego Diarias"
                  subheader="Basado en ET₀, Kc del cultivo y coeficiente de suelo"
                  className="u-bg-green-primary-light"
                  titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                />
                <CardContent>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Día</TableCell>
                          <TableCell align="center">Temp</TableCell>
                          <TableCell align="center">Humedad</TableCell>
                          <TableCell align="center">Viento</TableCell>
                          <TableCell align="center">ET₀</TableCell>
                          <TableCell align="center">ETc</TableCell>
                          <TableCell align="center">Necesidad Riego</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dailyNeeds.map((day, i) => (
                          <TableRow key={i}>
                            <TableCell sx={{ fontWeight: 600 }}>{day.date}</TableCell>
                            <TableCell align="center">{day.temp}°C</TableCell>
                            <TableCell align="center">{day.humidity}%</TableCell>
                            <TableCell align="center">{day.wind} km/h</TableCell>
                            <TableCell align="center">{day.et0} mm</TableCell>
                            <TableCell align="center">{day.etc} mm</TableCell>
                            <TableCell align="center">
                              <Chip
                                label={`${day.irrigationNeed} mm`}
                                color={day.irrigationNeed > 5 ? 'error' : day.irrigationNeed > 3 ? 'warning' : 'success'}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>

              {/* Weekly summary */}
              {weeklySummary && (
                <Card>
                  <CardHeader
                    title="Resumen Semanal"
                    subheader="Necesidades totales de riego para los próximos 7 días"
                    className="u-bg-green-primary-light"
                    titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                  />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" color="primary.main" sx={{ fontWeight: 700 }}>
                            {weeklySummary.totalETc}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">mm totales / semana</Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" color="info.main" sx={{ fontWeight: 700 }}>
                            {weeklySummary.avgTemp}°
                          </Typography>
                          <Typography variant="body2" color="text.secondary">temp. promedio °C</Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" color="secondary.main" sx={{ fontWeight: 700 }}>
                            {weeklySummary.avgKc.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">Kc promedio</Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" color="warning.main" sx={{ fontWeight: 700 }}>
                            {(weeklySummary.totalETc / selectedCrop.area || 1).toFixed(1)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">mm/ha/semana</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}

              {/* Water status */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WaterDrop color="primary" /> Estado Hídrico de la Parcela
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Humedad del Suelo
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ flex: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={waterStatus.length > 0 ? waterStatus[0].soilMoisture : 50}
                                  sx={{ height: 12, borderRadius: 6 }}
                                  color={
                                    (waterStatus.length > 0 ? waterStatus[0].soilMoisture : 50) > 80 ? 'warning' :
                                    (waterStatus.length > 0 ? waterStatus[0].soilMoisture : 50) < 30 ? 'error' : 'success'
                                  }
                                />
                              </Box>
                              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {waterStatus.length > 0 ? waterStatus[0].soilMoisture.toFixed(0) : '—'}%
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Balance Hídrico (ETc - Aportes)
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700 }} color="primary.main">
                              {waterStatus.length > 0 ? `${waterStatus[0].waterBalance.toFixed(1)} mm` : '—'}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    <Alert severity={weeklySummary && weeklySummary.totalETc > 30 ? 'warning' : 'info'} icon={<Info />}>
                      {weeklySummary && weeklySummary.totalETc > 30
                        ? 'Las necesidades de riego son altas esta semana. Considera aumentar la frecuencia de riego.'
                        : 'Las necesidades de riego son moderadas. Mantén el programa de riego actual.'}
                    </Alert>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Historial de Estado Hídrico
                      </Typography>
                      {waterStatus.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">Sin datos históricos aún.</Typography>
                      ) : (
                        <TableContainer component={Card} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell align="right">Humedad %</TableCell>
                                <TableCell align="right">ETc (mm)</TableCell>
                                <TableCell align="right">Balance (mm)</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {waterStatus.map((ws) => (
                                <TableRow key={ws.id}>
                                  <TableCell>{new Date(ws.date).toLocaleDateString('es-ES')}</TableCell>
                                  <TableCell align="right">{ws.soilMoisture?.toFixed(1)}</TableCell>
                                  <TableCell align="right">{ws.etc?.toFixed(2)}</TableCell>
                                  <TableCell align="right">{ws.waterBalance?.toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {/* Recommendations */}
              <Card>
                <CardHeader
                  title="Recomendaciones de Riego"
                  className="u-bg-green-primary-light"
                  titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                />
                <CardContent>
                  <Stack spacing={1.5}>
                    <Alert severity="success" icon={<CheckCircle />}>
                      <Typography variant="body2">
                        Riego recomendado: <b>{weeklySummary?.totalETc ? `${weeklySummary.totalETc.toFixed(1)} mm/semana` : 'Calcular...'}</b>
                        {' '}({selectedCrop.irrigationSystem || 'sistema actual'})
                      </Typography>
                    </Alert>
                    <Alert severity="info" icon={<Info />}>
                      <Typography variant="body2">
                        Frecuencia sugerida: <b>
                          {weeklySummary?.totalETc > 35 ? 'Diario' :
                           weeklySummary?.totalETc > 20 ? 'Cada 2 días' :
                           weeklySummary?.totalETc > 10 ? 'Cada 3 días' : 'Semanal'}
                        </b>
                        {' '}según demanda hídrica actual
                      </Typography>
                    </Alert>
                    <Alert severity="info" icon={<Thermostat />}>
                      <Typography variant="body2">
                        Temperatura promedio: {weeklySummary?.avgTemp || '—'}°C —
                        {weeklySummary?.avgTemp > 28 ? ' Alta demanda evapotranspirativa' :
                         weeklySummary?.avgTemp > 22 ? ' Demanda moderada' : ' Demanda baja'}
                      </Typography>
                    </Alert>
                  </Stack>
                </CardContent>
              </Card>
            </>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default Irrigation;
