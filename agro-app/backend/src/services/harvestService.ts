import Harvest from '../models/Harvest.js';

export class HarvestService {
  // Get all harvest records
  static async getAllHarvests() {
    return await Harvest.find().sort({ plantingDate: -1 });
  }

  // Get harvest by ID
  static async getHarvestById(id: string) {
    return await Harvest.findById(id);
  }

  // Create a new harvest record
  static async createHarvest(harvestData: any) {
    const harvest = new Harvest(harvestData);
    return await harvest.save();
  }

  // Update harvest by ID
  static async updateHarvest(id: string, harvestData: any) {
    return await Harvest.findByIdAndUpdate(id, harvestData, { new: true });
  }

  // Delete harvest by ID
  static async deleteHarvest(id: string) {
    return await Harvest.findByIdAndDelete(id);
  }

  // Get harvests by crop type
  static async getHarvestsByCrop(cropType: string) {
    return await Harvest.find({ cropType }).sort({ plantingDate: -1 });
  }

  // Calculate expected yield based on area and crop type
  static async calculateExpectedYield(cropType: string, area: number) {
    // This would typically use a database or ML model to determine yield per hectare
    // For now, we'll use a simple calculation
    let baseYield = 3.0; // Default to 3.0 tons/ha
    
    const lowerCaseCrop = cropType.toLowerCase();
    if (lowerCaseCrop === 'wheat') {
      baseYield = 3.5;
    } else if (lowerCaseCrop === 'corn') {
      baseYield = 6.0;
    } else if (lowerCaseCrop === 'soybeans') {
      baseYield = 2.8;
    } else if (lowerCaseCrop === 'rice') {
      baseYield = 4.5;
    } else if (lowerCaseCrop === 'potatoes') {
      baseYield = 25.0;
    } else if (lowerCaseCrop === 'tomatoes') {
      baseYield = 40.0;
    }
    
    return baseYield * area;
  }
}
