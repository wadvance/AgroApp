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
  const [messages, setMessages] = React.useState<any[]>([
    { id: 1, text: 'PRUEBA-USUARIO', sender: 'user', timestamp: new Date() },
    { id: 2, text: 'PRUEBA-BOT', sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

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
    if (!messageText) setInput('');
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const botMessage = {
        id: Date.now() + 1,
        text: 'Respuesta prueba - hola mundo',
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
              <Box sx={{ display: 'flex', flexDirection: 'column-reverse', overflowY: 'auto', flex: 1 }}>
                {messages.map((msg: any) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={msg.id} style={{ display: 'flex', marginBottom: '16px', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '80%', padding: '12px', borderRadius: '12px', backgroundColor: isUser ? '#2E7D32' : '#CCCCCC', color: isUser ? '#FFFFFF' : '#000000', fontSize: '16px', fontFamily: 'Arial, sans-serif' }}>
                        <div>{msg.text}</div>
                        <div style={{ fontSize: '10px', marginTop: '4px', textAlign: 'right', color: isUser ? 'rgba(255,255,255,0.7)' : '#666666' }}>
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