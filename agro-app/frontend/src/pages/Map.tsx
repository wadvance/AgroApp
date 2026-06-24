import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Tooltip,
} from '@mui/material';
import { Search, MyLocation, LocationOn, Place, Map as MapIcon } from '@mui/icons-material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import Chiriquí geographic data
import { findLocationByCoordinates } from '../data/chiriquiData';

// Fix Leaflet default marker icon issue
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

interface SearchResult {
  displayName: string;
  lat: number;
  lon: number;
  resultType: string;
}

interface LocationInfo {
  distrito: string;
  corregimiento: string;
  coordinates: { lat: number; lng: number };
}

const MapPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);

  // Fix default icon
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl,
      iconRetinaUrl,
      shadowUrl,
    });
  }, []);

  // Initialize map
  useEffect(() => {
    const mapInstance = L.map('map-container').setView([8.0, -80.0], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstance);
    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Get user location and identify their zone
  useEffect(() => {
    if ('geolocation' in navigator) {
      const getLocationAndIdentifyZone = async () => {
        setIsLoadingLocation(true);
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);

          if (map) {
            map.setView([loc.lat, loc.lng], 13);
            
            // Update or create user location marker
            if (marker) marker.remove();
            const newMarker = L.marker([loc.lat, loc.lng]).addTo(map);
            newMarker.bindPopup('Tu ubicación actual').openPopup();
            setMarker(newMarker);

            // Identify which district/corregimiento the user is in
            const locationData = findLocationByCoordinates(loc.lat, loc.lng, 0.1); // ~11km tolerance
            if (locationData.distrito || locationData.corregimiento) {
              const info: LocationInfo = {
                distrito: locationData.distrito ? locationData.distrito.name : 'Desconocido',
                corregimiento: locationData.corregimiento ? locationData.corregimiento.name : 'Desconocido',
                coordinates: loc
              };
              setLocationInfo(info);
              
              // Add a circle to show approximate area
              const circle = L.circle([loc.lat, loc.lng], {
                color: 'blue',
                fillColor: '#3388ff',
                fillOpacity: 0.1,
                radius: 1000 // 1km radius
              }).addTo(map);
              
              // Remove circle after 5 seconds
              setTimeout(() => {
                map.removeLayer(circle);
              }, 5000);
            }
          }
        } catch (error) {
          console.error('Error getting location:', error);
          // Default to David, Chiriquí if geolocation fails
if (map) {
             const davidLoc = { lat: 8.4328, lng: -82.4269 };
             map.setView([davidLoc.lat, davidLoc.lng], 10);
             
             // Show David as default location
             const info: LocationInfo = {
               distrito: 'David',
               corregimiento: 'David',
               coordinates: davidLoc
             };
             setLocationInfo(info);
          }
        } finally {
          setIsLoadingLocation(false);
        }
      };

      getLocationAndIdentifyZone();
    }
  }, [map, marker]);

  const searchLocation = async () => {
    if (!searchQuery.trim() || !map) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=pa`,
        { headers: { 'Accept-Language': 'es' } }
      );
      const data: any[] = await response.json();
      
const results: SearchResult[] = data.map((item: any) => ({
  displayName: item.display_name,
  lat: parseFloat(item.lat),
  lon: parseFloat(item.lon),
  resultType: item.type,
}));

      setSearchResults(results);

      if (results.length > 0) {
        const first = results[0];
        map.setView([first.lat, first.lon], 13);
        if (marker) marker.remove();
        const newMarker = L.marker([first.lat, first.lon]).addTo(map);
        newMarker.bindPopup(`<b>${first.displayName.split(',')[0]}</b>`).openPopup();
        setMarker(newMarker);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const goToLocation = (result: SearchResult) => {
    if (!map) return;
    map.setView([result.lat, result.lon], 15);
    if (marker) marker.remove();
    const newMarker = L.marker([result.lat, result.lon]).addTo(map);
    newMarker.bindPopup(`<b>${result.displayName.split(',')[0]}</b>`).openPopup();
    setMarker(newMarker);
    setSearchResults([]);
    setSearchQuery(result.displayName.split(',')[0]);
  };

  const goToMyLocation = () => {
    if (!map) return;
    setIsLoadingLocation(true);
    
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 15);
      if (marker) marker.remove();
      const newMarker = L.marker([userLocation.lat, userLocation.lng]).addTo(map);
      newMarker.bindPopup('Tu ubicación').openPopup();
      setMarker(newMarker);
    } else {
      // Try to get current location
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
            setUserLocation(loc);
            map.setView([loc.lat, loc.lng], 15);
            if (marker) marker.remove();
            const newMarker = L.marker([loc.lat, loc.lng]).addTo(map);
            newMarker.bindPopup('Tu ubicación').openPopup();
            setMarker(newMarker);
            
            // Identify zone
            const locationData = findLocationByCoordinates(loc.lat, loc.lng, 0.1);
            if (locationData.distrito || locationData.corregimiento) {
              const info: LocationInfo = {
                distrito: locationData.distrito ? locationData.distrito.name : 'Desconocido',
                corregimiento: locationData.corregimiento ? locationData.corregimiento.name : 'Desconocido',
                coordinates: loc
              };
              setLocationInfo(info);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
            // Fallback to David
            const davidLoc = { lat: 8.4328, lng: -82.4269 };
            map.setView([davidLoc.lat, davidLoc.lng], 10);
            setUserLocation(davidLoc);
            if (marker) marker.remove();
            const newMarker = L.marker([davidLoc.lat, davidLoc.lng]).addTo(map);
            newMarker.bindPopup('David, Chiriquí (predeterminado)').openPopup();
            setMarker(newMarker);
            
            const info: LocationInfo = {
              distrito: 'David',
              corregimiento: 'David',
              coordinates: davidLoc
            };
            setLocationInfo(info);
          }
        );
      }
    }
    setIsLoadingLocation(false);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom className="u-font-weight-semibold u-text-green-primary">
        Mapas de Chiriquí - Ubicación y Navegación
      </Typography>

      {/* Location Info Card */}
      {locationInfo && (
        <Card className="u-bg-card u-shadow-sm" sx={{ mb: 2 }}>
          <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h6" color="text.primary" component="div">
              Tu ubicación actual
            </Typography>
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
              <Tooltip title="Distrito">
                <Chip 
                  label={locationInfo.distrito} 
                  icon={<Place fontSize="inherit" />} 
                  color="primary" 
                  sx={{ minWidth: 120 }}
                />
              </Tooltip>
              <Tooltip title="Corregimiento">
                <Chip 
                  label={locationInfo.corregimiento} 
                  icon={<LocationOn fontSize="inherit" />} 
                  color="success" 
                  sx={{ minWidth: 120 }}
                />
              </Tooltip>
              <Tooltip title="Coordenadas GPS">
                <Chip 
                  label={`${locationInfo.coordinates.lat.toFixed(4)}, ${locationInfo.coordinates.lng.toFixed(4)}`} 
                  icon={<MapIcon fontSize="inherit" />} 
                  color="info" 
                  sx={{ minWidth: 180 }}
                />
              </Tooltip>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Search Card */}
      {!isLoadingLocation && (
        <Card className="u-bg-card u-shadow-sm" sx={{ mb: 2 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" spacing={1}>
              <TextField
                label="Buscar distrito, corregimiento o lugar en Chiriquí"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') searchLocation(); }}
                size="small"
                sx={{ flex: 1 }}
                placeholder="Ej: Boquete, Volcán, David..."
              />
              <Button variant="contained" color="primary" onClick={searchLocation} startIcon={<Search />}>
                Buscar
              </Button>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={goToMyLocation} 
                startIcon={<MyLocation />}
                disabled={isLoadingLocation}
              >
                {isLoadingLocation ? 'Ubicando...' : 'Mi Ubicación'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
{searchResults.length > 0 && !isLoadingLocation && (
         <Card className="u-bg-card u-shadow-sm" sx={{ mb: 2, maxHeight: 200, overflow: 'auto' }}>
           <List dense>
             {searchResults.map((result, i) => (
               <ListItemButton key={i} onClick={() => goToLocation(result)}>
                 <ListItemIcon><LocationOn fontSize="small" color="primary" /></ListItemIcon>
                 <ListItemText
                   primary={result.displayName.split(',')[0]}
                   secondary={result.displayName.split(',').slice(1, 3).join(', ')}
                 />
               </ListItemButton>
             ))}
           </List>
         </Card>
       )}

      {/* Map Container */}
      <Box sx={{ flex: 1, position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <Box id="map-container" sx={{ width: '100%', height: '100%' }} />
        {/* Attribution control is handled by Leaflet */}
      </Box>
    </Box>
  );
};

export default MapPage;