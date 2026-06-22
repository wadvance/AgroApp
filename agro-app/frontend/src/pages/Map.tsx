import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Button,
  Tooltip,
} from '@mui/material';
import { Search, MyLocation, DirectionsCar } from '@mui/icons-material';

const Map: React.FC = () => {
  const [location, setLocation] = React.useState('');
  const [mapUrl, setMapUrl] = React.useState('');
  const [directionsUrl, setDirectionsUrl] = React.useState('');

  const generateMapUrl = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`;
  };

  const generateDirectionsUrl = (origin: string, destination: string) => {
    const encodedOrigin = encodeURIComponent(origin);
    const encodedDestination = encodeURIComponent(destination);
    return `https://www.google.com/maps/embed/v1/directions?key=YOUR_API_KEY&origin=${encodedOrigin}&destination=${encodedDestination}`;
  };

  const handleSearch = () => {
    if (location.trim()) {
      setMapUrl(generateMapUrl(location));
      // Also generate directions from current location to this place
      setDirectionsUrl(generateDirectionsUrl('Tu ubicación actual', location));
    }
  };

  const handleCurrentLocation = () => {
    // In a real app, we would use the Geolocation API
    setLocation('Tu ubicación actual');
    setMapUrl('https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=current+location');
  };

  return (
    <Box component="main" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom className="u-font-weight-semibold u-text-green-primary">
        Mapas y Navegación al Campo
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Card className="u-bg-card u-shadow-sm u-transition-normal">
          <CardHeader
            title="Buscar Ubicación"
            className="u-bg-green-primary-light u-text-green-primary-dark"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Search fontSize="large" color="primary" />
            </Box>
          </CardHeader>
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label="Ingrese la dirección o nombre del campo"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ flex: 1 }}
              />
              <Stack direction="row" spacing={1}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="medium"
                  startIcon={<Search fontSize="inherit" />}
                  onClick={handleSearch}
                >
                  Buscar
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  size="medium"
                  startIcon={<MyLocation fontSize="inherit" />}
                  onClick={handleCurrentLocation}
                >
                  Mi Ubicación
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
      
      {mapUrl && (
        <Box sx={{ mb: 4 }}>
          <Card className="u-bg-card u-shadow-sm u-transition-normal">
            <CardHeader
              title="Mapa de Ubicación"
              className="u-bg-green-primary-light u-text-green-primary-dark"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MyLocation fontSize="large" color="primary" />
              </Box>
            </CardHeader>
            <CardContent>
              <Box sx={{ position: 'relative', height: 400 }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  loading="lazy"
                  allowfullscreen
                  src={mapUrl}
                ></iframe>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
      
      {directionsUrl && (
        <Box sx={{ mb: 4 }}>
          <Card className="u-bg-card u-shadow-sm u-transition-normal">
            <CardHeader
              title="Indicaciones para Llegar"
              className="u-bg-green-primary-light u-text-green-primary-dark"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DirectionsCar fontSize="large" color="primary" />
              </Box>
            </CardHeader>
            <CardContent>
              <Box sx={{ position: 'relative', height: 400 }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  loading="lazy"
                  allowfullscreen
                  src={directionsUrl}
                ></iframe>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
      
      {!mapUrl && !directionsUrl && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary">
            Busca una ubicación para ver el mapa y obtener indicaciones
          </Typography>
          <Box mt={3}>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
              Esta característica te permite buscar la ubicación de tu campo agrícola 
              y obtener indicaciones para llegar allí desde tu posición actual.
              Puedes buscar por dirección, nombre del lugar o coordenadas.
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Map;