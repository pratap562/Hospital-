import express from 'express';
import { createLead, getLead, updateLeadStatus } from '../controllers/leadController';

const router = express.Router();

router.post('/', createLead);
router.get('/:id', getLead);
router.patch('/:id/status', updateLeadStatus);

export default router;
