import { Router } from 'express';
import { VytalSyncController } from '../controllers/vytal-sync';

const router = Router();
const controller = new VytalSyncController();

// Initialize the controller
controller.initialize().catch(error => {
  console.error('Failed to initialize VytalSyncController:', error);
});

// Server public key endpoint (no auth required)
router.get('/server-public-key', controller.getServerPublicKey.bind(controller));

export default router;
