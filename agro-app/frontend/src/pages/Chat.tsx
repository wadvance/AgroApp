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
} from '@mui/material';
import { Chat as ChatIcon, LocalFlorist, Agriculture, Send, Calculate, Cloud } from '@mui/icons-material';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
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
      // Simulate API call to AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock AI response based on keywords in user message
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
    
    // Simple keyword-based responses (in a real app, this would be a proper AI model)
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
    
    // Default response
    return 'Gracias por su consulta. Para brindarle una recomendación más precisa y personalizada, ¿podría proporcionarme más detalles sobre su cultivo específico, incluyendo tipo de planta, etapa de crecimiento, ubicación geográfica y cualquier problema particular que esté experimentando?';
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Box component="main" sx={{ p: 3, display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Sidebar with quick actions */}
      <Box sx={{ width: 280, borderRight: '1px solid var(--border-primary)', p: 2 }}>
        <Typography variant="h5" className="u-font-weight-semibold u-text-green-primary mb">
          AgroAsistente IA
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Su agrónomo virtual disponible 24/7
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" className="u-font-weight-semibold u-text-brown-primary mb">
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
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" className="u-font-weight-semibold u-text-brown-primary mb">
            Información
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'var(--green-primary)', ml: -2 }}>
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
      
      {/* Main chat area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Card className="u-bg-card u-shadow-sm">
          <CardHeader
            title="Conversación con AgroAsistente IA"
            subheader="Escriba su consulta agrícola abajo"
            className="u-bg-green-primary-light u-text-green-primary-dark"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ChatIcon fontSize="large" color="primary" />
            </Box>
          </CardHeader>
          <CardContent sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column-reverse' }}>
              {messages.map((msg: any) => (
                <Box 
                  key={msg.id} 
                  sx={{ 
                    display: 'flex', 
                    marginBottom: 2, 
                    alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' 
                  }}
                >
                  <Box 
                    sx={{ 
                      maxWidth: '70%', 
                      padding: 1, 
                      borderRadius: msg.sender === 'user' ? 'var(--radius-lg) var(--radius-lg) 0 var(--radius-lg)' : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 0',
                      backgroundColor: msg.sender === 'user' ? 'var(--green-primary-light)' : 'var(--bg-card)',
                      color: msg.sender === 'user' ? 'var(--green-primary-dark)' : 'var(--text-primary)'
                    }}
                  >
                    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                      {msg.text}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  </Box>
                  {msg.sender === 'bot' && (
                    <Box sx={{ ml: 2, mt: -1 }}>
                      <Avatar sx={{ bgcolor: 'var(--green-primary)', width: 28, height: 28 }}>
                        IA
                      </Avatar>
                    </Box>
                  )}
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
          </CardContent>
          <Box sx={{ p: 2, borderTop: '1px solid var(--border-primary)' }}>
            <Stack direction="row" spacing={1}>
              <TextField
                label="Escribe tu consulta agrícola..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ flex: 1 }}
                disabled={loading}
                placeholder="Ej: ¿Cuándo debo aplicar fertilizante nitrogenado a mi maíz?"
              />
              <Button 
                variant="contained" 
                color="primary" 
                size="medium"
                startIcon={<Send fontSize="inherit" />}
                onClick={sendMessage}
                disabled={loading || !input.trim()}
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </Button>
            </Stack>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default ChatPage;