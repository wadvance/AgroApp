import type { Request, Response } from 'express';
import { DiseaseService } from '../services/diseaseService.js';

export class DiseaseController {
  // Get all diseases
  static async getAllDiseases(req: Request, res: Response) {
    try {
      const diseases = await DiseaseService.getAllDiseases();
      res.status(200).json(diseases);
    } catch (error: any) {
      res.status(500).json({ message: 'Error retrieving diseases', error: error.message });
    }
  }

  // Get disease by ID
  static async getDiseaseById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const disease = await DiseaseService.getDiseaseById(id);
      if (!disease) {
        return res.status(404).json({ message: 'Disease not found' });
      }
      res.status(200).json(disease);
    } catch (error: any) {
      res.status(500).json({ message: 'Error retrieving disease', error: error.message });
    }
  }

  // Create a new disease
  static async createDisease(req: Request, res: Response) {
    try {
      const disease = await DiseaseService.createDisease(req.body);
      res.status(201).json(disease);
    } catch (error: any) {
      res.status(400).json({ message: 'Error creating disease', error: error.message });
    }
  }

  // Update disease by ID
  static async updateDisease(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const disease = await DiseaseService.updateDisease(id, req.body);
      if (!disease) {
        return res.status(404).json({ message: 'Disease not found' });
      }
      res.status(200).json(disease);
    } catch (error: any) {
      res.status(400).json({ message: 'Error updating disease', error: error.message });
    }
  }

  // Delete disease by ID
  static async deleteDisease(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const disease = await DiseaseService.deleteDisease(id);
      if (!disease) {
        return res.status(404).json({ message: 'Disease not found' });
      }
      res.status(200).json({ message: 'Disease deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Error deleting disease', error: error.message });
    }
  }

  // Search diseases
  static async searchDiseases(req: Request, res: Response) {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      const diseases = await DiseaseService.searchDiseases(query as string);
      res.status(200).json(diseases);
    } catch (error: any) {
      res.status(500).json({ message: 'Error searching diseases', error: error.message });
    }
  }

  // Get diseases by plant
  static async getDiseasesByPlant(req: Request, res: Response) {
    try {
      const plant = req.params.plant as string;
      const diseases = await DiseaseService.getDiseasesByPlant(plant);
      res.status(200).json(diseases);
    } catch (error: any) {
      res.status(500).json({ message: 'Error retrieving diseases by plant', error: error.message });
    }
  }
}
