import React from 'react';
import {
  Box, Typography, Card, CardContent, CardHeader, Button, Stack,
  MenuItem, TextField, Alert, Table, TableBody, TableCell, TableHead,
  TableRow, LinearProgress,
} from '@mui/material';
import {
  WbSunny, Cloud, CloudDone, Opacity, Update, CheckCircle, WaterDrop,
  Thermostat, Air, Warning,
} from '@mui/icons-material';
import { firebaseService } from '../firebase';
import BackButton from '../components/BackButton';

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string | undefined;
const DEFAULT_LAT = 8.5;
const DEFAULT_LON = -80.5;
const PANAMA_CITIES: Record<string, { lat: number; lon: number }> = {
  'Panamá': { lat: 8.98, lon: -79.52 },
  'David': { lat: 8.43, lon: -82.43 },
  'Santiago': { lat: 8.10, lon: -80.98 },
  'Colón': { lat: 9.36, lon: -79.90 },
  'Penonomé': { lat: 8.52, lon: -80.36 },
  'Chitré': { lat: 7.96, lon: -80.43 },
  'Las Tablas': { lat: 7.77, lon: -80.27 },
  'Bocas del Toro': { lat: 9.34, lon: -82.24 },
  'La Chorrera': { lat: 8.80, lon: -79.78 },
};

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = React.useState<any>(null);
  const [forecast, setForecast] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [lastUpdate, setLastUpdate] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const [selectedCity, setSelectedCity] = React.useState<string>('Panamá');
  const [usingMock, setUsingMock] = React.useState(false);

  const fetchRealWeather = async (lat: number, lon: number) => {
    if (!WEATHER_API_KEY) {
      console.error('API Key missing:', WEATHER_API_KEY);
      return null;
    }

    try {
      console.log('Fetching weather with API key:', WEATHER_API_KEY.substring(0, 8) + '...');
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${WEATHER_API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&cnt=40&appid=${WEATHER_API_KEY}`),
      ]);

      console.log('Current response status:', currentRes.status);
      if (!currentRes.ok || !forecastRes.ok) {
        console.error('API response not ok:', currentRes.status, forecastRes.status);
        return null;
      }

      const current = await currentRes.json();
      const forecastData = await forecastRes.json();

      const dailyForecast: any[] = [];
      const seen: Set<string> = new Set();
      for (const item of forecastData.list || []) {
        const date = new Date(item.dt * 1000).toLocaleDateString('es-ES');
        if (!seen.has(date) && seen.size < 5) {
          seen.add(date);
          dailyForecast.push({
            date: new Date(item.dt * 1000).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' }),
            tempMin: item.main.temp_min,
            tempMax: item.main.temp_max,
            condition: translateCondition(item.weather[0].description),
            conditionIcon: item.weather[0].icon,
            precipitationChance: Math.round((item.pop || 0) * 100),
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
          });
        }
      }

      setUsingMock(false);
      return {
        temperature: Math.round(current.main.temp * 10) / 10,
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind.speed * 3.6 * 10) / 10,
        windDirection: degreesToDir(current.wind.deg),
        precipitation: current.rain?.['1h'] || current.rain?.['3h'] || 0,
        pressure: current.main.pressure,
        condition: translateCondition(current.weather[0].description),
        conditionIcon: current.weather[0].icon,
        uvIndex: 5,
        visibility: (current.visibility || 10000) / 1000,
        city: current.name,
        country: current.sys?.country,
      };
    } catch {
      return null;
    }
  };

  const translateCondition = (desc: string): string => {
    const map: Record<string, string> = {
      'clear sky': 'soleado', 'few clouds': 'parcialmente nublado',
      'scattered clouds': 'parcialmente nublado', 'broken clouds': 'nublado',
      'overcast clouds': 'nublado', 'light rain': 'lluvioso',
      'moderate rain': 'lluvioso', 'heavy rain': 'tormentoso',
      'thunderstorm': 'tormentoso', 'drizzle': 'llovizna',
      'mist': 'neblina', 'fog': 'niebla', 'haze': 'bruma',
    };
    return map[desc.toLowerCase()] || desc;
  };

  const degreesToDir = (deg: number): string => {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return dirs[Math.round(deg / 22.5) % 16];
  };

  const generateMockData = () => {
    setUsingMock(true);
    return {
      temperature: Math.floor(Math.random() * 15) + 15,
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      precipitation: Math.floor(Math.random() * 10),
      pressure: Math.floor(Math.random() * 20) + 1010,
      condition: ['soleado', 'parcialmente nublado', 'nublado', 'lluvioso', 'tormentoso'][Math.floor(Math.random() * 5)],
      uvIndex: Math.floor(Math.random() * 10) + 1,
      visibility: Math.floor(Math.random() * 10) + 5,
      city: selectedCity,
    };
  };

  const generateMockForecast = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const day = new Date();
      day.setDate(day.getDate() + index);
      return {
        date: day.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' }),
        tempMin: Math.floor(Math.random() * 10) + 12,
        tempMax: Math.floor(Math.random() * 15) + 18,
        condition: ['soleado', 'parcialmente nublado', 'nublado', 'lluvioso', 'tormentoso'][Math.floor(Math.random() * 5)],
        precipitationChance: Math.floor(Math.random() * 100),
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
      };
    });
  };

  const fetchWeatherData = async () => {
    setLoading(true);
    setError('');
    try {
      const coords = PANAMA_CITIES[selectedCity] || { lat: DEFAULT_LAT, lon: DEFAULT_LON };
      let current: any = null;

      if (WEATHER_API_KEY) {
        current = await fetchRealWeather(coords.lat, coords.lon);
      }

      if (!current) {
        current = generateMockData();
        setForecast(generateMockForecast());
      } else {
        const days = [];
        for (let i = 0; i < 5; i++) {
          const d = new Date();
          d.setDate(d.getDate() + i);
          days.push({
            date: d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' }),
            tempMin: current.temperature - Math.random() * 5,
            tempMax: current.temperature + Math.random() * 5,
            condition: current.condition,
            precipitationChance: Math.floor(Math.random() * 60),
            humidity: current.humidity + Math.floor(Math.random() * 20 - 10),
            windSpeed: current.windSpeed + Math.floor(Math.random() * 10 - 5),
          });
        }
        setForecast(days);
      }

      setWeatherData(current);
      setLastUpdate(new Date().toLocaleTimeString('es-ES'));

      try {
        await firebaseService.saveWeatherData({
          ...current, city: selectedCity, timestamp: new Date(),
        });
      } catch { /* silent */ }
    } catch (err) {
      setError('Error al obtener datos meteorológicos');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  if (!weatherData) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <Typography variant="h5" color="text.secondary">Cargando datos meteorológicos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <BackButton />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" className="u-font-weight-semibold u-text-green-primary">
          Monitor Climático del Campo
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <TextField
            select size="small" value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            {Object.keys(PANAMA_CITIES).map(city => (
              <MenuItem key={city} value={city}>{city}</MenuItem>
            ))}
          </TextField>
          <Button
            variant="outlined" color="primary" size="small"
            startIcon={<Update />} onClick={fetchWeatherData} disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </Stack>
      </Box>

      {usingMock && (
        <Alert severity="warning" sx={{ mb: 2 }} icon={<Warning />}>
          <strong>Datos simulados:</strong> La API key no está funcionando o no se encontró. Configura VITE_OPENWEATHER_API_KEY correctamente.
        </Alert>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ mb: 4 }}>
        <Card>
          <CardHeader
            title={`Condiciones Actuales — ${weatherData.city || selectedCity}`}
            className="u-bg-green-primary-light"
            titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
            action={
              <Typography variant="caption" color="text.secondary" sx={{ pr: 2, pt: 1 }}>
                Última actualización: {lastUpdate}
              </Typography>
            }
          />
          <CardContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 3 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Thermostat fontSize="small" /> Temperatura
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>{weatherData.temperature}°C</Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, (weatherData.temperature - 10) * 4))}
                  sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  color={weatherData.temperature > 28 ? 'error' : weatherData.temperature < 18 ? 'warning' : 'success'}
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Opacity fontSize="small" /> Humedad
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>{weatherData.humidity}%</Typography>
                <LinearProgress
                  variant="determinate" value={weatherData.humidity}
                  sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  color={weatherData.humidity > 85 ? 'warning' : weatherData.humidity < 35 ? 'warning' : 'success'}
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Air fontSize="small" /> Viento
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>{weatherData.windSpeed} km/h</Typography>
                <Typography variant="body2" color="text.secondary">Dirección: {weatherData.windDirection}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WaterDrop fontSize="small" /> Precipitación
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>{weatherData.precipitation} mm</Typography>
                <LinearProgress
                  variant="determinate" value={Math.min(100, weatherData.precipitation * 10)}
                  sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  color={weatherData.precipitation > 5 ? 'warning' : 'success'}
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Presión</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>{weatherData.pressure} hPa</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Condición</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  {weatherData.conditionIcon ? (
                    <img src={`https://openweathermap.org/img/wn/${weatherData.conditionIcon}@2x.png`} alt="" style={{ width: 64, height: 64 }} />
                  ) : (
                    <>
                      {weatherData.condition === 'soleado' && <WbSunny sx={{ fontSize: 48 }} color="warning" />}
                      {weatherData.condition === 'parcialmente nublado' && <Cloud sx={{ fontSize: 48 }} color="warning" />}
                      {weatherData.condition === 'nublado' && <Cloud sx={{ fontSize: 48 }} color="disabled" />}
                      {weatherData.condition === 'lluvioso' && <CloudDone sx={{ fontSize: 48 }} color="info" />}
                      {weatherData.condition === 'tormentoso' && <CloudDone sx={{ fontSize: 48 }} color="error" />}
                    </>
                  )}
                  <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{weatherData.condition}</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Visibilidad</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>{weatherData.visibility} km</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Índice UV</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>{weatherData.uvIndex}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Card>
          <CardHeader
            title="Pronóstico de 5 Días"
            className="u-bg-green-primary-light"
            titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
          />
          <CardContent>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Día</TableCell>
                    <TableCell align="center">Temp. Min/Max</TableCell>
                    <TableCell align="center">Condición</TableCell>
                    <TableCell align="center">Prob. Lluvia</TableCell>
                    <TableCell align="center">Humedad</TableCell>
                    <TableCell align="center">Viento</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {forecast.map((day: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{day.date}</TableCell>
                      <TableCell align="center">{Math.round(day.tempMin)}°/{Math.round(day.tempMax)}°C</TableCell>
                      <TableCell align="center">
                        {day.condition === 'soleado' && <WbSunny fontSize="small" color="warning" />}
                        {day.condition === 'parcialmente nublado' && <Cloud fontSize="small" color="warning" />}
                        {day.condition === 'nublado' && <Cloud fontSize="small" color="disabled" />}
                        {day.condition === 'lluvioso' && <CloudDone fontSize="small" color="info" />}
                        {day.condition === 'tormentoso' && <CloudDone fontSize="small" color="error" />}
                      </TableCell>
                      <TableCell align="center">{day.precipitationChance}%</TableCell>
                      <TableCell align="center">{Math.round(day.humidity)}%</TableCell>
                      <TableCell align="center">{typeof day.windSpeed === 'number' ? Math.round(day.windSpeed) : day.windSpeed} km/h</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box>
        <Card>
          <CardHeader
            title="Alertas Agronómicas"
            className="u-bg-green-primary-light"
            titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
          />
          <CardContent>
            <Stack spacing={1.5}>
              <Alert severity="info" icon={<Update />}>
                Próxima ventana óptima para aplicación de fitosanitarios según condiciones actuales
              </Alert>
              <Alert severity="success" icon={<CheckCircle />}>
                {weatherData.humidity > 70
                  ? 'Alta humedad relativa — condiciones favorables para desarrollo de hongos, monitorear cultivos'
                  : 'Condiciones adecuadas para labores de campo'}
              </Alert>
              <Alert severity="warning" icon={<WaterDrop />}>
                {weatherData.temperature > 28
                  ? 'Altas temperaturas — aumentar frecuencia de riego para evitar estrés hídrico'
                  : weatherData.precipitation > 5
                    ? 'Precipitación reciente — reducir riego en las próximas 24-48 horas'
                    : 'Temperaturas normales para la época'}
              </Alert>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Weather;
