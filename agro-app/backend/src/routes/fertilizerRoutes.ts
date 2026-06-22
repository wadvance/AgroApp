import { Router } from 'express';
import FertilizerController from '../controllers/fertilizerController';

const router = Router();

// Get all fertilizers
router.get('/', FertilizerController.getAllFertilizers);

// Get fertilizer by ID
router.get('/:id', FertilizerController.getFertilizerById);

// Create a new fertilizer
router.post('/', FertilizerController.createFertilizer);

// Update fertilizer by ID
router.put('/:id', FertilizerController.updateFertilizer);

// Delete fertilizer by ID
router.delete('/:id', FertilizerController.deleteFertilizer);

// Search fertilizers
router.get('/search', FertilizerController.searchFertilizers);

// Get fertilizers for crop
router.get('/crop/:crop', FertilizerController.getFertilizersForCrop);

export default router;
