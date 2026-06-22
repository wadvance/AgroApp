import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Grid,
} from '@mui/material';
import { Cloud, WeatherSunny, WeatherCloudy, WeatherRainy, Windy, HumidityDrop, Thermostat, Update } from '@mui/icons-material';

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = React.useState<any>(null);
  const [forecast, setForecast] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [lastUpdate, setLastUpdate] = React.useState<string>('');

  const fetchWeatherData = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock current weather data
      const mockCurrent = {
        temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        precipitation: Math.floor(Math.random() * 10), // 0-9 mm
        pressure: Math.floor(Math.random() * 20) + 1010, // 1010-1030 hPa
        condition: ['soleado', 'parcialmente nublado', 'nublado', 'lluvioso', 'tormentoso'][Math.floor(Math.random() * 5)],
        uvIndex: Math.floor(Math.random() * 10) + 1, // 1-10
        visibility: Math.floor(Math.random() * 10) + 5, // 5-15 km
      };
      
      // Mock 5-day forecast
      const mockForecast = Array.from({ length: 5 }, (_, index) => {
        const day = new Date();
        day.setDate(day.getDate() + index);
        return {
          date: day.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' }),
          tempMin: Math.floor(Math.random() * 10) + 12, // 12-22°C
          tempMax: Math.floor(Math.random() * 15) + 18, // 18-33°C
          condition: ['soleado', 'parcialmente nublado', 'nublado', 'lluvioso', 'tormentoso'][Math.floor(Math.random() * 5)],
          precipitationChance: Math.floor(Math.random() * 100), // 0-100%
          humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
          windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        };
      });
      
      setWeatherData(mockCurrent);
      setForecast(mockForecast);
      setLastUpdate(new Date().toLocaleTimeString('es-ES'));
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWeatherData();
    
    // Set up interval to refresh data every 30 minutes
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefreshClick = () => {
    fetchWeatherData();
  };

  if (!weatherData) {
    return (
      <Box component="main" sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <Typography variant="h5" color="text.secondary">
          Cargando datos meteorológicos...
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" className="u-font-weight-semibold u-text-green-primary">
          Monitor Climático del Campo
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            startIcon={<Update fontSize="inherit" />}
            onClick={handleRefreshClick}
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </Button>
          <Typography variant="body2" color="text.secondary">
            Última actualización: {lastUpdate}
          </Typography>
        </Box>
      </Box>
      
      {/* Current Conditions */}
      <Box sx={{ mb: 4 }}>
        <Card className="u-bg-card u-shadow-sm u-transition-normal">
          <CardHeader
            title="Condiciones Actuales"
            className="u-bg-green-primary-light u-text-green-primary-dark"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Cloud fontSize="large" color="primary" />
            </Box>
          </CardHeader>
          <CardContent>
            <Grid container spacing={3}>
              {/* Temperature */}
              <Box xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Temperatura
                </Typography>
                <Typography variant="h1" className="u-font-weight-bold">
                  {weatherData.temperature}°C
                </Typography>
                <Box mt={1}>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(100, Math.max(0, (weatherData.temperature - 10) * 4))} 
                    sx={{ height: 8, borderRadius: 4 }}
                    color={weatherData.temperature > 25 ? 'error' : weatherData.temperature < 5 ? 'error' : 'success'}
                  />
                </Box>
              </Box>
              
              {/* Humidity */}
              <Box xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Humedad Relativa
                </Typography>
                <Typography variant="h1" className="u-font-weight-bold">
                  {weatherData.humidity}%
                </Typography>
                <Box mt={1}>
                  <LinearProgress 
                    variant="determinate" 
                    value={weatherData.humidity} 
                    sx={{ height: 8, borderRadius: 4 }}
                    color={weatherData.humidity > 80 ? 'warning' : weatherData.humidity < 30 ? 'warning' : 'success'}
                  />
                </Box>
              </Box>
              
              {/* Wind */}
              <Box xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Viento
                </Typography>
                <Typography variant="h1" className="u-font-weight-bold">
                  {weatherData.windSpeed} km/h
                </Typography>
                <Box mt={1} display="flex" alignItems="center">
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    {weatherData.windDirection}
                  </Typography>
                  <Box sx={{ width: 20, height: 20, borderColor: 'var(--green-primary)', borderStyle: 'solid' }}>
                    <div 
                      sx={{ 
                        width: '60%', 
                        height: '60%', 
                        bgColor: 'var(--green-primary)', 
                        margin: '20% auto', 
                        transform: 'rotate(45deg)' 
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              
              {/* Precipitation */}
              <Box xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Precipitación (última hora)
                </Typography>
                <Typography variant="h1" className="u-font-weight-bold">
                  {weatherData.precipitation} mm
                </Typography>
                <Box mt={1}>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(100, weatherData.precipitation * 10)} 
                    sx={{ height: 8, borderRadius: 4 }}
                    color={weatherData.precipitation > 5 ? 'warning' : 'success'}
                  />
                </Box>
              </Box>
              
              {/* Pressure */}
              <Box xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Presión Atmosférica
                </Typography>
                <Typography variant="h1" className="u-font-weight-bold">
                  {weatherData.pressure} hPa
                </Typography>
                <Box mt={1}>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(100, Math.max(0, (weatherData.pressure - 1000) * 3))} 
                    sx={{ height: 8, borderRadius: 4 }}
                    color={weatherData.pressure > 1025 ? 'warning' : weatherData.pressure < 1005 ? 'warning' : 'success'}
                  />
                </Box>
              </Box>
              
              {/* UV Index */}
              <Box xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Índice UV
                </Typography>
                <Typography variant="h1" className="u-font-weight-bold">
                  {weatherData.uvIndex}
                </Typography>
                <Box mt={1}>
                  <LinearProgress 
                    variant="determinate" 
                    value={weatherData.uvIndex * 10} 
                    sx={{ height: 8, borderRadius: 4 }}
                    color={weatherData.uvIndex > 8 ? 'error' : weatherData.uvIndex > 5 ? 'warning' : 'success'}
                  />
                </Box>
              </Box>
              
              {/* Visibility */}
              <Box xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Visibilidad
                </Typography>
                <Typography variant="h1" className="u-font-weight-bold">
                  {weatherData.visibility} km
                </Typography>
                <Box mt={1}>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(100, weatherData.visibility * 6.67)} 
                    sx={{ height: 8, borderRadius: 4 }}
                    color={weatherData.visibility < 5 ? 'error' : weatherData.visibility < 10 ? 'warning' : 'success'}
                  />
                </Box>
              </Box>
              
              {/* Condition */}
              <Box xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Condición
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {weatherData.condition === 'soleado' && (
                    <>
                      <WeatherSunny fontSize="large" color="warning" />
                      <Typography variant="body1" className="u-text-yellow-dark">
                        Soleado
                      </Typography>
                    </>
                  )}
                  {weatherData.condition === 'parcialmente nublado' && (
                    <>
                      <WeatherCloudy fontSize="large" color="warning" />
                      <Typography variant="body1" className="u-text-yellow-dark">
                        Parcialmente nublado
                      </Typography>
                    </>
                  )}
                  {weatherData.condition === 'nublado' && (
                    <>
                      <WeatherCloudy fontSize="large" color="grey" />
                      <Typography variant="body1" className="u-text-grey">
                        Nublado
                      </Typography>
                    </>
                  )}
                  {weatherData.condition === 'lluvioso' && (
                    <>
                      <WeatherRainy fontSize="large" color="info" />
                      <Typography variant="body1" className="u-text-info-dark">
                        Lluvioso
                      </Typography>
                    </>
                  )}
                  {weatherData.condition === 'tormentoso' && (
                    <>
                      <WeatherRainy fontSize="large" color="error" />
                      <Typography variant="body1" className="u-text-error-dark">
                        Tormentoso
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      
      {/* 5-Day Forecast */}
      <Box sx={{ mb: 4 }}>
        <Card className="u-bg-card u-shadow-sm u-transition-normal">
          <CardHeader
            title="Pronóstico de 5 Días"
            className="u-bg-green-primary-light u-text-green-primary-dark"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Update fontSize="large" color="primary" />
            </Box>
          </CardHeader>
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
                      <TableCell align="center">
                        {day.tempMin}°/{day.tempMax}°C
                      </TableCell>
                      <TableCell align="center" sx={{ textAlign: 'center' }}>
                        {day.condition === 'soleado' && (
                          <WeatherSunny fontSize="small" color="warning" />
                        )}
                        {day.condition === 'parcialmente nublado' && (
                          <WeatherCloudy fontSize="small" color="warning" />
                        )}
                        {day.condition === 'nublado' && (
                          <WeatherCloudy fontSize="small" color="grey" />
                        )}
                        {day.condition === 'lluvioso' && (
                          <WeatherRainy fontSize="small" color="info" />
                        )}
                        {day.condition === 'tormentoso' && (
                          <WeatherRainy fontSize="small" color="error" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {day.precipitationChance}%
                      </TableCell>
                      <TableCell align="center">
                        {day.humidity}%
                      </TableCell>
                      <TableCell align="center">
                        {day.windSpeed} km/h
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      {/* Agricultural Alerts */}
      <Box>
        <Card className="u-bg-card u-shadow-sm u-transition-normal">
          <CardHeader
            title="Alertas Agronómicas"
            className="u-bg-green-primary-light u-text-green-primary-dark"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningAmber fontSize="large" color="warning" />
            </Box>
          </CardHeader>
          <CardContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Update fontSize="medium" color="info" />
                <Typography sx={{ ml: 2 }}>Próxima ventana óptima para aplicación de fitosanitarios: mañana 6:00-10:00 AM (bajo viento, alta humedad relativa)</Typography>
              </Box>
            </Alert>
            <Alert severity="success" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle fontSize="medium" color="success" />
                <Typography sx={{ ml: 2 }}>Condiciones ideales para riego detectadas: evapotranspiración alta, baja probabilidad de lluvia inmediata</Typography>
              </Box>
            </Alert>
            <Alert severity="warning">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningAmber fontSize="medium" color="warning" />
                <Typography sx={{ ml: 2 }}>Alerta de helada posible: temperaturas mínimas esperadas < 3°C para las próximas 2 noches en zonas bajas</Typography>
              </Box>
            </Alert>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Weather;