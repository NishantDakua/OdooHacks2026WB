import { Router } from 'express'

import { createOrder, verifyPayment } from '../controllers/paymentController.js'

const router = Router()

router.route('/create-order') .post(createOrder)
router.post('/verify-payment', verifyPayment)

export default router
