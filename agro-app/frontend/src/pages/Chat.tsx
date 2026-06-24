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
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const botMessage = {
        id: Date.now() + 1,
        text: generateAIResponse(textToSend),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Lo siento, hubo un error procesando su consulta.',
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
            onClick={() => sendMessage('¿Qué variedad de semilla es mejor para mi zona?')}
          >
            Semillas
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            startIcon={<Agriculture fontSize="inherit" />}
            onClick={() => sendMessage('¿Cómo detecto tempranamente enfermedades en mi cultivo?')}
          >
            Diagnóstico
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            startIcon={<Calculate fontSize="inherit" />}
            onClick={() => sendMessage('¿Cómo calculo el rendimiento esperado de mi cultivo?')}
          >
            Cálculo
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            startIcon={<Cloud fontSize="inherit" />}
            onClick={() => sendMessage('¿Cuál es el pronóstico del tiempo para los próximos días?')}
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
      <Box sx={{ display: { xs: 'none', md: 'block' }, width: SIDEBAR_WIDTH, borderRight: '1px solid var(--border-primary)' }}>
        {sidebarContent}
      </Box>

      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        {sidebarContent}
      </Drawer>
      
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
            <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1, mb: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Chip icon={<LocalFlorist />} label="Semillas" size="small" onClick={() => sendMessage('¿Qué variedad de semilla es mejor para mi zona?')} variant="outlined" color="primary" />
              <Chip icon={<Agriculture />} label="Diagnóstico" size="small" onClick={() => sendMessage('¿Cómo detecto tempranamente enfermedades en mi cultivo?')} variant="outlined" color="primary" />
              <Chip icon={<Calculate />} label="Cálculo" size="small" onClick={() => sendMessage('¿Cómo calculo el rendimiento esperado de mi cultivo?')} variant="outlined" color="primary" />
              <Chip icon={<Cloud />} label="Clima" size="small" onClick={() => sendMessage('¿Cuál es el pronóstico del tiempo para los próximos días?')} variant="outlined" color="primary" />
            </Box>
            {messages.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Seleccione una consulta rápida o escriba su consulta abajo.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
                {messages.map((msg: any) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={msg.id} style={{ display: 'flex', marginBottom: '16px', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '80%', padding: '12px', borderRadius: '12px', backgroundColor: isUser ? '#2E7D32' : '#FFFFFF', color: isUser ? '#FFFFFF' : '#000000', fontSize: '24px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', border: isUser ? 'none' : '2px solid #000000', WebkitTextFillColor: isUser ? '#FFFFFF' : '#000000', opacity: 1 }}>
                        <div>{msg.text}</div>
                        <div style={{ fontSize: '10px', marginTop: '4px', textAlign: 'right', color: isUser ? 'rgba(255,255,255,0.7)' : '#666666', WebkitTextFillColor: isUser ? 'rgba(255,255,255,0.7)' : '#666666' }}>
                          {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography color="text.primary">Pensando...</Typography>
                      &nbsp;
                      <Box sx={{ width: 20, height: 20, borderColor: 'var(--green-primary)', borderStyle: 'solid', borderWidth: '2px', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    </Box>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>
            )}
          </CardContent>
          <Box sx={{ p: { xs: 1.5, sm: 2 }, borderTop: '1px solid var(--border-primary)' }}>
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
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                sx={{ minWidth: { xs: 40, sm: 120 }, py: 0.75, px: { xs: 1, sm: 1.5 }, textTransform: 'none' }}
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