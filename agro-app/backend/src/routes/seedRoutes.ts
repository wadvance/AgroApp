import { Router } from 'express';
import { SeedController } from '../controllers/seedController.js';

const router = Router();

// Get all seeds
router.get('/', SeedController.getAllSeeds);

// Get seed by ID
router.get('/:id', SeedController.getSeedById);

// Create a new seed
router.post('/', SeedController.createSeed);

// Update seed by ID
router.put('/:id', SeedController.updateSeed);

// Delete seed by ID
router.delete('/:id', SeedController.deleteSeed);

// Search seeds
router.get('/search', SeedController.searchSeeds);

export default router;
