import type { Request, Response } from 'express';
import { ChatService } from '../services/chatService.js';

export class ChatController {
  // Get all chat records
  static async getAllChats(req: Request, res: Response) {
    try {
      const chats = await ChatService.getAllChats();
      res.status(200).json(chats);
    } catch (error: any) {
      res.status(500).json({ message: 'Error retrieving chats', error: error.message });
    }
  }

  // Get chat by ID
  static async getChatById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const chat = await ChatService.getChatById(id);
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }
      res.status(200).json(chat);
    } catch (error: any) {
      res.status(500).json({ message: 'Error retrieving chat', error: error.message });
    }
  }

  // Create a new chat record
  static async createChat(req: Request, res: Response) {
    try {
      const chat = await ChatService.createChat(req.body);
      res.status(201).json(chat);
    } catch (error: any) {
      res.status(400).json({ message: 'Error creating chat', error: error.message });
    }
  }

  // Update chat by ID
  static async updateChat(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const chat = await ChatService.updateChat(id, req.body);
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }
      res.status(200).json(chat);
    } catch (error: any) {
      res.status(400).json({ message: 'Error updating chat', error: error.message });
    }
  }

  // Delete chat by ID
  static async deleteChat(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const chat = await ChatService.deleteChat(id);
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }
      res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Error deleting chat', error: error.message });
    }
  }

  // Get chats by user ID
  static async getChatsByUserId(req: Request, res: Response) {
    try {
      const userId = req.params.userId as string;
      const chats = await ChatService.getChatsByUserId(userId);
      res.status(200).json(chats);
    } catch (error: any) {
      res.status(500).json({ message: 'Error retrieving chats by user ID', error: error.message });
    }
  }

  // Send message and get AI response
  static async sendMessage(req: Request, res: Response) {
    try {
      const { userId, message } = req.body;
      if (!userId || !message) {
        return res.status(400).json({ message: 'User ID and message are required' });
      }
      const response = await ChatService.sendMessage(userId, message);
      res.status(200).json({ message, response });
    } catch (error: any) {
      res.status(500).json({ message: 'Error sending message', error: error.message });
    }
  }
}
