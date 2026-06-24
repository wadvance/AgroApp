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
  Avatar,
  IconButton,
  Drawer,
  Chip,
} from '@mui/material';
import { LocalFlorist, Agriculture, Send, Calculate, Cloud, Menu as MenuIcon } from '@mui/icons-material';

const SIDEBAR_WIDTH = 280;

const ChatPage: React.FC = () => {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const aiResponse = generateAIResponse(input);
      const botMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Lo siento, hubo un error procesando su consulta. Por favor intente nuevamente.',
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('hola') || lowerMsg.includes('buenos días') || lowerMsg.includes('buenas tardes') || lowerMsg.includes('buenas noches')) {
      return '¡Hola! Soy su agrónomo virtual. ¿En qué puedo ayudarle hoy con su cultivo?';
    }
    
    if (lowerMsg.includes('riego') || lowerMsg.includes('agua') || lowerMsg.includes('irrigar')) {
      return 'Para determinar las necesidades de riego de su cultivo, necesito saber: ¿Qué tipo de cultivo tiene? ¿En qué etapa de crecimiento se encuentra? ¿Cuál es el tipo de suelo de su campo? Con esta información puedo calcular sus necesidades hídricas exactas.';
    }
    
    if (lowerMsg.includes('fertilizante') || lowerMsg.includes('nutriente') || lowerMsg.includes('nitrógeno') || lowerMsg.includes('fósforo') || lowerMsg.includes('potasio')) {
      return 'La fertilización adecuada depende del cultivo, etapa de crecimiento y análisis de suelo. ¿Podría proporcionarme esos detalles? También puedo ayudarle a interpretar resultados de análisis de suelo si los tiene disponibles.';
    }
    
    if (lowerMsg.includes('plaga') || lowerMsg.includes('enfermedad') || lowerMsg.includes('hongo') || lowerMsg.includes('virus') || lowerMsg.includes('insecto')) {
      return 'Para ayudarle con el diagnóstico de plagas o enfermedades, sería útil si pudiera describir los síntomas que observa o, mejor aún, compartir una imagen de las partes afectadas. ¿Qué cultivo tiene y qué síntomas está viendo?';
    }
    
    if (lowerMsg.includes('semilla') || lowerMsg.includes('variedad') || lowerMsg.includes('siembra')) {
      return 'La elección de la variedad de semilla adecuada es crucial para el éxito de su cultivo. Factores como el clima local, tipo de suelo, resistencia a enfermedades y ciclo de crecimiento deben considerarse. ¿Para qué cultivo está buscando recomendaciones de semilla?';
    }
    
    if (lowerMsg.includes('cosecha') || lowerMsg.includes('rendimiento') || lowerMsg.includes('producción')) {
      return 'Para estimar el rendimiento esperado de su cultivo, necesito conocer: el tipo de cultivo, área a sembrar, condiciones del suelo y historial de rendimientos en su zona. ¿Tiene esta información disponible?';
    }
    
    if (lowerMsg.includes('clima') || lowerMsg.includes('tiempo') || lowerMsg.includes('temperatura') || lowerMsg.includes('helada') || lowerMsg.includes('sequía')) {
      return 'El monitoreo climático es esencial para la toma de decisiones agrícolas. ¿Le gustaría que le proporcione el pronóstico del tiempo específico para su zona o información sobre cómo ciertas condiciones climáticas afectan su cultivo actual?';
    }
    
    return 'Gracias por su consulta. Para brindarle una recomendación más precisa y personalizada, ¿podría proporcionarme más detalles sobre su cultivo específico, incluyendo tipo de planta, etapa de crecimiento, ubicación geográfica y cualquier problema particular que esté experimentando?';
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const sidebarContent = (
    <Box sx={{ width: SIDEBAR_WIDTH, p: 2 }}>
      <Typography variant="h5" className="u-font-weight-semibold u-text-green-primary" sx={{ mb: 1 }}>
        AgroAsistente IA
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Su agrónomo virtual disponible 24/7
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" className="u-font-weight-semibold u-text-brown-primary" sx={{ mb: 1 }}>
          Consultas rápidas
        </Typography>
        <Stack spacing={1}>
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            startIcon={<LocalFlorist fontSize="inherit" />}
            onClick={() => {
              setInput('¿Qué variedad de semilla es mejor para mi zona?');
              sendMessage();
            }}
          >
            Semillas
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            startIcon={<Agriculture fontSize="inherit" />}
            onClick={() => {
              setInput('¿Cómo detecto tempranamente enfermedades en mi cultivo?');
              sendMessage();
            }}
          >
            Diagnóstico
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            startIcon={<Calculate fontSize="inherit" />}
            onClick={() => {
              setInput('¿Cómo calculo el rendimiento esperado de mi cultivo?');
              sendMessage();
            }}
          >
            Cálculo
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            startIcon={<Cloud fontSize="inherit" />}
            onClick={() => {
              setInput('¿Cuál es el pronóstico del tiempo para los próximos días?');
              sendMessage();
            }}
          >
            Clima
          </Button>
        </Stack>
      </Box>
      
      <Box>
        <Typography variant="h6" className="u-font-weight-semibold u-text-brown-primary" sx={{ mb: 1 }}>
          Información
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'var(--green-primary)' }}>
            IA
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
              AgroAsistente v1.0
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Modelo especializado en agricultura
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box component="main" sx={{ p: { xs: 1, sm: 2, md: 3 }, display: 'flex', height: 'calc(100vh - 64px)', gap: 2 }}>
      {/* Desktop sidebar */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, width: SIDEBAR_WIDTH, borderRight: '1px solid var(--border-primary)' }}>
        {sidebarContent}
      </Box>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        {sidebarContent}
      </Drawer>
      
      {/* Main chat area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Card className="u-bg-card u-shadow-sm" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  sx={{ display: { xs: 'inline-flex', md: 'none' }, mr: 0.5 }} 
                  onClick={() => setSidebarOpen(true)}
                  size="small"
                >
                  <MenuIcon />
                </IconButton>
                AgroAsistente IA
              </Box>
            }
            subheader="Escriba su consulta agrícola abajo"
            className="u-bg-green-primary-light"
            titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600, className: 'u-text-green-primary-dark' }}
          />
          <CardContent sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {messages.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Escriba una consulta agrícola o seleccione una consulta rápida del menú lateral.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column-reverse' }}>
                {messages.map((msg: any) => (
                  <Box 
                    key={msg.id} 
                    sx={{ 
                      display: 'flex', 
                      mb: 2, 
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-start',
                    }}
                  >
                    {msg.sender === 'bot' && (
                      <Avatar sx={{ bgcolor: 'var(--green-primary)', width: 28, height: 28, mr: 1, mt: 0.5, flexShrink: 0 }}>
                        IA
                      </Avatar>
                    )}
                    <Box 
                      sx={{ 
                        maxWidth: { xs: '85%', sm: '75%', md: '70%' }, 
                        p: 1.5, 
                        borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        backgroundColor: msg.sender === 'user' ? 'var(--green-primary)' : 'var(--gray-100)',
                        color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)'
                      }}
                    >
                      <Typography variant="body1" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                        {msg.text}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Typography variant="caption" sx={{ color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)' }}>
                          {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography color="text.primary">Pensando...</Typography>
                      &nbsp;
                      <Box sx={{ width: 20, height: 20, borderColor: 'var(--green-primary)', borderStyle: 'solid', borderWidth: '2px', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
          <Box sx={{ p: { xs: 1.5, sm: 2 }, borderTop: '1px solid var(--border-primary)' }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1, display: { xs: 'flex', md: 'none' }, overflowX: 'auto', pb: 0.5 }}>
              <Chip icon={<LocalFlorist />} label="Semillas" size="small" onClick={() => { setInput('¿Qué variedad de semilla es mejor para mi zona?'); setTimeout(sendMessage, 0); }} variant="outlined" color="primary" />
              <Chip icon={<Agriculture />} label="Diagnóstico" size="small" onClick={() => { setInput('¿Cómo detecto tempranamente enfermedades en mi cultivo?'); setTimeout(sendMessage, 0); }} variant="outlined" color="primary" />
              <Chip icon={<Calculate />} label="Cálculo" size="small" onClick={() => { setInput('¿Cómo calculo el rendimiento esperado de mi cultivo?'); setTimeout(sendMessage, 0); }} variant="outlined" color="primary" />
              <Chip icon={<Cloud />} label="Clima" size="small" onClick={() => { setInput('¿Cuál es el pronóstico del tiempo para los próximos días?'); setTimeout(sendMessage, 0); }} variant="outlined" color="primary" />
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Escribe tu consulta agrícola..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ flex: 1 }}
                disabled={loading}
                multiline
                maxRows={3}
              />
<Button 
  variant="contained" 
  color="primary" 
  size="medium"
  onClick={sendMessage}
  disabled={loading || !input.trim()}
  sx={{ 
    minWidth: { xs: 40, sm: 120 }, 
    py: 0.75, 
    px: { xs: 1, sm: 1.5 },
    textTransform: 'none'
  }}
>
  <Box component="span" sx={{ display: { xs: 'inline-block', sm: 'none' } }}>
    {loading ? '...' : <Send fontSize="small" />}
  </Box>
  <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
    <Send fontSize="inherit" />
    {loading ? 'Enviando...' : 'Enviar'}
  </Box>
</Button>
            </Stack>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default ChatPage;