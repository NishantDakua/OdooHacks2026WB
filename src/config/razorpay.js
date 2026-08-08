import dotenv from 'dotenv'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import Razorpay from 'razorpay'

const currentDir = dirname(fileURLToPath(import.meta.url))
const rootEnvPath = join(currentDir, '../../.env')

dotenv.config({ path: rootEnvPath })

const keyId = process.env.RAZORPAY_KEY_ID
const keySecret = process.env.RAZORPAY_KEY_SECRET

if (!keyId || !keySecret) {
  throw new Error('Missing Razorpay credentials in environment variables.')
}

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
})

export { keySecret as razorpayKeySecret, razorpay }
