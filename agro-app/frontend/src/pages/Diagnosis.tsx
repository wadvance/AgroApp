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
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Analytics, PhotoCamera, Agriculture, ErrorOutline, CheckCircle, WarningAmber, SaveAlt } from '@mui/icons-material';
import { firebaseService } from '../firebase';

const Diagnosis: React.FC = () => {
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [savedDiagnoses, setSavedDiagnoses] = React.useState<any[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    
    try {
      // Upload image to Firebase Storage
      const imagePath = `diagnosis_images/${Date.now()}_${file.name}`;
      const downloadUrl = await firebaseService.uploadFile(file, imagePath);
      setImageUrl(downloadUrl);
      
      // Simulate API call for AI diagnosis
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock diagnosis result - sometimes healthy, sometimes with disease
      const isHealthy = Math.random() > 0.3; // 70% chance of healthy
      
      if (isHealthy) {
        setDiagnosisResult({
          status: 'healthy',
          plantType: 'Maíz',
          confidence: 96,
          details: 'La planta muestra características saludables típicas de maíz en etapa V6.',
          recommendations: [
            'Continuar con el régimen actual de riego y fertilización',
            'Monitorear aparición de enfermedades foliares',
            'Aplicar fertilizante nitrogenado en etapas críticas'
          ],
          imageUrl: downloadUrl,
          diagnosedAt: new Date().toISOString()
        });
      } else {
        // Mock disease
        const diseases = [
          {
            name: 'Royuela común',
            scientificName: 'Puccinia sorghi',
            severity: 'Moderada',
            confidence: 87,
            symptoms: ['Pustulas pardo-anaranjadas en hojas', 'Clorosis en áreas afectadas'],
            treatment: ['Aplicar fungicida triazol', 'Mejorar drenaje', 'Rotar con no hospederos']
          },
          {
            name: 'Tizón tardío',
            scientificName: 'Phytophthora infestans',
            severity: 'Severa',
            confidence: 92,
            symptoms: ['Lesiones acuosas en hojas', 'Desecación rápida de tejidos'],
            treatment: ['Aplicar fungicida fosetílico', 'Eliminar plantas afectadas', 'Evitar riego por aspersion']
          },
          {
            name: 'Complexo de virus del enanismo',
            scientificName: 'Various viruses',
            severity: 'Leve',
            confidence: 78,
            symptoms: ['Enanismo de plantas', 'Clorosis interveinal', 'Reducción del vigor'],
            treatment: ['Controlar vectores (pulgones, mosca blanca)', 'Usar semillas certificadas', 'Eliminar malezas hospederas']
          }
        ];
        
        const selectedDisease = diseases[Math.floor(Math.random() * diseases.length)];
        
        setDiagnosisResult({
          status: 'diseased',
          plantType: 'Maíz',
          disease: selectedDisease.name,
          scientificName: selectedDisease.scientificName,
          severity: selectedDisease.severity,
          confidence: selectedDisease.confidence,
          symptoms: selectedDisease.symptoms,
          treatment: selectedDisease.treatment,
          details: `Se detectó presencia de ${selectedDisease.name} con ${selectedDisease.confidence}% de confianza.`,
          recommendations: [
            ...selectedDisease.treatment,
            'Aislar área afectada para prevenir propagación',
            'Consultar con extensionista local para tratamiento específico'
          ],
          imageUrl: downloadUrl,
          diagnosedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error diagnosing plant image:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDiagnosis = async () => {
    if (!diagnosisResult) return;
    
    setUploading(true);
    try {
      const diagnosisData = {
        ...diagnosisResult,
        createdAt: new Date().toISOString()
      };
      
      const result = await firebaseService.createDiagnosis(diagnosisData);
      setSavedDiagnoses(prev => [result, ...prev]);
      
      // Reset form
      setImageUrl(null);
      setDiagnosisResult(null);
    } catch (error) {
      console.error('Error saving diagnosis:', error);
    } finally {
      setUploading(false);
    }
  };

  // Load saved diagnoses on initial render
  React.useEffect(() => {
    const loadSavedDiagnoses = async () => {
      try {
        const diagnoses = await firebaseService.getDiagnoses();
        setSavedDiagnoses(diagnoses);
      } catch (error) {
        console.error('Error loading diagnoses:', error);
      }
    };
    
    loadSavedDiagnoses();
  }, []);

  return (
    <Box component="main" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom className="u-font-weight-semibold u-text-green-primary">
        Diagnóstico de Cultivos con IA
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Upload Section */}
        <Box xs={12} sm={6} md={4}>
          <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
            <CardHeader
              title="Subir Imagen de Planta"
              subheader="Foto clara de hojas, tallos o frutos"
              className="u-bg-green-primary-light u-text-green-primary-dark"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhotoCamera fontSize="large" color="primary" />
              </Box>
            </CardHeader>
            <CardContent>
              <Stack spacing={2} alignItems="center">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="plant-image-upload"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="plant-image-upload"
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
                    document.getElementById('plant-image-upload')?.click();
                  }}
                >
                  o arrastrar aquí
                </Button>
                <Typography variant="caption" color="text.secondary" align="center">
                  Formatos: JPG, PNG (máx. 5MB)
                </Typography>
              </Stack>
              
              {imageUrl && (
                <Box mt={3} textAlign="center">
                  <img 
                    src={imageUrl} 
                    alt="Planta subida" 
                    sx={{ maxWidth: '100%', maxHeight: 200, borderRadius: 'var(--radius-md)' }}
                  />
                </Box>
              )}
              
              {loading && !imageUrl && (
                <Box mt={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.primary">Analizando planta...</Typography>
                  &nbsp;
                  <Box sx={{ width: 20, height: 20, borderColor: 'var(--green-primary)', borderStyle: 'solid', borderWidth: '2px', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
        
        {/* Results Section */}
        <Box xs={12} sm={6} md={8}>
          {diagnosisResult ? (
            <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
              <CardHeader
                title={diagnosisResult.status === 'healthy' ? 'Planta Saludable' : 'Enfermedad Detectada'}
                subheader={diagnosisResult.status === 'healthy' 
                  ? 'No se detectaron patologías significativas' 
                  : `Enfermedad: ${diagnosisResult.disease}`}
                className={diagnosisResult.status === 'healthy' 
                  ? 'u-bg-green-primary-light u-text-green-primary-dark' 
                  : 'u-bg-red-light u-text-red-dark'}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {diagnosisResult.status === 'healthy' ? (
                    <CheckCircle fontSize="large" color="success" />
                  ) : (
                    <ErrorOutline fontSize="large" color="error" />
                  )}
                </Box>
              </CardHeader>
              <CardContent>
                <Stack spacing={3}>
                  <Box textAlign="center">
                    <Typography variant="h3" className="u-font-weight-bold">
                      {diagnosisResult.plantType}
                    </Typography>
                    {diagnosisResult.status === 'healthy' && (
                      <>
                        <Typography variant="h2" className="u-text-success u-font-weight-bold">
                          {diagnosisResult.confidence}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary" mt={1}>
                          Confianza de salud
                        </Typography>
                      </>
                    )}
                    {diagnosisResult.status === 'diseased' && (
                      <>
                        <Typography variant="h2" className="u-text-error u-font-weight-bold">
                          {diagnosisResult.confidence}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary" mt={1}>
                          Confianza de detección
                        </Typography>
                        <Box mt={2}>
                          <Chip 
                            label={diagnosisResult.severity} 
                            color={diagnosisResult.severity === 'Leve' ? 'success' : diagnosisResult.severity === 'Moderada' ? 'warning' : 'error'}
                            size="small"
                          />
                        </Box>
                      </>
                    )}
                  </Box>
                  
                  {diagnosisResult.status === 'diseased' && (
                    <>
                      <Divider sx={{ my: 3 }} />
                      
                      <Typography variant="h5" className="u-font-weight-semibold u-text-brown-primary">
                        Información de la Enfermedad
                      </Typography>
                      <Stack spacing={1}>
                        <div className="u-flex u-justify-between">
                          <Typography variant="body2" color="text.primary">
                            Nombre científico:
                          </Typography>
                          <Typography variant="body1" color="text.primary">
                            {diagnosisResult.scientificName}
                          </Typography>
                        </div>
                        <div className="u-flex u-justify-between">
                          <Typography variant="body2" color="text.primary">
                            Síntomas observados:
                          </Typography>
                          <Typography variant="body1" color="text.primary">
                            {diagnosisResult.symptoms.join(', ')}
                          </Typography>
                        </div>
                      </Stack>
                    </>
                  )}
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h5" className="u-font-weight-semibold u-text-brown-primary">
                    Recomendaciones de Manejo
                  </Typography>
                  <Stack spacing={1}>
                    {diagnosisResult.recommendations.map((rec: string, index: number) => (
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
                      color={diagnosisResult.status === 'healthy' ? 'success' : 'error'} 
                      size="medium"
                      startIcon={<Agriculture fontSize="inherit" />}
                      onClick={saveDiagnosis}
                      disabled={uploading || !diagnosisResult}
                    >
                      {uploading ? 'Guardando...' : 
                        diagnosisResult.status === 'healthy' ? 'Confirmar Salud' : 'Iniciar Tratamiento'}
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      size="medium"
                      startIcon={<PhotoCamera fontSize="inherit" />}
                      onClick={() => {
                        setImageUrl(null);
                        setDiagnosisResult(null);
                      }}
                    >
                      Nueva Evaluación
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
              <CardHeader
                title="Espera tu diagnóstico"
                subheader="Sube una imagen de planta para comenzar el análisis"
                className="u-bg-green-primary-light u-text-green-primary-dark"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Agriculture fontSize="large" color="primary" />
                </Box>
              </CardHeader>
              <CardContent>
                <Box textAlign="center" py={4}>
                  <Typography variant="h5" color="text.secondary">
                    Ninguna imagen analizada aún
                  </Typography>
                  <Box mt={3}>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                      Utiliza nuestra tecnología de visión por computadora para detectar enfermedades, 
                      plagas y deficiencias nutricionales en tus cultivos. Simplemente toma una foto 
                      de las áreas afectadas y nuestro sistema te proporcionará un diagnóstico preciso.
                    </Typography>
                  </Box>
                  <Box mt={3} textAlign="left" sx={{ maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>
                    <Typography variant="body2" color="text.primary">
                      • Detección temprana de enfermedades fúngicas, bacterianas y virales
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      • Identificación de plagas insectiles y ácaros
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      • Diagnóstico de deficiencias y excesos nutricionales
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      • Recomendaciones de manejo integrado de plagas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
      
      {/* Saved Diagnoses Section */}
      {savedDiagnoses.length > 0 && (
        <Box mt={6}>
          <Typography variant="h5" className="u-font-weight-semibold u-text-green-primary mb">
            Diagnósticos Guardados
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo de Planta</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Confianza</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedDiagnoses.map((diag: any) => (
                  <TableRow key={diag.id}>
                    <TableCell>{diag.plantType}</TableCell>
                    <TableCell>
                      {diag.status === 'healthy' ? 'Saludable' : `Enfermo: ${diag.disease || 'N/A'`}
                      </TableCell>
                    <TableCell>{diag.confidence}%</TableCell>
                    <TableCell>{new Date(diag.diagnosedAt || diag.createdAt).toLocaleDateString()}</TableCell>
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

export default Diagnosis;