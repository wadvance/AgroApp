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
  Paper,
  Chip,
  Alert,
  WarningAmber,
} from '@mui/material';
import { Calculate, LocalFlorist, Agriculture, MonetizationOn, TrendsUp, TrendsDown, SaveAlt } from '@mui/icons-material';

const Calculator: React.FC = () => {
  const [cropType, setCropType] = React.useState('maiz');
  const [area, setArea] = React.useState('');
  const [expectedYield, setExpectedYield] = React.useState('');
  const [marketPrice, setMarketPrice] = React.useState('');
  const [calculationResult, setCalculationResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const calculateYield = async () => {
    if (!area || !expectedYield || !marketPrice) {
      // Show error - all fields required
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const areaNum = parseFloat(area);
      const yieldNum = parseFloat(expectedYield);
      const priceNum = parseFloat(marketPrice);
      
      if (isNaN(areaNum) || isNaN(yieldNum) || isNaN(priceNum)) {
        setCalculationResult({ error: 'Por favor ingrese valores numéricos válidos' });
        setLoading(false);
        return;
      }
      
      // Calculate based on inputs
      const totalProduction = areaNum * yieldNum; // kg
      const totalRevenue = totalProduction * (priceNum / 1000); // Assuming price is per ton
      
      // Mock cost breakdown (would come from database/API in real app)
      const costPerHectare = {
        maiz: 350,
        trigo: 300,
        soja: 280,
        arroz: 420,
        girasol: 320,
        alfalfa: 250
      }[cropType] || 300;
      
      const totalCost = areaNum * costPerHectare;
      const netProfit = totalRevenue - totalCost;
      const roi = (netProfit / totalCost) * 100;
      const breakEvenYield = (totalCost * 1000) / (areaNum * priceNum);
      
      setCalculationResult({
        area: areaNum,
        expectedYield: yieldNum,
        marketPrice: priceNum,
        totalProduction: totalProduction,
        totalRevenue: totalRevenue,
        totalCost: totalCost,
        netProfit: netProfit,
        roi: roi,
        breakEvenYield: breakEvenYield,
        costPerHectare: costPerHectare
      });
    } catch (error) {
      console.error('Error calculating yield:', error);
      setCalculationResult({ error: 'Error en el cálculo. Por favor intente nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="main" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom className="u-font-weight-semibold u-text-green-primary">
        Calculadora de Rendimiento Económico
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Input Section */}
        <Box xs={12} sm={6} md={4}>
          <Card className="u-bg-card u-shadow-sm u-transition-normal">
            <CardHeader
              title="Parámetros de Cálculo"
              className="u-bg-green-primary-light u-text-green-primary-dark"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calculate fontSize="large" color="primary" />
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
                    label="Tipo de Cultivo"
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
                    <MenuItem value="girasol">
                      Girasol
                    </MenuItem>
                    <MenuItem value="alfalfa">
                      Alfalfa
                    </MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="area-label">Área Cultivada (ha)</InputLabel>
                  <TextField
                    label="Área Cultivada (ha)"
                    type="number"
                    inputProps={{ min: 0.1, step: 0.1 }}
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="yield-label">Rendimiento Esperado (kg/ha)</InputLabel>
                  <TextField
                    label="Rendimiento Esperado (kg/ha)"
                    type="number"
                    inputProps={{ min: 100, step: 10 }}
                    value={expectedYield}
                    onChange={(e) => setExpectedYield(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="price-label">Precio de Mercado ($/ton)</InputLabel>
                  <TextField
                    label="Precio de Mercado ($/ton)"
                    type="number"
                    inputProps={{ min: 100, step: 10 }}
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </Stack>
              
              <Box mt={3} textAlign="center">
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="medium"
                  startIcon={<MonetizationOn fontSize="inherit" />}
                  onClick={calculateYield}
                  disabled={loading}
                >
                  {loading ? 'Calculando...' : 'Calcular Rendimiento'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        {/* Results Section */}
        <Box xs={12} sm={6} md={8}>
          {calculationResult ? (
            calculationResult.error ? (
              <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
                <CardHeader
                  title="Error en el Cálculo"
                  className="u-bg-red-light u-text-red-dark"
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningAmber fontSize="large" color="error" />
                  </Box>
                </CardHeader>
                <CardContent>
                  <Box textAlign="center" py={4}>
                    <Typography variant="h5" color="text.error">
                      {calculationResult.error}
                    </Typography>
                    <Box mt={3}>
                      <Button 
                        variant="outlined" 
                        color="secondary" 
                        size="medium"
                        startIcon={<Refresh fontSize="inherit" />}
                      >
                        Intentar Nuevamente
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
                <CardHeader
                  title="Resultados del Cálculo"
                  subheader={`Análisis económico para ${cropType}`}
                  className="u-bg-green-primary-light u-text-green-primary-dark"
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MonetizationOn fontSize="large" color="primary" />
                  </Box>
                </CardHeader>
                <CardContent>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h5" className="u-font-weight-semibold u-text-brown-primary">
                        Resumen de Producción
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>Área Cultivada</TableCell>
                              <TableCell align="right">{calculationResult.area.toFixed(2)} ha</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Rendimiento Esperado</TableCell>
                              <TableCell align="right">{calculationResult.expectedYield.toFixed(2)} kg/ha</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Producción Total Estimada</TableCell>
                              <TableCell align="right">
                                {calculationResult.totalProduction.toFixed(0)} kg
                                <br />
                                <Typography variant="body2" color="text.secondary">
                                  ({(calculationResult.totalProduction / 1000).toFixed(2)} toneladas)
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Box>
                      <Typography variant="h5" className="u-font-weight-semibold u-text-brown-primary">
                        Análisis Económico
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>Precio de Mercado</TableCell>
                              <TableCell align="right">
                                ${calculationResult.marketPrice.toFixed(2)} / tonelada
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Ingresos Brutos Estimados</TableCell>
                              <TableCell align="right">
                                ${calculationResult.totalRevenue.toFixed(2)}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Costos de Producción Estimados</TableCell>
                              <TableCell align="right">
                                ${calculationResult.totalCost.toFixed(2)}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Utilidad Neta Estimada</TableCell>
                              <TableCell align="right" sx={{ color: calculationResult.netProfit >= 0 ? 'success' : 'error' }}>
                                ${calculationResult.netProfit.toFixed(2)}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Retorno sobre Inversión (ROI)</TableCell>
                              <TableCell align="right" sx={{ color: calculationResult.roi >= 0 ? 'success' : 'error' }}>
                                {calculationResult.roi.toFixed(2)}%
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Punto de Equilibrio (Rendimiento)</TableCell>
                              <TableCell align="right">
                                {calculationResult.breakEvenYield.toFixed(2)} kg/ha
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Box>
                      <Typography variant="h5" className="u-font-weight-semibold u-text-brown-primary">
                        Sensibilidad al Rendimiento
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        Variación del ingreso neto según cambios en el rendimiento
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Rendimiento (kg/ha)</TableCell>
                              <TableCell align="center">Producción (kg)</TableCell>
                              <TableCell align="center">Ingresos ($)</TableCell>
                              <TableCell align="center">Utilidad Neta ($)</TableCell>
                              <TableCell align="center">ROI (%)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {[0.8, 0.9, 1.0, 1.1, 1.2].map((factor, index) => {
                              const adjustedYield = calculationResult.expectedYield * factor;
                              const adjustedProduction = calculationResult.area * adjustedYield;
                              const adjustedRevenue = adjustedProduction * (calculationResult.marketPrice / 1000);
                              const adjustedNetProfit = adjustedRevenue - calculationResult.totalCost;
                              const adjustedRoi = (adjustedNetProfit / calculationResult.totalCost) * 100;
                              
                              return (
                                <TableRow key={index}>
                                  <TableCell>{adjustedYield.toFixed(1)}</TableCell>
                                  <TableCell align="center">{adjustedProduction.toFixed(0)}</TableCell>
                                  <TableCell align="center">${adjustedRevenue.toFixed(2)}</TableCell>
                                  <TableCell align="center" sx={{ color: adjustedNetProfit >= 0 ? 'success' : 'error' }}>
                                    ${adjustedNetProfit.toFixed(2)}
                                  </TableCell>
                                  <TableCell align="center" sx={{ color: adjustedRoi >= 0 ? 'success' : 'error' }}>
                                    {adjustedRoi.toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                    
                    <Box mt={3} textAlign="center">
                      <Button 
                        variant="contained" 
                        color="success" 
                        size="medium"
                        startIcon={<SaveAlt fontSize="inherit" />}
                      >
                        Guardar Proyecto
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        size="medium"
                        startIcon={<LocalFlorist fontSize="inherit" />}
                      >
                        Nuevo Cálculo
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            )
          ) : (
            <Card className="u-bg-card u-shadow-sm u-transition-normal" sx={{ height: '100%' }}>
              <CardHeader
                title="Ingrese los parámetros para calcular"
                subheader="Complete los campos abaixo para obtener un análisis económico de su cultivo"
                className="u-bg-green-primary-light u-text-green-primary-dark"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Agriculture fontSize="large" color="primary" />
                </Box>
              </CardHeader>
              <CardContent>
                <Box textAlign="center" py={4}>
                  <Typography variant="h5" color="text.secondary">
                    Aún no se ha realizado ningún cálculo
                  </Typography>
                  <Box mt={3}>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
                      Complete el tipo de cultivo, área cultivada, rendimiento esperado y precio de mercado, 
                      luego haga clic en "Calcular Rendimiento" para obtener un análisis detallado de 
                      la viabilidad económica de su proyecto agrícola.
                    </Typography>
                  </Box>
                  <Box mt={3} textAlign="left" sx={{ maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
                    <Typography variant="body2" color="text.primary">
                      • Producción total estimada (kg y toneladas)
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      • Ingresos brutos basado en precio de mercado
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      • Costos de producción estimados por hectárea
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      • Utilidad neta y retorno sobre inversión (ROI)
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      • Análisis de sensibilidad a variaciones en rendimiento
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

export default Calculator;