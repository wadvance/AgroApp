import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import {
  CalendarMonth,
  ChevronLeft,
  ChevronRight,
  Agriculture,
  WaterDrop,
  LocalFlorist,
  BugReport,
} from '@mui/icons-material';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const events: Record<number, { label: string; type: 'riego' | 'siembra' | 'cosecha' | 'fertilizacion' | 'plaga' }[]> = {
    5: [{ label: 'Riego programado', type: 'riego' }],
    8: [{ label: 'Aplicación de fertilizante', type: 'fertilizacion' }],
    12: [{ label: 'Siembra de maíz', type: 'siembra' }],
    15: [{ label: 'Monitoreo de plagas', type: 'plaga' }],
    18: [{ label: 'Riego programado', type: 'riego' }],
    22: [{ label: 'Cosecha de trigo', type: 'cosecha' }],
    25: [{ label: 'Fertilización nitrogenada', type: 'fertilizacion' }],
    28: [{ label: 'Riego programado', type: 'riego' }],
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const typeColors: Record<string, 'info' | 'success' | 'warning' | 'error' | 'default' | 'primary'> = {
    riego: 'info',
    siembra: 'success',
    cosecha: 'warning',
    fertilizacion: 'primary',
    plaga: 'error',
  };

  const typeIcons: Record<string, React.ReactNode> = {
    riego: <WaterDrop fontSize="inherit" />,
    siembra: <LocalFlorist fontSize="inherit" />,
    cosecha: <Agriculture fontSize="inherit" />,
    fertilizacion: <CalendarMonth fontSize="inherit" />,
    plaga: <BugReport fontSize="inherit" />,
  };

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  const today = new Date();

  return (
    <Box component="main" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom className="u-font-weight-semibold u-text-green-primary">
        Calendario de Cultivos
      </Typography>

      <Card className="u-bg-card u-shadow-sm">
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={prevMonth} size="small"><ChevronLeft /></IconButton>
              <Typography variant="h5" sx={{ fontWeight: 600, minWidth: 200, textAlign: 'center' }}>
                {monthNames[month]} {year}
              </Typography>
              <IconButton onClick={nextMonth} size="small"><ChevronRight /></IconButton>
            </Box>
          }
          className="u-bg-green-primary-light"
        />
        <CardContent>
          <Grid container>
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <Grid key={day} size={{ xs: 12 / 7 }}>
                <Typography variant="caption" align="center" sx={{ display: 'block', fontWeight: 600, py: 1 }}>
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>
          <Grid container>
            {calendarDays.map((day, idx) => (
              <Grid key={idx} size={{ xs: 12 / 7 }} sx={{ minHeight: 80, border: '1px solid var(--border-primary)', p: 0.5 }}>
                {day && (
                  <>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: day === today.getDate() && month === today.getMonth() && year === today.getFullYear() ? 700 : 400,
                        color: day === today.getDate() && month === today.getMonth() && year === today.getFullYear() ? 'var(--green-primary)' : 'var(--text-primary)',
                        bgcolor: day === today.getDate() && month === today.getMonth() && year === today.getFullYear() ? 'var(--green-primary-lightest)' : 'transparent',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {day}
                    </Typography>
                    <Stack spacing={0.3} sx={{ mt: 0.5 }}>
                      {events[day]?.slice(0, 2).map((event, i) => (
                        <Chip
                          key={i}
                          label={event.label}
                          size="small"
                          color={typeColors[event.type]}
                          icon={typeIcons[event.type] as any}
                          sx={{ height: 20, fontSize: '0.6rem', '& .MuiChip-icon': { fontSize: '0.7rem' } }}
                        />
                      ))}
                      {events[day]?.length > 2 && (
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                          +{events[day].length - 2} más
                        </Typography>
                      )}
                    </Stack>
                  </>
                )}
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom className="u-font-weight-semibold u-text-brown-primary">
          Leyenda
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Chip icon={<WaterDrop />} label="Riego" color="info" size="small" />
          <Chip icon={<LocalFlorist />} label="Siembra" color="success" size="small" />
          <Chip icon={<Agriculture />} label="Cosecha" color="warning" size="small" />
          <Chip icon={<CalendarMonth />} label="Fertilización" color="primary" size="small" />
          <Chip icon={<BugReport />} label="Plaga" color="error" size="small" />
        </Stack>
      </Box>
    </Box>
  );
};

export default CalendarPage;
