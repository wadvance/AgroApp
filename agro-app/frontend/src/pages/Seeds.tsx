import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Button,
  TextField,
  Typography as MuiTypography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { CloudUpload, PhotoCamera, CropRotate, Analytics, SaveAlt } from '@mui/icons-material';
import { firebaseService } from '../firebase';

const Seeds: React.FC = () => {
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [savedSeeds, setSavedSeeds] = React.useState<any[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    
    try {
      // Upload image to Firebase Storage
      const imagePath = `seed_images/${Date.now()}_${file.name}`;
      const downloadUrl = await firebaseService.uploadFile(file, imagePath);
      setImageUrl(downloadUrl);
      
      // Simulate API call for AI analysis (in a real app, this would call an AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis result
      const mockResult = {
        seedType: 'Trigo',
        variety: 'Triticum aestivum',
        confidence: 92,
        characteristics: [
          'Alto rendimiento',
          'Resistente a sequía moderada',
          'Ciclo corto (110-120 días)',
          'Adaptado a suelos férricos'
        ],
        recommendations: [
          'Siembra: principios de mayo',
          'Riego: moderado, evitar en etapa de maduración',
          'Fertilización: N-P-K 12-24-12 en siembra'
        ],
        imageUrl: downloadUrl, // Store the image URL with the result
        analyzedAt: new Date().toISOString()
      };
      
      setAnalysisResult(mockResult);
    } catch (error) {
      console.error('Error analyzing seed image:', error);
      // In a real app, show error message
    } finally {
      setLoading(false);
    }
  };

  const saveSeedAnalysis = async () => {
    if (!analysisResult) return;
    
    setUploading(true);
    try {
      const seedData = {
        ...analysisResult,
        createdAt: new Date().toISOString()
      };
      
      const result = await firebaseService.createSeed(seedData);
      setSavedSeeds(prev => [result, ...prev]);
      
      // Reset form
      setImageUrl(null);
      setAnalysisResult(null);
    } catch (error) {
      console.error('Error saving seed analysis:', error);
    } finally {
      setUploading(false);
    }
  };

  // Load saved seeds on initial render
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

  return (
    <Box component="main" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom className="u-font-weight-semibold u-text-green-primary">
        Identificador de Semillas con IA
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Upload Section */}
        <Box xs={12} sm={6} md={4}>
          <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
            <CardHeader
              title="Subir Imagen"
              subheader="Arrastra y suelta o haz clic para seleccionar"
              className="u-bg-green-primary-light u-text-green-primary-dark"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CloudUpload fontSize="large" color="primary" />
              </Box>
            </CardHeader>
            <CardContent>
              <Stack spacing={2} alignItems="center">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="seed-image-upload"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="seed-image-upload"
                  variant="contained"
                  color="primary"
                  size="medium"
                  className="u-cursor-pointer u-transition-normal"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'var(--green-primary-light)',
                    }
                  }}
                >
                  Seleccionar Imagen
                </label>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => {
                    // Trigger file input
                    document.getElementById('seed-image-upload')?.click();
                  }}
                >
                  o arrastrar aquí
                </Button>
                <Typography variant="caption" color="text.secondary" align="center">
                  Formatos soportados: JPG, PNG (máx. 5MB)
                </Typography>
              </Stack>
              
              {imageUrl && (
                <Box mt={3} textAlign="center">
                  <img 
                    src={imageUrl} 
                    alt="Semilla subida" 
                    sx={{ maxWidth: '100%', maxHeight: 200, borderRadius: 'var(--radius-md)' }}
                  />
                </Box>
              )}
              
              {loading && !imageUrl && (
                <Box mt={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.primary">Analizando imagen...</Typography>
                  &nbsp;
                  <Box sx={{ width: 20, height: 20, borderColor: 'var(--green-primary)', borderStyle: 'solid', borderWidth: '2px', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
        
        {/* Results Section */}
        <Box xs={12} sm={6} md={8}>
          {analysisResult ? (
            <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
              <CardHeader
                title="Resultado del Análisis"
                subheader="Identificación completada"
                className="u-bg-green-primary-light u-text-green-primary-dark"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Analytics fontSize="large" color="primary" />
                </Box>
              </CardHeader>
              <CardContent>
                <Stack spacing={3}>
                  <Box textAlign="center">
                    <Typography variant="h3" className="u-font-weight-bold u-text-green-primary">
                      {analysisResult.seedType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {analysisResult.variety}
                    </Typography>
                    <Box mt={2}>
                      <div className="u-bg-green-primary-lighter u-rounded-sm" style={{ height: 10 }}>
                        <div 
                          className="u-bg-green-primary u-rounded-sm" 
                          style={{ width: `${analysisResult.confidence}%`, height: '100%' }}
                        ></div>
                      </div>
                    </Box>
                    <Typography variant="caption" color="text.secondary" mt={1}>
                      Confianza: {analysisResult.confidence}%
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h5" className="u-font-weight-semibold u-text-brown-primary">
                    Características Identificadas
                  </Typography>
                  <Stack spacing={1}>
                    {analysisResult.characteristics.map((char: string, index: number) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.primary" sx={{ width: 20 }}>
                          •
                        </Typography>
                        <Typography variant="body1" color="text.primary" sx={{ flex: 1 }}>
                          {char}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h5" className="u-font-weight-semibold u-text-brown-primary">
                    Recomendaciones
                  </Typography>
                  <Stack spacing={1}>
                    {analysisResult.recommendations.map((rec: string, index: number) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Typography variant="body2" color="text.primary" sx={{ width: 20 }}>
                          •
                        </Typography>
                        <Typography variant="body1" color="text.primary" sx={{ flex: 1 }}>
                          {rec}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                  
                  <Box mt={3} textAlign="center">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="medium"
                      startIcon={<SaveAlt fontSize="inherit" />}
                      onClick={saveSeedAnalysis}
                      disabled={uploading || !analysisResult}
                    >
                      {uploading ? 'Guardando...' : 'Guardar en Biblioteca'}
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      size="medium"
                      startIcon={<PhotoCamera fontSize="inherit" />}
                      onClick={() => {
                        setImageUrl(null);
                        setAnalysisResult(null);
                      }}
                    >
                      Nueva Análisis
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
              <CardHeader
                title="Espera tu resultado"
                subheader="Sube una imagen de semilla para comenzar el análisis"
                className="u-bg-green-primary-light u-text-green-primary-dark"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhotoCamera fontSize="large" color="primary" />
                </Box>
              </CardHeader>
              <CardContent>
                <Box textAlign="center" py={4}>
                  <Typography variant="h5" color="text.secondary">
                    Ninguna imagen analizada aún
                  </Typography>
                  <Box mt={3}>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                      Utiliza nuestra IA avanzada para identificar variedades de semillas a partir de imágenes. 
                      Simplemente sube una foto clara de la semilla y nuestro sistema te proporcionará:
                    </Typography>
                  </Box>
                  <Box mt={3} textAlign="left" sx={{ maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>
                    <Typography variant="body2" color="text.primary">
                      • Identificación precisa de variedad y especie
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      • Análisis de características agronómicas
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      • Recomendaciones de cultivo personalizadas
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      • Estimación de requisitos de agua y nutrientes
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
      
      {/* Saved Seeds Section */}
      {savedSeeds.length > 0 && (
        <Box mt={6}>
          <Typography variant="h5" className="u-font-weight-semibold u-text-green-primary mb">
            Semillas Analizadas Guardadas
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Variedad</TableCell>
                  <TableCell>Confianza</TableCell>
                  <TableCell>Fecha de Análisis</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedSeeds.map((seed: any) => (
                  <TableRow key={seed.id}>
                    <TableCell>{seed.seedType}</TableCell>
                    <TableCell>{seed.variety}</TableCell>
                    <TableCell>{seed.confidence}%</TableCell>
                    <TableCell>{new Date(seed.analyzedAt || seed.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="small"
                        startIcon={<Analytics fontSize="inherit" />}
                      >
                        Ver Detalles
                      </Button>
                    </TableCell>
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