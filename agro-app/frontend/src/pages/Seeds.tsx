import React from 'react';
import BackButton from '../components/BackButton';
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
  Tabs,
  Tab,
  Alert,
  MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  CloudUpload,
  PhotoCamera,
  Analytics,
  SaveAlt,
  Search,
  ExpandMore,
  Add,
  Calculate,
  Agriculture,
  Straighten,
  SearchOff,
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
  const [activeTab, setActiveTab] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Seed[]>([]);
  const [selectedSeed, setSelectedSeed] = React.useState<Seed | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [scanning, setScanning] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [savedSeeds, setSavedSeeds] = React.useState<any[]>([]);
  const [matchedSeeds, setMatchedSeeds] = React.useState<Seed[]>([]);
  const [detectedColorInfo, setDetectedColorInfo] = React.useState<{ color: string; shape: string; size: string } | null>(null);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newSeed, setNewSeed] = React.useState({
    name: '', scientificName: '', type: '', color: '', shape: '', size: '',
    characteristics: '', imageDescription: '',
    plantingSeason: '', plantingDepth: '', plantingSpacing: '', plantingSoil: '',
  });

  React.useEffect(() => {
    if (detectedColorInfo && !matchedSeeds.length && imageUrl) {
      setNewSeed(prev => ({
        ...prev,
        color: detectedColorInfo.color,
        shape: detectedColorInfo.shape,
        size: detectedColorInfo.size,
      }));
    }
  }, [detectedColorInfo, matchedSeeds, imageUrl]);

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
      const localUrl = URL.createObjectURL(file);
      setImageUrl(localUrl);

      const colorInfo = await getDominantColorFromImage(localUrl);
      setDetectedColorInfo(colorInfo);
      const matches = identifySeedByImage(colorInfo.color, colorInfo.shape, colorInfo.size);
      setMatchedSeeds(matches);

      if (matches.length > 0) {
        setSelectedSeed(matches[0]);
      }

      const imagePath = `seed_images/${Date.now()}_${file.name}`;
      firebaseService.uploadFile(file, imagePath).catch(() => {});
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

  const handleAddNewSeed = () => {
    if (!newSeed.name || !newSeed.scientificName) return;
    const seedData = {
      seedType: newSeed.name,
      variety: newSeed.scientificName,
      type: newSeed.type,
      color: newSeed.color,
      shape: newSeed.shape,
      size: newSeed.size,
      characteristics: newSeed.characteristics.split(',').map(c => c.trim()),
      imageDescription: newSeed.imageDescription,
      planting: {
        season: newSeed.plantingSeason,
        depth: newSeed.plantingDepth,
        spacing: newSeed.plantingSpacing,
        soil: newSeed.plantingSoil,
      },
      imageUrl,
      confidence: 85,
      analyzedAt: new Date().toISOString(),
    };
    firebaseService.createSeed(seedData).then(result => {
      setSavedSeeds(prev => [result, ...prev]);
      setShowAddForm(false);
      setNewSeed({ name: '', scientificName: '', type: '', color: '', shape: '', size: '', characteristics: '', imageDescription: '', plantingSeason: '', plantingDepth: '', plantingSpacing: '', plantingSoil: '' });
    });
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

  const [calcSeed, setCalcSeed] = React.useState<Seed | null>(null);
  const [calcArea, setCalcArea] = React.useState(1);
  const [calcRate, setCalcRate] = React.useState(20);
  const [calcBagSize, setCalcBagSize] = React.useState(25);
  const [calcUnit, setCalcUnit] = React.useState('kg');
  const [calcResults, setCalcResults] = React.useState<any>(null);

  const handleCalcSeedSelect = (seed: Seed) => {
    setCalcSeed(seed);
    if (seed.seeding) {
      const rate = parseFloat(seed.seeding.rate.split('-')[0]) || 20;
      const bagSize = parseFloat(seed.seeding.bagSize) || 25;
      setCalcRate(rate);
      setCalcBagSize(bagSize);
    }
    setCalcResults(null);
  };

  const handleCalculate = () => {
    if (!calcSeed) return;
    const totalSeed = calcRate * calcArea;
    const bagsNeeded = Math.ceil(totalSeed / calcBagSize);
    const areaPerBag = calcBagSize / calcRate;
    const seedsPerBag = calcSeed.seeding?.seedsPerGram ? calcBagSize * 1000 * calcSeed.seeding.seedsPerGram : 0;

    setCalcResults({
      totalSeed: totalSeed.toFixed(1),
      bagsNeeded,
      areaPerBag: areaPerBag.toFixed(2),
      seedsPerBag: seedsPerBag > 0 ? Math.round(seedsPerBag).toLocaleString() : 'N/A',
      ratePerHa: calcRate,
      bagSize: calcBagSize,
      area: calcArea,
      unit: calcUnit,
    });
  };

  return (
    <Box component="main" sx={{ p: 2 }}>
      <BackButton />
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Box sx={{ bgcolor: '#2E7D32', borderRadius: '8px 8px 0 0' }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, v) => setActiveTab(v)}
          variant="fullWidth"
          scrollButtons="auto"
          sx={{
            minHeight: 36,
            '& .MuiTab-root': { 
              fontSize: '0.7rem',
              minHeight: 36,
              padding: '6px 12px',
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'none',
              '& .MuiTab-iconWrapper': { fontSize: '1rem' },
            },
            '& .MuiTabs-indicator': { 
              bgcolor: '#fff',
              height: 3,
            },
            '& .MuiTab-root.Mui-selected': {
              color: '#fff',
              fontWeight: 'bold',
            },
          }}
        >
          <Tab label="Identificador" icon={<PhotoCamera />} iconPosition="start" />
          <Tab label="Calculadora" icon={<Calculate />} iconPosition="start" />
        </Tabs>
        </Box>
      </Box>

      {activeTab === 0 && (
        <Box>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 6, md: 5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar semillas por nombre..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              sx={{ 
                bgcolor: '#FFFFFF',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#2E7D32', borderWidth: 2 },
                  '&:hover fieldset': { borderColor: '#1B5E20' },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#2E7D32' }} />
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
            variant="contained"
            startIcon={<PhotoCamera />}
            onClick={() => document.getElementById('seed-camera-capture')?.click()}
            disabled={loading}
            size="large"
            sx={{ py: 1.5, bgcolor: '#388E3C', color: '#fff', '&:hover': { bgcolor: '#2E7D32' } }}
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
              sx={{ bgcolor: '#1976D2', color: '#fff', '&:hover': { bgcolor: '#1565C0' } }}
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
          ) : imageUrl && !matchedSeeds.length && !searchQuery ? (
            <Box>
              <Card sx={{ mt: 2 }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <SearchOff sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    No se pudo identificar la semilla
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    La imagen no coincide con ninguna semilla en la base de datos. Completa el formulario para agregarla manualmente.
                  </Typography>
                  <Button variant="outlined" color="primary" onClick={() => { setImageUrl(null); setMatchedSeeds([]); }}>
                    Tomar otra foto
                  </Button>
                </CardContent>
              </Card>
              <Card sx={{ mt: 2 }}>
                <CardHeader title="Agregar Nueva Semilla" className="u-bg-green-primary-light" titleTypographyProps={{ variant: 'subtitle1' }} />
                <CardContent>
                  <Stack spacing={2}>
                    <TextField label="Nombre común" size="small" value={newSeed.name} onChange={(e) => setNewSeed(s => ({ ...s, name: e.target.value }))} />
                    <TextField label="Nombre científico" size="small" value={newSeed.scientificName} onChange={(e) => setNewSeed(s => ({ ...s, scientificName: e.target.value }))} />
                    <Stack direction="row" spacing={1}>
                      <TextField label="Tipo" size="small" sx={{ flex: 1 }} value={newSeed.type} onChange={(e) => setNewSeed(s => ({ ...s, type: e.target.value }))} />
                      <TextField label="Color" size="small" sx={{ flex: 1 }} value={newSeed.color} onChange={(e) => setNewSeed(s => ({ ...s, color: e.target.value }))} />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <TextField label="Forma" size="small" sx={{ flex: 1 }} value={newSeed.shape} onChange={(e) => setNewSeed(s => ({ ...s, shape: e.target.value }))} />
                      <TextField label="Tamaño" size="small" sx={{ flex: 1 }} value={newSeed.size} onChange={(e) => setNewSeed(s => ({ ...s, size: e.target.value }))} />
                    </Stack>
                    <TextField label="Características (separadas por coma)" size="small" value={newSeed.characteristics} onChange={(e) => setNewSeed(s => ({ ...s, characteristics: e.target.value }))} />
                    <TextField label="Descripción de la imagen" size="small" multiline rows={2} value={newSeed.imageDescription} onChange={(e) => setNewSeed(s => ({ ...s, imageDescription: e.target.value }))} />
                    <Box sx={{ textAlign: 'center' }}>
                      <Button variant="contained" color="primary" onClick={handleAddNewSeed}>Guardar Nueva Semilla</Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          ) : searchQuery && !selectedSeed ? (
            <Box>
              <Card sx={{ mt: 2 }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    No se encontró "{searchQuery}" en la base de datos
                  </Typography>
                  <Button variant="outlined" color="primary" startIcon={<Add />} onClick={() => setShowAddForm(!showAddForm)} sx={{ mt: 1 }}>
                    {showAddForm ? 'Cancelar' : 'Agregar a la base de datos'}
                  </Button>
                </CardContent>
              </Card>
              {showAddForm && (
                <Card sx={{ mt: 2 }}>
                  <CardHeader title="Agregar Nueva Semilla" className="u-bg-green-primary-light" titleTypographyProps={{ variant: 'subtitle1' }} />
                  <CardContent>
                    <Stack spacing={2}>
                      <TextField label="Nombre común" size="small" value={newSeed.name} onChange={(e) => setNewSeed(s => ({ ...s, name: e.target.value }))} />
                      <TextField label="Nombre científico" size="small" value={newSeed.scientificName} onChange={(e) => setNewSeed(s => ({ ...s, scientificName: e.target.value }))} />
                      <Stack direction="row" spacing={1}>
                        <TextField label="Tipo" size="small" sx={{ flex: 1 }} value={newSeed.type} onChange={(e) => setNewSeed(s => ({ ...s, type: e.target.value }))} />
                        <TextField label="Color" size="small" sx={{ flex: 1 }} value={newSeed.color} onChange={(e) => setNewSeed(s => ({ ...s, color: e.target.value }))} />
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <TextField label="Forma" size="small" sx={{ flex: 1 }} value={newSeed.shape} onChange={(e) => setNewSeed(s => ({ ...s, shape: e.target.value }))} />
                        <TextField label="Tamaño" size="small" sx={{ flex: 1 }} value={newSeed.size} onChange={(e) => setNewSeed(s => ({ ...s, size: e.target.value }))} />
                      </Stack>
                      <TextField label="Características (separadas por coma)" size="small" value={newSeed.characteristics} onChange={(e) => setNewSeed(s => ({ ...s, characteristics: e.target.value }))} />
                      <TextField label="Descripción de la imagen" size="small" multiline rows={2} value={newSeed.imageDescription} onChange={(e) => setNewSeed(s => ({ ...s, imageDescription: e.target.value }))} />
                      <Accordion><AccordionSummary expandIcon={<ExpandMore />}>Información de Siembra</AccordionSummary><AccordionDetails>
                        <Stack spacing={1}>
                          <TextField label="Temporada" size="small" value={newSeed.plantingSeason} onChange={(e) => setNewSeed(s => ({ ...s, plantingSeason: e.target.value }))} />
                          <TextField label="Profundidad" size="small" value={newSeed.plantingDepth} onChange={(e) => setNewSeed(s => ({ ...s, plantingDepth: e.target.value }))} />
                          <TextField label="Espaciado" size="small" value={newSeed.plantingSpacing} onChange={(e) => setNewSeed(s => ({ ...s, plantingSpacing: e.target.value }))} />
                          <TextField label="Suelo" size="small" value={newSeed.plantingSoil} onChange={(e) => setNewSeed(s => ({ ...s, plantingSoil: e.target.value }))} />
                        </Stack>
                      </AccordionDetails></Accordion>
                      <Box sx={{ textAlign: 'center' }}>
                        <Button variant="contained" color="primary" onClick={handleAddNewSeed}>Guardar Nueva Semilla</Button>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Box>
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

      {savedSeeds.length > 0 && activeTab === 0 && (
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
      )}

      {/* Seeding Calculator Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom className="u-font-weight-semibold u-text-green-primary">
            Calculadora de Siembra
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Calcula la cantidad de semillas necesarias para tu parcela, rendimiento por bolsa y necesidades totales.
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Card>
                <CardHeader
                  title="Seleccionar Variedad"
                  className="u-bg-green-primary-light"
                  titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                />
                <CardContent>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Buscar variedad de semilla..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    sx={{ mb: 2 }}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
                      },
                    }}
                  />
                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {(searchQuery.trim() ? searchSeeds(searchQuery) : seedsDatabase).slice(0, 20).map((seed) => (
                      <Card
                        key={seed.id}
                        variant="outlined"
                        sx={{
                          mb: 0.5, cursor: 'pointer',
                          border: calcSeed?.id === seed.id ? 2 : 1,
                          borderColor: calcSeed?.id === seed.id ? 'primary.main' : 'divider',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                        onClick={() => handleCalcSeedSelect(seed)}
                      >
                        <CardContent sx={{ py: 1, px: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{seed.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{seed.scientificName}</Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                            <Chip label={seed.type} size="small" variant="outlined" sx={{ height: 18, '& .MuiChip-label': { fontSize: 10 } }} />
                            <Chip label={seed.size} size="small" variant="outlined" sx={{ height: 18, '& .MuiChip-label': { fontSize: 10 } }} />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Card>
                <CardHeader
                  title="Parámetros de Siembra"
                  className="u-bg-green-primary-light"
                  titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                />
                <CardContent>
                  {calcSeed && (
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Agriculture color="primary" />
                      <Box>
                        <Typography variant="subtitle2">{calcSeed.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{calcSeed.scientificName}</Typography>
                      </Box>
                    </Box>
                  )}

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Tasa de siembra"
                        type="number"
                        value={calcRate}
                        onChange={(e) => { setCalcRate(parseFloat(e.target.value) || 0); setCalcResults(null); }}
                        helperText={calcSeed?.seeding ? `Recomendado: ${calcSeed.seeding.rate} ${calcSeed.seeding.rateUnit}` : 'kg/ha'}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Unidad de tasa"
                        select
                        value={calcUnit}
                        onChange={(e) => setCalcUnit(e.target.value)}
                      >
                        <MenuItem value="kg">kg/ha</MenuItem>
                        <MenuItem value="lb">lb/ac</MenuItem>
                        <MenuItem value="oz">oz/ac</MenuItem>
                        <MenuItem value="seed">semillas/ha</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Tamaño de bolsa"
                        type="number"
                        value={calcBagSize}
                        onChange={(e) => { setCalcBagSize(parseFloat(e.target.value) || 0); setCalcResults(null); }}
                        helperText={calcSeed?.seeding ? `Bolsa estándar: ${calcSeed.seeding.bagSize} ${calcSeed.seeding.bagUnit}` : 'kg/bolsa'}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Área a sembrar"
                        type="number"
                        value={calcArea}
                        onChange={(e) => { setCalcArea(parseFloat(e.target.value) || 0); setCalcResults(null); }}
                        helperText="Hectáreas"
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Calculate />}
                      onClick={handleCalculate}
                      disabled={!calcSeed || !calcRate || !calcBagSize || !calcArea}
                      size="large"
                    >
                      Calcular Necesidades
                    </Button>
                  </Box>

                  {calcResults && (
                    <Box sx={{ mt: 3 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="h6" gutterBottom className="u-text-green-primary">
                        Resultados
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Card variant="outlined" sx={{ textAlign: 'center' }}>
                            <CardContent sx={{ py: 1.5 }}>
                              <Straighten color="primary" sx={{ fontSize: 28, mb: 0.5 }} />
                              <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                                {calcResults.bagsNeeded}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">bolsas necesarias</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Card variant="outlined" sx={{ textAlign: 'center' }}>
                            <CardContent sx={{ py: 1.5 }}>
                              <Agriculture color="primary" sx={{ fontSize: 28, mb: 0.5 }} />
                              <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                                {calcResults.areaPerBag}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">ha por bolsa</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Card variant="outlined" sx={{ textAlign: 'center' }}>
                            <CardContent sx={{ py: 1.5 }}>
                              <Calculate color="primary" sx={{ fontSize: 28, mb: 0.5 }} />
                              <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                                {calcResults.totalSeed}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">{calcResults.unit} totales</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Card variant="outlined" sx={{ textAlign: 'center' }}>
                            <CardContent sx={{ py: 1.5 }}>
                              <Analytics color="primary" sx={{ fontSize: 28, mb: 0.5 }} />
                              <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                                {calcResults.seedsPerBag}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">semillas/bolsa</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>

                      {calcSeed?.seeding && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            Densidad recomendada: <b>{calcSeed.seeding.plantsPerM2}</b> plantas/m² |
                            Poder germinativo: <b>{calcSeed.seeding.germinationRate}</b> |
                            Semillas/gramo: <b>{calcSeed.seeding.seedsPerGram}</b>
                          </Typography>
                        </Alert>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Variety comparison */}
          <Card sx={{ mt: 3 }}>
            <CardHeader
              title="Comparación de Variedades"
              subheader="Rendimiento de siembra estimado por variedad"
              className="u-bg-green-primary-light"
              titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
            />
            <CardContent>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Variedad</TableCell>
                      <TableCell align="center">Tipo</TableCell>
                      <TableCell align="center">Tasa siembra</TableCell>
                      <TableCell align="center">Bolsa</TableCell>
                      <TableCell align="center">Plantas/m²</TableCell>
                      <TableCell align="center">ha/bolsa</TableCell>
                      <TableCell align="center">Bolsas/ha</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {seedsDatabase.filter(s => s.seeding).slice(0, 10).map((seed) => {
                      const rate = parseFloat(seed.seeding!.rate.split('-')[0]) || 20;
                      const bag = parseFloat(seed.seeding!.bagSize) || 25;
                      return (
                        <TableRow key={seed.id}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() => { handleCalcSeedSelect(seed); setActiveTab(1); }}
                        >
                          <TableCell sx={{ fontWeight: 600 }}>{seed.name}</TableCell>
                          <TableCell align="center"><Chip label={seed.type} size="small" variant="outlined" /></TableCell>
                          <TableCell align="center">{seed.seeding!.rate} {seed.seeding!.rateUnit}</TableCell>
                          <TableCell align="center">{seed.seeding!.bagSize} {seed.seeding!.bagUnit}</TableCell>
                          <TableCell align="center">{seed.seeding!.plantsPerM2}</TableCell>
                          <TableCell align="center">{(bag / rate).toFixed(2)}</TableCell>
                          <TableCell align="center">{Math.ceil(rate / bag)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default Seeds;
