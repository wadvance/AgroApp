import type { Request, Response } from 'express';
import { HarvestService } from '../services/harvestService.js';

export class HarvestController {
  // Get all harvest records
  static async getAllHarvests(req: Request, res: Response) {
    try {
      const harvests = await HarvestService.getAllHarvests();
      res.status(200).json(harvests);
    } catch (error: any) {
      res.status(500).json({ message: 'Error retrieving harvests', error: error.message });
    }
  }

  // Get harvest by ID
  static async getHarvestById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const harvest = await HarvestService.getHarvestById(id);
      if (!harvest) {
        return res.status(404).json({ message: 'Harvest not found' });
      }
      res.status(200).json(harvest);
    } catch (error: any) {
      res.status(500).json({ message: 'Error retrieving harvest', error: error.message });
    }
  }

  // Create a new harvest record
  static async createHarvest(req: Request, res: Response) {
    try {
      const harvest = await HarvestService.createHarvest(req.body);
      res.status(201).json(harvest);
    } catch (error: any) {
      res.status(400).json({ message: 'Error creating harvest', error: error.message });
    }
  }

  // Update harvest by ID
  static async updateHarvest(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const harvest = await HarvestService.updateHarvest(id, req.body);
      if (!harvest) {
        return res.status(404).json({ message: 'Harvest not found' });
      }
      res.status(200).json(harvest);
    } catch (error: any) {
      res.status(400).json({ message: 'Error updating harvest', error: error.message });
    }
  }

  // Delete harvest by ID
  static async deleteHarvest(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const harvest = await HarvestService.deleteHarvest(id);
      if (!harvest) {
        return res.status(404).json({ message: 'Harvest not found' });
      }
      res.status(200).json({ message: 'Harvest deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Error deleting harvest', error: error.message });
    }
  }

  // Get harvests by crop type
  static async getHarvestsByCrop(req: Request, res: Response) {
    try {
      const cropType = req.params.cropType as string;
      const harvests = await HarvestService.getHarvestsByCrop(cropType);
      res.status(200).json(harvests);
    } catch (error: any) {
      res.status(500).json({ message: 'Error retrieving harvests by crop type', error: error.message });
    }
  }

  // Calculate expected yield
  static async calculateExpectedYield(req: Request, res: Response) {
    try {
      const { cropType, area } = req.body;
      if (!cropType || !area) {
        return res.status(400).json({ message: 'Crop type and area are required' });
      }
      const cropYield = await HarvestService.calculateExpectedYield(cropType, parseFloat(area));
      res.status(200).json({ cropType, area, expectedYield: cropYield });
    } catch (error: any) {
      res.status(500).json({ message: 'Error calculating expected yield', error: error.message });
    }
  }
}
