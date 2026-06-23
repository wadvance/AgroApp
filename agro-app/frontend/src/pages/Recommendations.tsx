import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { LocalFlorist, LocalPharmacy, Agriculture, Calculate, Refresh, CheckCircle } from '@mui/icons-material';

const Recommendations: React.FC = () => {
  const [cropType, setCropType] = React.useState('maiz');
  const [growthStage, setGrowthStage] = React.useState('vegetativo');
  const [soilType, setSoilType] = React.useState('franco');
  const [recommendations, setRecommendations] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const generateRecommendations = async () => {
    setLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock recommendation data based on inputs
      const mockData = {
        cropType: cropType,
        growthStage: growthStage,
        soilType: soilType,
        fertilizer: {
          nitrogen: Math.floor(Math.random() * 50) + 50, // kg/ha
          phosphorus: Math.floor(Math.random() * 40) + 30, // kg/ha
          potassium: Math.floor(Math.random() * 40) + 30, // kg/ha
          timing: [
            { stage: 'Siembra', amount: '50%' },
            { stage: 'Vegetativo', amount: '30%' },
            { stage: 'Reproductivo', amount: '20%' }
          ]
        },
        pesticides: [
          {
            type: 'Herbicida',
            product: 'Glifosato 480g/L',
            dose: '2.0 L/ha',
            timing: 'Pre-emergente o early post-emergente',
            notes: 'Control de malezas de hoja ancha y estrecha'
          },
          {
            type: 'Insecticida',
            product: 'Lambda-cialotrina 25g/L',
            dose: '0.3 L/ha',
            timing: 'Al primer avistamiento de plaga',
            notes: 'Effectivo contra barrenadores y picudos'
          },
          {
            type: 'Fungicida',
            product: 'Tebuconazole 250g/L',
            dose: '0.5 L/ha',
            timing: 'En condiciones de alta humedad',
            notes: 'Prevención de enfermedades foliares'
          }
        ],
        irrigation: {
          frequency: 'Cada 5-7 días',
          amount: '25-30 mm por aplicación',
          method: 'Riego por goteo o aspersión',
          notes: 'Ajustar según etapa de crecimiento y condiciones climáticas'
        },
        culturalPractices: [
          'Realizar análisis de suelo antes de cada ciclo',
          'Mantener registros detallados de aplicaciones',
          'Rotar cultivos cada 2-3 años para romper ciclos de plagas',
          'Utilizar cultivares resistentes cuando estén disponibles'
        ]
      };
      
      setRecommendations(mockData);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateClick = () => {
    if (cropType && growthStage && soilType) {
      generateRecommendations();
    }
  };

  return (
    <Box component="main" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom className="u-font-weight-semibold u-text-green-primary">
        Recomendaciones de Cultivo
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {/* Input Section */}
        <Box sx={{ xs: 12, sm: 6, md: 4 }}>
          <Card className="u-bg-card u-shadow-sm u-transition-normal">
            <CardHeader
              title="Parámetros del Cultivo"
              className="u-bg-green-primary-light u-text-green-primary-dark"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalFlorist fontSize="large" color="primary" />
              </Box>
            </CardHeader>
            <CardContent>
              <Stack spacing={2}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="crop-label">Tipo de Cultivo</InputLabel>
                  <Select
                    labelId="crop-label"
                    label="Tipo de Cultivo"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                  >
                    <MenuItem value="maiz">
                      Maíz
                    </MenuItem>
                    <MenuItem value="trigo">
                      Trigo
                    </MenuItem>
                    <MenuItem value="soja">
                      Soja
                    </MenuItem>
                    <MenuItem value="arroz">
                      Arroz
                    </MenuItem>
                    <MenuItem value="alfalfa">
                      Alfalfa
                    </MenuItem>
                    <MenuItem value="girasol">
                      Girasol
                    </MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="stage-label">Etapa de Crecimiento</InputLabel>
                  <Select
                    labelId="stage-label"
                    label="Etapa de Crecimiento"
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value)}
                  >
                    <MenuItem value="germinacion">
                      Germinación
                    </MenuItem>
                    <MenuItem value="vegetativo">
                      Vegetativo
                    </MenuItem>
                    <MenuItem value="reproductivo">
                      Reproductivo
                    </MenuItem>
                    <MenuItem value="madurez">
                      Madurez
                    </MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel id="soil-label">Tipo de Suelo</InputLabel>
                  <Select
                    labelId="soil-label"
                    label="Tipo de Suelo"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                  >
                    <MenuItem value="arenoso">
                      Arenoso
                    </MenuItem>
                    <MenuItem value="franco">
                      Franco
                    </MenuItem>
                    <MenuItem value="arcilloso">
                      Arcilloso
                    </MenuItem>
                    <MenuItem value="franco-arenoso">
                      Franco arenoso
                    </MenuItem>
                    <MenuItem value="franco-arcilloso">
                      Franco arcilloso
                    </MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              
               <Box sx={{ mt: 3, textAlign: 'center' }}>
                 <Button 
                   variant="contained" 
                   color="primary" 
                   size="medium"
                   startIcon={<Refresh fontSize="inherit" />}
                   onClick={handleGenerateClick}
                   disabled={loading}
                 >
                   {loading ? 'Generando...' : 'Generar Recomendaciones'}
                 </Button>
               </Box>
            </CardContent>
          </Card>
        </Box>
        
        {/* Results Section */}
        <Box sx={{ xs: 12, sm: 6, md: 8 }}>
          {recommendations ? (
            <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
              <CardHeader
                title="Recomendaciones Generadas"
                subheader={`Para ${recommendations.cropType} en etapa ${recommendations.growthStage} en suelo ${recommendations.soilType}`}
                className="u-bg-green-primary-light u-text-green-primary-dark"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Calculate fontSize="large" color="primary" />
                </Box>
              </CardHeader>
              <CardContent>
                <Stack spacing={3}>
                  {/* Fertilizer Section */}
                  <Box>
                    <Typography variant="h5" className="u-font-weight-semibold u-text-brown-primary">
                      Programa de Fertilización
                    </Typography>
                     <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                       Recomendaciones basadas en análisis de suelo y etapa de cultivo
                     </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Nutriente</TableCell>
                            <TableCell align="right">Cantidad (kg/ha)</TableCell>
                            <TableCell>Aplicación</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Nitrógeno (N)</TableCell>
                            <TableCell align="right">{recommendations.fertilizer.nitrogen}</TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                {recommendations.fertilizer.timing.map((t: any, index: number) => (
                                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" color="text.primary">
                                      {t.amount}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                      {t.stage}
                                    </Typography>
                                  </Box>
                                ))}
                              </Stack>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Fósforo (P)</TableCell>
                            <TableCell align="right">{recommendations.fertilizer.phosphorus}</TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                {recommendations.fertilizer.timing.map((t: any, index: number) => (
                                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" color="text.primary">
                                      {t.amount}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                      {t.stage}
                                    </Typography>
                                  </Box>
                                ))}
                              </Stack>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Potasio (K)</TableCell>
                            <TableCell align="right">{recommendations.fertilizer.potassium}</TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                {recommendations.fertilizer.timing.map((t: any, index: number) => (
                                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" color="text.primary">
                                      {t.amount}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                      {t.stage}
                                    </Typography>
                                  </Box>
                                ))}
                              </Stack>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  {/* Pesticides Section */}
                  <Box>
                    <Typography variant="h5" className="u-font-weight-semibold u-text-brown-primary">
                      Programa de Protección Fitosanitaria
                    </Typography>
                     <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                       Aplicaciones preventivas y correctivas recomendadas
                     </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Producto</TableCell>
                            <TableCell align="right">Dosis</TableCell>
                            <TableCell>Momento de Aplicación</TableCell>
                            <TableCell>Observaciones</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {recommendations.pesticides.map((pest: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{pest.type}</TableCell>
                              <TableCell>{pest.product}</TableCell>
                              <TableCell align="right">{pest.dose}</TableCell>
                              <TableCell>{pest.timing}</TableCell>
                              <TableCell>{pest.notes}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  {/* Irrigation Section */}
                  <Box>
                    <Typography variant="h5" className="u-font-weight-semibold u-text-brown-primary">
                      Programa de Riego
                    </Typography>
                    <Stack spacing={1}>
                      <div className="u-flex u-justify-between">
                        <Typography variant="body2" color="text.primary">
                          Frecuencia:
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                          {recommendations.irrigation.frequency}
                        </Typography>
                      </div>
                      <div className="u-flex u-justify-between">
                        <Typography variant="body2" color="text.primary">
                          Cantidad por aplicación:
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                          {recommendations.irrigation.amount}
                        </Typography>
                      </div>
                      <div className="u-flex u-justify-between">
                        <Typography variant="body2" color="text.primary">
                          Método recomendado:
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                          {recommendations.irrigation.method}
                        </Typography>
                      </div>
                       <Box sx={{ mt: 2 }}>
                         <Typography variant="body2" color="text.secondary">
                           {recommendations.irrigation.notes}
                         </Typography>
                       </Box>
                    </Stack>
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  {/* Cultural Practices Section */}
                  <Box>
                    <Typography variant="h5" className="u-font-weight-semibold u-text-brown-primary">
                      Prácticas Culturales Recomendadas
                    </Typography>
                    <List>
                      {recommendations.culturalPractices.map((practice: string, index: number) => (
                        <ListItemButton key={index}>
                          <ListItemIcon>
                            <CheckCircle fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText primary={practice} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Box>
                  
                   <Box sx={{ mt: 3, textAlign: 'center' }}>
                     <Button 
                       variant="contained" 
                       color="secondary" 
                       size="medium"
  startIcon={<LocalPharmacy fontSize="inherit" />}>
                       Guardar Plan de Manejo
                     </Button>
                     <Button 
                       variant="outlined" 
                       color="primary" 
                       size="medium"
  startIcon={<LocalFlorist fontSize="inherit" />}>
                       Nuevo Ciclo
                     </Button>
                   </Box>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
              <CardHeader
                title="Lista para generar recomendaciones"
                subheader="Seleccione los parámetros de su cultivo para obtener recomendaciones personalizadas"
                className="u-bg-green-primary-light u-text-green-primary-dark"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Agriculture fontSize="large" color="primary" />
                </Box>
              </CardHeader>
              <CardContent>
                 <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h5" color="text.secondary">
                    Aún no se han generado recomendaciones
                  </Typography>
                   <Box sx={{ mt: 3 }}>
                     <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
                      Complete los campos de tipo de cultivo, etapa de crecimiento y tipo de suelo, 
                      luego haga clic en "Generar Recomendaciones" para obtener un plan de manejo 
                      integral basado en las mejores prácticas agrícolas y recomendaciones específicas 
                      para su situación.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, maxWidth: 400 }}>
                    <Typography variant="body2" color="text.primary">
                      • Fertilización balanceada (N-P-K)
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      • Protección fitosanitaria preventiva
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      • Programa de riego optimizado
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      • Prácticas culturales sostenibles
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Recommendations;

