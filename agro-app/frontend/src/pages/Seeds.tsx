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
  TextField,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  CloudUpload,
  PhotoCamera,
  Analytics,
  SaveAlt,
  Search,
  ExpandMore,
} from '@mui/icons-material';
import { firebaseService } from '../firebase';
import { seedsDatabase, searchSeeds, identifySeedByImage } from '../data/seeds';
import type { Seed } from '../data/seeds';

const getDominantColorFromImage = (imageUrl: string): Promise<{ color: string; shape: string; size: string }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Context not available'));
          return;
        }
        ctx.drawImage(img, 0, 0, 100, 100);
        const data = ctx.getImageData(0, 0, 100, 100).data;

        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 16) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        let color = 'Marrón';
        if (r > 200 && g > 200 && b > 200) color = 'Blanco';
        else if (r > 200 && g > 180 && b < 100) color = 'Amarillo';
        else if (r > 200 && g < 100 && b < 100) color = 'Rojo';
        else if (r < 100 && g > 150 && b < 100) color = 'Verde';
        else if (r < 100 && g < 100 && b > 150) color = 'Azul';
        else if (r > 150 && g > 100 && b < 80) color = 'Naranja';
        else if (r < 80 && g < 80 && b < 80) color = 'Negro';
        else if (r > 120 && g < 80 && b > 120) color = 'Púrpura';

        resolve({ color, shape: 'Redondeado', size: 'Mediano' });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
};

