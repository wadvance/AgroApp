import type { Request, Response } from 'express';
import { SeedService } from '../services/seedService.js';

export class SeedController {
  // Get all seeds
  static async getAllSeeds(req: Request, res: Response) {
    try {
      const seeds = await SeedService.getAllSeeds();
      res.status(200).json(seeds);
    } catch (error: any) {
      res.status(500).json({ message: 'Error retrieving seeds', error: error.message });
    }
  }

  // Get seed by ID
  static async getSeedById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const seed = await SeedService.getSeedById(id);
      if (!seed) {
        return res.status(404).json({ message: 'Seed not found' });
      }
      res.status(200).json(seed);
    } catch (error: any) {
      res.status(500).json({ message: 'Error retrieving seed', error: error.message });
    }
  }

  // Create a new seed
  static async createSeed(req: Request, res: Response) {
    try {
      const seed = await SeedService.createSeed(req.body);
      res.status(201).json(seed);
    } catch (error: any) {
      res.status(400).json({ message: 'Error creating seed', error: error.message });
    }
  }

  // Update seed by ID
  static async updateSeed(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const seed = await SeedService.updateSeed(id, req.body);
      if (!seed) {
        return res.status(404).json({ message: 'Seed not found' });
      }
      res.status(200).json(seed);
    } catch (error: any) {
      res.status(400).json({ message: 'Error updating seed', error: error.message });
    }
  }

  // Delete seed by ID
  static async deleteSeed(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const seed = await SeedService.deleteSeed(id);
      if (!seed) {
        return res.status(404).json({ message: 'Seed not found' });
      }
      res.status(200).json({ message: 'Seed deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Error deleting seed', error: error.message });
    }
  }

  // Search seeds
  static async searchSeeds(req: Request, res: Response) {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      const seeds = await SeedService.searchSeeds(query as string);
      res.status(200).json(seeds);
    } catch (error: any) {
      res.status(500).json({ message: 'Error searching seeds', error: error.message });
    }
  }
}
