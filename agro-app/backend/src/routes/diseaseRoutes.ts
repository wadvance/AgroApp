import { Router } from 'express';
import { DiseaseController } from '../controllers/diseaseController.js';

const router = Router();

// Get all diseases
router.get('/', DiseaseController.getAllDiseases);

// Get disease by ID
router.get('/:id', DiseaseController.getDiseaseById);

// Create a new disease
router.post('/', DiseaseController.createDisease);

// Update disease by ID
router.put('/:id', DiseaseController.updateDisease);

// Delete disease by ID
router.delete('/:id', DiseaseController.deleteDisease);

// Search diseases
router.get('/search', DiseaseController.searchDiseases);

// Get diseases by plant
router.get('/plant/:plant', DiseaseController.getDiseasesByPlant);

export default router;
