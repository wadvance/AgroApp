import React from 'react';
import {
  Box, Typography, Card, CardContent, Button, Stack,
  TextField, MenuItem, Grid, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Tooltip, Accordion, AccordionSummary, AccordionDetails,
  Divider, InputAdornment,
} from '@mui/material';
import {
  Add, Edit, Delete, ExpandMore, Search, WaterDrop, Agriculture,
  CalendarToday, LocationOn, Straighten,
  Close, Spa,
} from '@mui/icons-material';
import { firebaseService } from '../firebase';
import { seedsDatabase, searchSeeds } from '../data/seeds';
import BackButton from '../components/BackButton';
import { useAuth } from '../context/AuthContext';

const irrigationSystems = [
  'Goteo', 'Aspersión', 'Inundación', 'Pivot', 'Microaspersión',
  'Exudación', 'Manual', 'Cinta de goteo',
];

const soilTypes = [
  'Arcilloso', 'Arenoso', 'Franco', 'Limoso', 'Turboso',
  'Cretáceo', 'Franco-arenoso', 'Franco-arcilloso', 'Franco-limoso',
  'Arcillo-arenoso', 'Arcillo-limoso',
];

const cropStatuses = [
  { value: 'active', label: 'Activo', color: 'success' },
  { value: 'harvested', label: 'Cosechado', color: 'info' },
  { value: 'fallow', label: 'En barbecho', color: 'warning' },
];

const unitSystems = [
  { value: 'metric', label: 'Métrico (ha, kg, mm)' },
  { value: 'imperial', label: 'Imperial (ac, lb, in)' },
];

interface Crop {
  id: string;
  name: string;
  cropVariety: string;
  location: { lat: number; lng: number; address: string };
  area: number;
  areaUnit: string;
  sowingDate: string;
  irrigationSystem: string;
  soilType: string;
  plantingFrame: string;
  crownDiameter: number;
  units: string;
  status: string;
  notes: string;
  userId: string;
  createdAt: any;
  updatedAt: any;
}

interface IrrigationRecord {
  id: string;
  cropId: string;
  date: string;
  amount: number;
  unit: string;
  method: string;
  notes: string;
  createdAt: any;
}

const emptyCrop = {
  name: '',
  cropVariety: '',
  location: { lat: 0, lng: 0, address: '' },
  area: 0,
  areaUnit: 'ha',
  sowingDate: '',
  irrigationSystem: '',
  soilType: '',
  plantingFrame: '',
  crownDiameter: 0,
  units: 'metric',
  status: 'active',
  notes: '',
};

