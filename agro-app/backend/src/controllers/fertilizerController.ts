import { Request, Response } from 'express';
import FertilizerService from '../services/fertilizerService';

export class FertilizerController {
  // Get all fertilizers
  static async getAllFertilizers(req: Request, res: Response) {
    try {
      const fertilizers = await FertilizerService.getAllFertilizers();
      res.status(200).json(fertilizers);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving fertilizers', error: error.message });
    }
  }

  // Get fertilizer by ID
  static async getFertilizerById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const fertilizer = await FertilizerService.getFertilizerById(id);
      if (!fertilizer) {
        return res.status(404).json({ message: 'Fertilizer not found' });
      }
      res.status(200).json(fertilizer);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving fertilizer', error: error.message });
    }
  }

  // Create a new fertilizer
  static async createFertilizer(req: Request, res: Response) {
    try {
      const fertilizer = await FertilizerService.createFertilizer(req.body);
      res.status(201).json(fertilizer);
    } catch (error) {
      res.status(400).json({ message: 'Error creating fertilizer', error: error.message });
    }
  }

  // Update fertilizer by ID
  static async updateFertilizer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const fertilizer = await FertilizerService.updateFertilizer(id, req.body);
      if (!fertilizer) {
        return res.status(404).json({ message: 'Fertilizer not found' });
      }
      res.status(200).json(fertilizer);
    } catch (error) {
      res.status(400).json({ message: 'Error updating fertilizer', error: error.message });
    }
  }

  // Delete fertilizer by ID
  static async deleteFertilizer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const fertilizer = await FertilizerService.deleteFertilizer(id);
      if (!fertilizer) {
        return res.status(404).json({ message: 'Fertilizer not found' });
      }
      res.status(200).json({ message: 'Fertilizer deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting fertilizer', error: error.message });
    }
  }

  // Search fertilizers
  static async searchFertilizers(req: Request, res: Response) {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      const fertilizers = await FertilizerService.searchFertilizers(query as string);
      res.status(200).json(fertilizers);
    } catch (error) {
      res.status(500).json({ message: 'Error searching fertilizers', error: error.message });
    }
  }

  // Get fertilizers for crop
  static async getFertilizersForCrop(req: Request, res: Response) {
    try {
      const { crop } = req.params;
      const fertilizers = await FertilizerService.getFertilizersForCrop(crop);
      res.status(200).json(fertilizers);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving fertilizers for crop', error: error.message });
    }
  }
}
