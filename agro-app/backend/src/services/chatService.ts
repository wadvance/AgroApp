import Chat from '../models/Chat';

export class ChatService {
  // Get all chat records
  static async getAllChats() {
    return await Chat.find().sort({ timestamp: -1 });
  }

  // Get chat by ID
  static async getChatById(id: string) {
    return await Chat.findById(id);
  }

  // Create a new chat record
  static async createChat(chatData: any) {
    const chat = new Chat(chatData);
    return await chat.save();
  }

  // Update chat by ID
  static async updateChat(id: string, chatData: any) {
    return await Chat.findByIdAndUpdate(id, chatData, { new: true });
  }

  // Delete chat by ID
  static async deleteChat(id: string) {
    return await Chat.findByIdAndDelete(id);
  }

  // Get chats by user ID
  static async getChatsByUserId(userId: string) {
    return await Chat.find({ userId }).sort({ timestamp: -1 });
  }

  // Create a new chat message and get AI response
  static async sendMessage(userId: string, message: string) {
    // In a real application, this would integrate with an AI service
    // For now, we'll simulate a response
    let response = '';
    
    // Simple keyword-based responses for demonstration
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('seed') || lowerMessage.includes('semilla')) {
      response = 'Para identificar semillas, necesitas proporcionar una imagen clara de la semilla. Nuestra IA puede ayudarte a identificarla basado en sus características morfológicas como forma, tamaño, color y textura.';
    } else if (lowerMessage.includes('disease') || lowerMessage.includes('enfermedad') || lowerMessage.includes('plaga')) {
      response = 'Para diagnosticar enfermedades en plantas, es importante observar los síntomas específicos como manchas en las hojas, decoloración, deformaciones o presencia de insectos. Puedes subir una foto de la planta afectada para un análisis más preciso.';
    } else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('fertilizante') || lowerMessage.includes('nutriente')) {
      response = 'La elección del fertilizante depende del tipo de cultivo, el estado del suelo y la etapa de crecimiento. Un análisis de suelo te ayudará a determinar qué nutrientes faltan y en qué cantidades.';
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('clima') || lowerMessage.includes('tiempo')) {
      response = 'El clima afecta significativamente el crecimiento de los cultivos. Factores como temperatura, precipitación, humedad y radiación solar son cruciales para planificar siembras, riegos y cosechas.';
    } else if (lowerMessage.includes('harvest') || lowerMessage.includes('cosecha')) {
      response = 'Para estimar tu cosecha, necesitas conocer el tipo de cultivo, el área sembrada y las condiciones de crecimiento. Nuestro calculador de cosecha puede ayudarte a estimar el rendimiento esperado basado en estos factores.';
    } else {
      response = 'Hola! Soy tu asistente de agroicultura. Puedo ayudarte con identificación de semillas, diagnóstico de enfermedades, recomendaciones de fertilizantes, información climática y cálculos de cosecha. ¿En qué puedo ayudarte hoy?';
    }
    
    // Save the chat interaction
    const chatData = {
      userId,
      message,
      response,
      timestamp: new Date()
    };
    
    const chat = new Chat(chatData);
    await chat.save();
    
    return response;
  }
}
