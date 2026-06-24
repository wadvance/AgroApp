import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Button,
} from '@mui/material';
import { LocalFlorist, Analytics, Calculate, Chat, TrendingUp, WaterDrop, BugReport } from '@mui/icons-material';

const BarChart: React.FC<{ data: { label: string; value: number; color: string }[]; height?: number }> = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barWidth = Math.max(20, Math.min(60, 600 / data.length - 8));
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height, px: 1 }}>
      {data.map((item, i) => (
        <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>{item.value}</Typography>
          <Box
            sx={{
              width: barWidth,
              height: `${(item.value / maxValue) * (height - 40)}px`,
              bgcolor: item.color,
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.3s',
              minHeight: 4,
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.65rem' }}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const DonutChart: React.FC<{ value: number; max: number; label: string; color: string; size?: number }> = ({ value, max, label, color, size = 120 }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border-primary)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fontSize="20" fontWeight="bold" fill="var(--text-primary)">
          {Math.round(percentage)}%
        </text>
      </svg>
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>{label}</Typography>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  const monthlyData = [
    { label: 'Ene', value: 65, color: 'var(--green-primary-light)' },
    { label: 'Feb', value: 72, color: 'var(--green-primary-light)' },
    { label: 'Mar', value: 68, color: 'var(--green-primary-light)' },
    { label: 'Abr', value: 80, color: 'var(--green-primary)' },
    { label: 'May', value: 85, color: 'var(--green-primary)' },
    { label: 'Jun', value: 78, color: 'var(--green-primary-light)' },
  ];

  const cropDistribution = [
    { label: 'Maíz', value: 45, color: 'var(--green-primary)' },
    { label: 'Trigo', value: 25, color: 'var(--green-primary-light)' },
    { label: 'Soja', value: 20, color: 'var(--brown-primary)' },
    { label: 'Otros', value: 10, color: 'var(--accent-yellow)' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom className="u-font-weight-semibold u-text-green-primary">
        Panel de Control
      </Typography>

      {/* Top metric cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card className="u-bg-card u-shadow-sm" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Salud del Cultivo</Typography>
                  <TrendingUp sx={{ fontSize: 20, color: 'var(--green-primary)' }} />
                </Box>
                <Typography variant="h4" className="u-font-weight-bold u-text-green-primary">85%</Typography>
                <Box sx={{ height: 6, bgcolor: 'var(--green-primary-lightest)', borderRadius: 3 }}>
                  <Box sx={{ width: '85%', height: '100%', bgcolor: 'var(--green-primary)', borderRadius: 3 }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card className="u-bg-card u-shadow-sm" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Humedad Suelo</Typography>
                  <WaterDrop sx={{ fontSize: 20, color: 'var(--accent-blue)' }} />
                </Box>
                <Typography variant="h4" className="u-font-weight-bold u-text-accent-blue">62%</Typography>
                <Box sx={{ height: 6, bgcolor: 'var(--info-bg)', borderRadius: 3 }}>
                  <Box sx={{ width: '62%', height: '100%', bgcolor: 'var(--accent-blue)', borderRadius: 3 }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card className="u-bg-card u-shadow-sm" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Rendimiento</Typography>
                  <Calculate sx={{ fontSize: 20, color: 'var(--brown-primary)' }} />
                </Box>
                <Typography variant="h4" className="u-font-weight-bold u-text-brown-primary">4.2 t/ha</Typography>
                <Box sx={{ height: 6, bgcolor: 'var(--brown-primary-lightest)', borderRadius: 3 }}>
                  <Box sx={{ width: '70%', height: '100%', bgcolor: 'var(--brown-primary)', borderRadius: 3 }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card className="u-bg-card u-shadow-sm" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Alertas Activas</Typography>
                  <BugReport sx={{ fontSize: 20, color: 'var(--error)' }} />
                </Box>
                <Typography variant="h4" className="u-font-weight-bold u-text-error">3</Typography>
                <Box sx={{ height: 6, bgcolor: 'var(--error-bg)', borderRadius: 3 }}>
                  <Box sx={{ width: '30%', height: '100%', bgcolor: 'var(--error)', borderRadius: 3 }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card className="u-bg-card u-shadow-sm" sx={{ height: '100%' }}>
            <CardHeader
              title="Rendimiento Mensual (toneladas)"
              className="u-bg-green-primary-light"
              titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
            />
            <CardContent>
              <BarChart data={monthlyData} height={180} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card className="u-bg-card u-shadow-sm" sx={{ height: '100%' }}>
            <CardHeader
              title="Distribución de Cultivos"
              className="u-bg-green-primary-light"
              titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
            />
            <CardContent>
              <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                {cropDistribution.map((crop, i) => (
                  <DonutChart key={i} value={crop.value} max={100} label={crop.label} color={crop.color} size={100} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom section */}
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
                {[
                  { text: 'Análisis de muestra de suelo completado', time: 'Hoy, 10:30 AM', color: 'var(--text-primary)' },
                  { text: 'Programa de fertilización actualizado', time: 'Ayer, 3:45 PM', color: 'var(--text-primary)' },
                  { text: 'Alerta de plaga detectada en lote 3', time: 'Hoy, 8:15 AM', color: 'var(--error)' },
                  { text: 'Recomendación de rotación de cultivos', time: 'Ayer, 6:20 PM', color: 'var(--text-primary)' },
                  { text: 'Riego automático activado en lote 1', time: 'Hoy, 6:00 AM', color: 'var(--text-primary)' },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < 4 ? '1px solid var(--border-primary)' : 'none', pb: i < 4 ? 1.5 : 0 }}>
                    <Typography variant="body2" sx={{ color: item.color, fontWeight: item.color === 'var(--error)' ? 600 : 400 }}>
                      {item.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2, whiteSpace: 'nowrap' }}>
                      {item.time}
                    </Typography>
                  </Box>
                ))}
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
                <Button variant="contained" color="primary" size="small" fullWidth startIcon={<LocalFlorist />}>
                  Identificar Semillas
                </Button>
                <Button variant="contained" color="secondary" size="small" fullWidth startIcon={<Analytics />}>
                  Diagnóstico de Cultivo
                </Button>
                <Button variant="outlined" color="primary" size="small" fullWidth startIcon={<Calculate />}>
                  Calculadora de Cosecha
                </Button>
                <Button variant="outlined" color="secondary" size="small" fullWidth startIcon={<Chat />}>
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
