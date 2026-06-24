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
} from '@mui/material';
import { Search, MyLocation, LocationOn } from '@mui/icons-material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

interface SearchResult {
  displayName: string;
  lat: number;
  lon: number;
  type: string;
}

const MapPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

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

  // Get user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          if (map) {
            map.setView([loc.lat, loc.lng], 13);
            L.marker([loc.lat, loc.lng]).addTo(map).bindPopup('Tu ubicación');
          }
        },
        () => {
          // Default to Panama if geolocation fails
          if (map) map.setView([8.982, -79.519], 12);
        }
      );
    }
  }, [map]);

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
        type: item.type,
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
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 15);
      if (marker) marker.remove();
      const newMarker = L.marker([userLocation.lat, userLocation.lng]).addTo(map);
      newMarker.bindPopup('Tu ubicación').openPopup();
      setMarker(newMarker);
    } else {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        map.setView([loc.lat, loc.lng], 15);
      });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom className="u-font-weight-semibold u-text-green-primary">
        Mapas y Navegación al Campo
      </Typography>

      <Card className="u-bg-card u-shadow-sm" sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Stack direction="row" spacing={1}>
            <TextField
              label="Buscar provincia, distrito o corregimiento"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') searchLocation(); }}
              size="small"
              sx={{ flex: 1 }}
            />
            <Button variant="contained" color="primary" onClick={searchLocation} startIcon={<Search />}>
              Buscar
            </Button>
            <Button variant="outlined" color="secondary" onClick={goToMyLocation} startIcon={<MyLocation />}>
              Mi Ubicación
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
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

      <Box sx={{ flex: 1, position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <Box id="map-container" sx={{ width: '100%', height: '100%' }} />
      </Box>
    </Box>
  );
};

export default MapPage;