const CropManagement: React.FC = () => {
  const { user } = useAuth();
  const [crops, setCrops] = React.useState<Crop[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingCrop, setEditingCrop] = React.useState<any>(null);
  const [formData, setFormData] = React.useState<any>(emptyCrop);
  const [selectedCrop, setSelectedCrop] = React.useState<Crop | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [seedSearchQuery, setSeedSearchQuery] = React.useState('');
  const [seedSearchResults, setSeedSearchResults] = React.useState<any[]>([]);
  const [irrigations, setIrrigations] = React.useState<IrrigationRecord[]>([]);
  const [irrigationDialogOpen, setIrrigationDialogOpen] = React.useState(false);
  const [newIrrigation, setNewIrrigation] = React.useState({ date: '', amount: 0, unit: 'mm', method: '', notes: '' });
  const [searchingLocation, setSearchingLocation] = React.useState(false);

  React.useEffect(() => {
    if (user) loadCrops();
  }, [user]);

  const loadCrops = async () => {
    try {
      const data = await firebaseService.getCrops(user!.uid);
      setCrops(data as Crop[]);
    } catch (err) {
      console.error('Error loading crops:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCrop(null);
    setFormData({ ...emptyCrop, userId: user?.uid || '' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setFormData({ ...crop });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCrop(null);
    setFormData(emptyCrop);
    setSeedSearchQuery('');
    setSeedSearchResults([]);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.cropVariety) return;
    try {
      if (editingCrop) {
        await firebaseService.updateCrop(editingCrop.id, formData);
      } else {
        await firebaseService.createCrop(formData);
      }
      handleCloseDialog();
      loadCrops();
    } catch (err) {
      console.error('Error saving crop:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este cultivo definitivamente?')) return;
    try {
      await firebaseService.deleteCrop(id);
      loadCrops();
    } catch (err) {
      console.error('Error deleting crop:', err);
    }
  };

  const handleViewDetail = async (crop: Crop) => {
    setSelectedCrop(crop);
    setDetailOpen(true);
    try {
      const data = await firebaseService.getIrrigations(crop.id);
      setIrrigations(data as IrrigationRecord[]);
    } catch (err) {
      console.error('Error loading irrigations:', err);
    }
  };

  const handleSeedSearch = (query: string) => {
    setSeedSearchQuery(query);
    if (query.trim()) {
      setSeedSearchResults(searchSeeds(query));
    } else {
      setSeedSearchResults([]);
    }
  };

  const handleSelectSeed = (seed: any) => {
    setFormData((prev: any) => ({ ...prev, cropVariety: seed.name }));
    setSeedSearchQuery('');
    setSeedSearchResults([]);
  };

  const handleLocationSearch = async () => {
    const query = formData.location.address;
    if (!query.trim()) return;
    setSearchingLocation(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=pa`);
      const data = await res.json();
      if (data.length > 0) {
        setFormData((prev: any) => ({
          ...prev,
          location: { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), address: data[0].display_name }
        }));
      }
    } catch (err) {
      console.error('Error searching location:', err);
    } finally {
      setSearchingLocation(false);
    }
  };

  const handleAddIrrigation = async () => {
    if (!selectedCrop || !newIrrigation.date || !newIrrigation.amount) return;
    try {
      await firebaseService.createIrrigation({
        cropId: selectedCrop.id,
        ...newIrrigation,
        amount: Number(newIrrigation.amount),
      });
      const data = await firebaseService.getIrrigations(selectedCrop.id);
      setIrrigations(data as IrrigationRecord[]);
      setNewIrrigation({ date: '', amount: 0, unit: 'mm', method: '', notes: '' });
      setIrrigationDialogOpen(false);
    } catch (err) {
      console.error('Error adding irrigation:', err);
    }
  };

  const getStatusColor = (status: string) => {
    const s = cropStatuses.find(cs => cs.value === status);
    return s?.color || 'default';
  };

  const getCropIcon = (variety: string) => {
    const seed = seedsDatabase.find(s => s.name === variety);
    if (!seed) return <Spa />;
    const icons: Record<string, React.ReactNode> = {
      'Cereal': <span style={{ fontSize: 24 }}>🌾</span>,
      'Leguminosa': <span style={{ fontSize: 24 }}>🫘</span>,
      'Hortaliza': <span style={{ fontSize: 24 }}>🥬</span>,
      'Fruta': <span style={{ fontSize: 24 }}>🍎</span>,
      'Perenne': <span style={{ fontSize: 24 }}>🌳</span>,
      'Tuberculo': <span style={{ fontSize: 24 }}>🥔</span>,
      'Raiz': <span style={{ fontSize: 24 }}>🥕</span>,
      'Oleaginosa': <span style={{ fontSize: 24 }}>🫒</span>,
    };
    return icons[seed.type] || <Spa />;
  };

  const totalIrrigation = irrigations.reduce((sum, ir) => sum + (ir.amount || 0), 0);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', pt: 8 }}>
        <Typography variant="h6" color="text.secondary">Cargando cultivos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <BackButton />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" className="u-font-weight-semibold u-text-green-primary">
          Gestión de Cultivos
        </Typography>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenAdd}>
          Nuevo Cultivo
        </Button>
      </Box>

      {crops.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Agriculture sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay cultivos registrados
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Registra tu primer cultivo para comenzar a gestionar tu parcela
            </Typography>
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenAdd}>
              Agregar Cultivo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {crops.map((crop) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={crop.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 0.5 }}>
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenEdit(crop); }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(crop.id); }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <CardContent sx={{ flex: 1, cursor: 'pointer' }} onClick={() => handleViewDetail(crop)}>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getCropIcon(crop.cropVariety)}
                      <Box>
                        <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>{crop.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{crop.cropVariety}</Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={cropStatuses.find(s => s.value === crop.status)?.label || crop.status}
                      color={getStatusColor(crop.status) as any}
                      size="small"
                      sx={{ alignSelf: 'flex-start' }}
                    />
                    <Stack spacing={0.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {crop.location.address || 'Sin ubicación'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          Siembra: {crop.sowingDate ? new Date(crop.sowingDate).toLocaleDateString('es-ES') : 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Straighten fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          Área: {crop.area} {crop.areaUnit}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WaterDrop fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          Riego: {crop.irrigationSystem || 'N/A'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth scroll="body">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingCrop ? 'Editar Cultivo' : 'Nuevo Cultivo'}
          <IconButton onClick={handleCloseDialog} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Nombre del cultivo" required
                  value={formData.name}
                  onChange={(e) => setFormData((p: any) => ({ ...p, name: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Variedad de semilla" required
                  value={formData.cropVariety}
                  onChange={(e) => handleSeedSearch(e.target.value)}
                  onFocus={() => { if (seedSearchQuery) setSeedSearchResults(searchSeeds(seedSearchQuery)); }}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
                    },
                  }}
                />
                {seedSearchResults.length > 0 && (
                  <Card sx={{ mt: 0.5, maxHeight: 200, overflow: 'auto' }}>
                    {seedSearchResults.map((seed) => (
                      <Box
                        key={seed.id}
                        sx={{ px: 2, py: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                        onClick={() => handleSelectSeed(seed)}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{seed.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{seed.scientificName} — {seed.type}</Typography>
                      </Box>
                    ))}
                  </Card>
                )}
              </Grid>
            </Grid>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography sx={{ fontWeight: 600 }}>Ubicación de la Parcela</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1.5}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth size="small" label="Dirección o lugar"
                        value={formData.location.address}
                        onChange={(e) => setFormData((p: any) => ({ ...p, location: { ...p.location, address: e.target.value } }))}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <Button size="small" onClick={handleLocationSearch} disabled={searchingLocation}>
                                  {searchingLocation ? 'Buscando...' : 'Buscar'}
                                </Button>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField fullWidth size="small" label="Latitud" type="number"
                        value={formData.location.lat}
                        onChange={(e) => setFormData((p: any) => ({ ...p, location: { ...p.location, lat: parseFloat(e.target.value) || 0 } }))}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField fullWidth size="small" label="Longitud" type="number"
                        value={formData.location.lng}
                        onChange={(e) => setFormData((p: any) => ({ ...p, location: { ...p.location, lng: parseFloat(e.target.value) || 0 } }))}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography sx={{ fontWeight: 600 }}>Información del Cultivo</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth label="Fecha de siembra" type="date" required
                      value={formData.sowingDate}
                      onChange={(e) => setFormData((p: any) => ({ ...p, sowingDate: e.target.value }))}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                      fullWidth label="Área" type="number" required
                      value={formData.area}
                      onChange={(e) => setFormData((p: any) => ({ ...p, area: parseFloat(e.target.value) || 0 }))}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                      fullWidth label="Unidad área" select value={formData.areaUnit}
                      onChange={(e) => setFormData((p: any) => ({ ...p, areaUnit: e.target.value }))}
                    >
                      <MenuItem value="ha">Hectáreas (ha)</MenuItem>
                      <MenuItem value="ac">Acres (ac)</MenuItem>
                      <MenuItem value="m2">Metros² (m²)</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth label="Sistema de riego" select value={formData.irrigationSystem}
                      onChange={(e) => setFormData((p: any) => ({ ...p, irrigationSystem: e.target.value }))}
                    >
                      {irrigationSystems.map(sys => (
                        <MenuItem key={sys} value={sys}>{sys}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth label="Tipo de suelo" select value={formData.soilType}
                      onChange={(e) => setFormData((p: any) => ({ ...p, soilType: e.target.value }))}
                    >
                      {soilTypes.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography sx={{ fontWeight: 600 }}>Marco de Plantación (Cultivos Leñosos)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth label="Marco de plantación (ej: 4x4 m, 5x3 m)"
                      placeholder="Distancia entre plantas x distancia entre hileras"
                      value={formData.plantingFrame}
                      onChange={(e) => setFormData((p: any) => ({ ...p, plantingFrame: e.target.value }))}
                      helperText="Ej: 4x4 m para aguacate, 6x4 m para mango"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth label="Diámetro de copa (cm)" type="number"
                      value={formData.crownDiameter}
                      onChange={(e) => setFormData((p: any) => ({ ...p, crownDiameter: parseFloat(e.target.value) || 0 }))}
                      helperText="Para cálculos de transpiración y riego"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Sistema de unidades" select value={formData.units}
                  onChange={(e) => setFormData((p: any) => ({ ...p, units: e.target.value }))}
                >
                  {unitSystems.map(us => (
                    <MenuItem key={us.value} value={us.value}>{us.label}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Estado" select value={formData.status}
                  onChange={(e) => setFormData((p: any) => ({ ...p, status: e.target.value }))}
                >
                  {cropStatuses.map(s => (
                    <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth label="Notas" multiline rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData((p: any) => ({ ...p, notes: e.target.value }))}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary" disabled={!formData.name || !formData.cropVariety}>
            {editingCrop ? 'Guardar Cambios' : 'Crear Cultivo'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth scroll="body">
        {selectedCrop && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getCropIcon(selectedCrop.cropVariety)}
                <Box>
                  <Typography variant="h6">{selectedCrop.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedCrop.cropVariety}</Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setDetailOpen(false)} size="small"><Close /></IconButton>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined">
                      <CardContent sx={{ py: 1.5 }}>
                        <Typography variant="subtitle2" color="text.secondary">Ubicación</Typography>
                        <Typography variant="body2">{selectedCrop.location.address || 'No especificada'}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedCrop.location.lat?.toFixed(4)}, {selectedCrop.location.lng?.toFixed(4)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined">
                      <CardContent sx={{ py: 1.5 }}>
                        <Typography variant="subtitle2" color="text.secondary">Fecha de siembra</Typography>
                        <Typography variant="body2">
                          {selectedCrop.sowingDate ? new Date(selectedCrop.sowingDate).toLocaleDateString('es-ES') : 'N/A'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Card variant="outlined">
                      <CardContent sx={{ py: 1.5 }}>
                        <Typography variant="subtitle2" color="text.secondary">Área</Typography>
                        <Typography variant="body2">{selectedCrop.area} {selectedCrop.areaUnit}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Card variant="outlined">
                      <CardContent sx={{ py: 1.5 }}>
                        <Typography variant="subtitle2" color="text.secondary">Riego</Typography>
                        <Typography variant="body2">{selectedCrop.irrigationSystem || 'N/A'}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Card variant="outlined">
                      <CardContent sx={{ py: 1.5 }}>
                        <Typography variant="subtitle2" color="text.secondary">Suelo</Typography>
                        <Typography variant="body2">{selectedCrop.soilType || 'N/A'}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  {selectedCrop.plantingFrame && (
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Card variant="outlined">
                        <CardContent sx={{ py: 1.5 }}>
                          <Typography variant="subtitle2" color="text.secondary">Marco plantación</Typography>
                          <Typography variant="body2">{selectedCrop.plantingFrame}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  {selectedCrop.crownDiameter > 0 && (
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Card variant="outlined">
                        <CardContent sx={{ py: 1.5 }}>
                          <Typography variant="subtitle2" color="text.secondary">Diámetro copa</Typography>
                          <Typography variant="body2">{selectedCrop.crownDiameter} cm</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Card variant="outlined">
                      <CardContent sx={{ py: 1.5 }}>
                        <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
                        <Chip
                          label={cropStatuses.find(s => s.value === selectedCrop.status)?.label || selectedCrop.status}
                          color={getStatusColor(selectedCrop.status) as any}
                          size="small"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {selectedCrop.notes && (
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Notas</Typography>
                      <Typography variant="body2">{selectedCrop.notes}</Typography>
                    </CardContent>
                  </Card>
                )}

                <Divider />

                {/* Water status summary */}
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WaterDrop color="primary" />
                    Estado Hídrico
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6, md: 3 }}>
                      <Card variant="outlined" sx={{ textAlign: 'center' }}>
                        <CardContent>
                          <Typography variant="h4" color="primary.main">{totalIrrigation.toFixed(0)}</Typography>
                          <Typography variant="caption" color="text.secondary">mm totales aplicados</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                      <Card variant="outlined" sx={{ textAlign: 'center' }}>
                        <CardContent>
                          <Typography variant="h4" color="info.main">{irrigations.length}</Typography>
                          <Typography variant="caption" color="text.secondary">riegos registrados</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* Irrigation log */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WaterDrop color="primary" />
                      Riegos Aportados
                    </Typography>
                    <Button
                      variant="outlined" size="small" startIcon={<Add />}
                      onClick={() => setIrrigationDialogOpen(true)}
                    >
                      Registrar Riego
                    </Button>
                  </Box>
                  {irrigations.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                      No hay riegos registrados. Añade el primero.
                    </Typography>
                  ) : (
                    <TableContainer component={Card} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Fecha</TableCell>
                            <TableCell align="right">Cantidad</TableCell>
                            <TableCell>Método</TableCell>
                            <TableCell>Notas</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {irrigations.map((ir) => (
                            <TableRow key={ir.id}>
                              <TableCell>{new Date(ir.date).toLocaleDateString('es-ES')}</TableCell>
                              <TableCell align="right">{ir.amount} {ir.unit}</TableCell>
                              <TableCell>{ir.method || '—'}</TableCell>
                              <TableCell>{ir.notes || '—'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { handleOpenEdit(selectedCrop); setDetailOpen(false); }} startIcon={<Edit />}>
                Editar Cultivo
              </Button>
              <Button onClick={() => setDetailOpen(false)}>Cerrar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Add Irrigation Dialog */}
      <Dialog open={irrigationDialogOpen} onClose={() => setIrrigationDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Registrar Riego</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth label="Fecha" type="date" required
              value={newIrrigation.date}
              onChange={(e) => setNewIrrigation(p => ({ ...p, date: e.target.value }))}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              fullWidth label="Cantidad" type="number" required
              value={newIrrigation.amount}
              onChange={(e) => setNewIrrigation(p => ({ ...p, amount: parseFloat(e.target.value) || 0 }))}
            />
            <TextField
              fullWidth label="Unidad" select value={newIrrigation.unit}
              onChange={(e) => setNewIrrigation(p => ({ ...p, unit: e.target.value }))}
            >
              <MenuItem value="mm">mm</MenuItem>
              <MenuItem value="l/m2">l/m²</MenuItem>
              <MenuItem value="in">pulgadas (in)</MenuItem>
              <MenuItem value="gal/ac">gal/ac</MenuItem>
            </TextField>
            <TextField
              fullWidth label="Método" select value={newIrrigation.method}
              onChange={(e) => setNewIrrigation(p => ({ ...p, method: e.target.value }))}
            >
              {irrigationSystems.map(sys => (
                <MenuItem key={sys} value={sys}>{sys}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth label="Notas" multiline rows={2}
              value={newIrrigation.notes}
              onChange={(e) => setNewIrrigation(p => ({ ...p, notes: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIrrigationDialogOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleAddIrrigation} variant="contained" disabled={!newIrrigation.date || !newIrrigation.amount}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CropManagement;