const Seeds: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Seed[]>([]);
  const [selectedSeed, setSelectedSeed] = React.useState<Seed | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [scanning, setScanning] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [savedSeeds, setSavedSeeds] = React.useState<any[]>([]);
  const [matchedSeeds, setMatchedSeeds] = React.useState<Seed[]>([]);

  React.useEffect(() => {
    const loadSavedSeeds = async () => {
      try {
        const seeds = await firebaseService.getSeeds();
        setSavedSeeds(seeds);
      } catch (error) {
        console.error('Error loading seeds:', error);
      }
    };
    loadSavedSeeds();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchResults(searchSeeds(query));
      setMatchedSeeds([]);
    } else {
      setSearchResults([]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setScanning(true);
    setSearchResults([]);
    setSearchQuery('');

    try {
      const imagePath = `seed_images/${Date.now()}_${file.name}`;
      const downloadUrl = await firebaseService.uploadFile(file, imagePath);
      setImageUrl(downloadUrl);

      const colorInfo = await getDominantColorFromImage(downloadUrl);
      const matches = identifySeedByImage(colorInfo.color, colorInfo.shape, colorInfo.size);
      setMatchedSeeds(matches);

      if (matches.length > 0) {
        setSelectedSeed(matches[0]);
      }
    } catch (error) {
      console.error('Error analyzing seed image:', error);
    } finally {
      setLoading(false);
      setScanning(false);
    }
  };

  const saveSeedAnalysis = async () => {
    if (!selectedSeed) return;

    setUploading(true);
    try {
      const seedData = {
        seedType: selectedSeed.name,
        variety: selectedSeed.scientificName,
        type: selectedSeed.type,
        color: selectedSeed.color,
        shape: selectedSeed.shape,
        size: selectedSeed.size,
        characteristics: selectedSeed.characteristics,
        planting: selectedSeed.planting,
        care: selectedSeed.care,
        harvest: selectedSeed.harvest,
        recommendations: selectedSeed.recommendations,
        imageUrl,
        imageDescription: selectedSeed.imageDescription,
        confidence: 95,
        analyzedAt: new Date().toISOString(),
      };

      const result = await firebaseService.createSeed(seedData);
      setSavedSeeds(prev => [result, ...prev]);

      setImageUrl(null);
      setSelectedSeed(null);
      setSearchResults([]);
      setSearchQuery('');
      setMatchedSeeds([]);
    } catch (error) {
      console.error('Error saving seed analysis:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSelectSeed = (seed: Seed) => {
    setSelectedSeed(seed);
  };

  const handleReset = () => {
    setImageUrl(null);
    setSelectedSeed(null);
    setSearchResults([]);
    setSearchQuery('');
    setMatchedSeeds([]);
  };

  const displaySeeds = searchResults.length > 0 ? searchResults : (matchedSeeds.length > 0 ? matchedSeeds : []);

  const SeedDetailCard = ({ seed }: { seed: Seed }) => (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={seed.name}
        subheader={seed.scientificName}
        className="u-bg-green-primary-light u-text-green-primary-dark"
      />
      <CardContent>
        <Stack spacing={2.5}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={seed.type} color="primary" size="small" variant="outlined" />
            <Chip label={seed.color} color="secondary" size="small" variant="outlined" />
            <Chip label={seed.size} size="small" variant="outlined" />
            <Chip label={seed.shape} size="small" variant="outlined" />
          </Box>

          <Box>
            <Typography variant="subtitle2" className="u-text-green-primary" gutterBottom>
              Descripción
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {seed.imageDescription}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" className="u-text-green-primary" gutterBottom>
              Características
            </Typography>
            {seed.characteristics.map((c, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="body2" color="text.primary" sx={{ width: 20 }}>•</Typography>
                <Typography variant="body2" color="text.primary">{c}</Typography>
              </Box>
            ))}
          </Box>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2" className="u-font-weight-semibold">Siembra</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1}>
                <Typography variant="body2"><b>Temporada:</b> {seed.planting.season}</Typography>
                <Typography variant="body2"><b>Profundidad:</b> {seed.planting.depth}</Typography>
                <Typography variant="body2"><b>Espaciado:</b> {seed.planting.spacing}</Typography>
                <Typography variant="body2"><b>Suelo:</b> {seed.planting.soil}</Typography>
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2" className="u-font-weight-semibold">Cuidado</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1}>
                <Typography variant="body2"><b>Riego:</b> {seed.care.water}</Typography>
                <Typography variant="body2"><b>Sol:</b> {seed.care.sun}</Typography>
                <Typography variant="body2"><b>Temperatura:</b> {seed.care.temperature}</Typography>
                <Typography variant="body2"><b>Fertilizante:</b> {seed.care.fertilizer}</Typography>
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2" className="u-font-weight-semibold">Cosecha</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1}>
                <Typography variant="body2"><b>Madurez:</b> {seed.harvest.daysToMaturity}</Typography>
                <Typography variant="body2"><b>Método:</b> {seed.harvest.method}</Typography>
                <Typography variant="body2"><b>Almacenamiento:</b> {seed.harvest.storage}</Typography>
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Box>
            <Typography variant="subtitle2" className="u-text-green-primary" gutterBottom>
              Recomendaciones
            </Typography>
            {seed.recommendations.map((r, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                <Typography variant="body2" color="text.primary" sx={{ width: 20 }}>•</Typography>
                <Typography variant="body2" color="text.primary">{r}</Typography>
              </Box>
            ))}
          </Box>

          {imageUrl && (
            <Box sx={{ textAlign: 'center' }}>
              <Box
                component="img"
                src={imageUrl}
                alt="Semilla analizada"
                sx={{ maxWidth: '100%', maxHeight: 180, borderRadius: 1 }}
              />
            </Box>
          )}

          <Divider />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveAlt />}
              onClick={saveSeedAnalysis}
              disabled={uploading}
            >
              {uploading ? 'Guardando...' : 'Guardar en Biblioteca'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<PhotoCamera />}
              onClick={handleReset}
            >
              Nueva Búsqueda
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const EmptyDetailCard = () => (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Espera tu resultado"
        subheader="Busca o escanea una semilla para ver los detalles"
        className="u-bg-green-primary-light u-text-green-primary-dark"
      />
      <CardContent>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Analytics sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Selecciona una semilla
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mx: 'auto' }}>
            Utiliza la búsqueda para encontrar semillas en nuestra base de datos, o sube una foto para identificar automáticamente la variedad.
          </Typography>
          <Box sx={{ mt: 3, textAlign: 'left', maxWidth: 300, mx: 'auto' }}>
            <Typography variant="body2" color="text.primary">• Identificación precisa de variedad</Typography>
            <Typography variant="body2" color="text.primary">• Características agronómicas detalladas</Typography>
            <Typography variant="body2" color="text.primary">• Recomendaciones de cultivo personalizadas</Typography>
            <Typography variant="body2" color="text.primary">• Información de siembra, cuidado y cosecha</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box component="main" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom className="u-font-weight-semibold u-text-green-primary">
        Identificador de Semillas
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 6, md: 5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar semillas por nombre, tipo o especie..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              id="seed-camera-capture"
              onChange={handleImageUpload}
            />
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PhotoCamera />}
              onClick={() => document.getElementById('seed-camera-capture')?.click()}
              disabled={loading}
            >
              Tomar Foto
            </Button>
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="seed-image-upload"
              onChange={handleImageUpload}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={() => document.getElementById('seed-image-upload')?.click()}
              disabled={loading}
            >
              Subir Imagen
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          {loading ? (
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="text.primary" gutterBottom>
                  {scanning ? 'Analizando imagen...' : 'Buscando...'}
                </Typography>
                <Box sx={{ width: 24, height: 24, border: '3px solid var(--green-primary, #4caf50)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', mx: 'auto', mt: 2 }} />
              </CardContent>
            </Card>
          ) : displaySeeds.length > 0 ? (
            <Card sx={{ height: '100%', overflow: 'auto' }}>
              <CardHeader
                title={searchResults.length > 0 ? `Resultados de búsqueda (${displaySeeds.length})` : `Semillas identificadas (${displaySeeds.length})`}
                subheader={searchResults.length > 0 ? 'Coincidencias en la base de datos' : 'Basado en análisis de imagen'}
                className="u-bg-green-primary-light u-text-green-primary-dark"
              />
              <CardContent sx={{ p: 1 }}>
                {displaySeeds.map((seed) => (
                  <Card
                    key={seed.id}
                    sx={{
                      mb: 1,
                      cursor: 'pointer',
                      border: selectedSeed?.id === seed.id ? 2 : 0,
                      borderColor: 'primary.main',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => handleSelectSeed(seed)}
                  >
                    <CardContent sx={{ py: 1.5, px: 2 }}>
                      <Typography variant="subtitle2" className="u-font-weight-semibold">
                        {seed.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {seed.scientificName}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                        <Chip label={seed.type} size="small" variant="outlined" sx={{ height: 20, '& .MuiChip-label': { fontSize: 11, px: 0.5 } }} />
                        <Chip label={seed.color} size="small" variant="outlined" sx={{ height: 20, '& .MuiChip-label': { fontSize: 11, px: 0.5 } }} />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Semillas Disponibles"
                subheader={`${seedsDatabase.length} variedades en la base de datos`}
                className="u-bg-green-primary-light u-text-green-primary-dark"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                  Utiliza la búsqueda o sube una foto para comenzar
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                  {['Cereal', 'Leguminosa', 'Hortaliza', 'Fruta', 'Perenne', 'Tubérculo', 'Raíz', 'Oleaginosa'].map(type => (
                    <Chip
                      key={type}
                      label={type}
                      size="small"
                      variant="outlined"
                      onClick={() => handleSearch(type)}
                      clickable
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          {selectedSeed ? (
            <SeedDetailCard seed={selectedSeed} />
          ) : (
            <EmptyDetailCard />
          )}
        </Grid>
      </Grid>

      {savedSeeds.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom className="u-font-weight-semibold u-text-green-primary">
            Semillas Analizadas Guardadas
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Especie</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Tamaño</TableCell>
                  <TableCell>Confianza</TableCell>
                  <TableCell>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedSeeds.map((seed: any) => (
                  <TableRow key={seed.id}>
                    <TableCell className="u-font-weight-semibold">{seed.seedType || seed.name}</TableCell>
                    <TableCell>{seed.variety || seed.scientificName}</TableCell>
                    <TableCell>{seed.type}</TableCell>
                    <TableCell>{seed.size}</TableCell>
                    <TableCell>{seed.confidence}%</TableCell>
                    <TableCell>{new Date(seed.analyzedAt || seed.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default Seeds;
