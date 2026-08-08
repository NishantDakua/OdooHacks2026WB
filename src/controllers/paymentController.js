import crypto from 'crypto'

import { razorpay, razorpayKeySecret } from '../config/razorpay.js'

export async function createOrder(req, res) {
  try {
    const amount = Number(req.body.amount)
    const currency = (req.body.currency || 'INR').toUpperCase()
    const receipt = (req.body.receipt || '').trim() || `receipt_${Date.now()}`

    if (!Number.isFinite(amount) || amount < 100) {
      return res.status(400).json({
        message: 'Amount must be at least 100 paise.',
      })
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt,
    })

    return res.status(201).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    const statusCode = error?.statusCode || error?.response?.statusCode || error?.response?.status

    if (statusCode === 401 || statusCode === 403) {
      return res.status(401).json({
        message: 'Unauthorized while creating the Razorpay order.',
      })
    }

    return res.status(500).json({
      message: 'Failed to create Razorpay order.',
    })
  }
}

export function verifyPayment(req, res) {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({
      message: 'Missing Razorpay payment fields.',
    })
  }

  const expectedSignature = crypto
    .createHmac('sha256', razorpayKeySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8')
  const providedBuffer = Buffer.from(String(razorpay_signature), 'utf8')

  if (
    expectedBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return res.status(400).json({
      message: 'Invalid payment signature.',
    })
  }

  return res.status(200).json({
    success: true,
  })
}
