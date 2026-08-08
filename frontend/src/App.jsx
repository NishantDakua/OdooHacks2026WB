import { useEffect, useState } from 'react'
import './App.css'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID

function App() {
  const [amount, setAmount] = useState('100')
  const [currency, setCurrency] = useState('INR')
  const [receipt, setReceipt] = useState(`receipt_${Date.now()}`)
  const [message, setMessage] = useState('Enter the amount in paise and start checkout.')
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (window.Razorpay) {
      setIsScriptLoaded(true)
      return undefined
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setIsScriptLoaded(true)
    script.onerror = () => setMessage('Unable to load Razorpay Checkout.')
    document.body.appendChild(script)

    return () => {
      script.onload = null
      script.onerror = null
    }
  }, [])

  const handleCheckout = async () => {
    const numericAmount = Number(amount)

    if (!razorpayKeyId) {
      setMessage('Missing VITE_RAZORPAY_KEY_ID in frontend env.')
      return
    }

    if (!Number.isFinite(numericAmount) || numericAmount < 100) {
      setMessage('Amount must be at least 100 paise.')
      return
    }

    if (!isScriptLoaded || !window.Razorpay) {
      setMessage('Razorpay Checkout is still loading.')
      return
    }

    setIsProcessing(true)
    setMessage('Creating Razorpay order...')

    try {
      const orderResponse = await fetch(`${apiBaseUrl}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(numericAmount),
          currency,
          receipt: receipt.trim(),
        }),
      })

      const orderData = await orderResponse.json().catch(() => ({}))

      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'Unable to create Razorpay order.')
      }

      const checkout = new window.Razorpay({
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.order_id,
        name: 'OdooHacks',
        description: 'Razorpay Standard Checkout',
        handler: async response => {
          try {
            setMessage('Verifying payment signature...')

            const verifyResponse = await fetch(`${apiBaseUrl}/api/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(response),
            })

            const verifyData = await verifyResponse.json().catch(() => ({}))

            if (!verifyResponse.ok) {
              throw new Error(verifyData.message || 'Payment signature verification failed.')
            }

            setMessage('Payment verified successfully.')
          } catch (error) {
            setMessage(error.message || 'Unable to verify payment.')
          } finally {
            setIsProcessing(false)
          }
        },
        modal: {
          ondismiss: () => {
            setMessage('Payment cancelled by user.')
            setIsProcessing(false)
          },
        },
        theme: {
          color: '#0f172a',
        },
      })

      checkout.on('payment.failed', response => {
        setMessage(response?.error?.description || 'Payment failed.')
        setIsProcessing(false)
      })

      checkout.open()
    } catch (error) {
      setMessage(error.message || 'Checkout failed.')
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-4xl items-center justify-center">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Payments</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            Razorpay Standard Checkout
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Create an order from the backend, open the Razorpay payment modal, and verify the
            returned signature before marking the payment as successful.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Amount (paise)
              <input
                className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                min="100"
                type="number"
                value={amount}
                onChange={event => setAmount(event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Currency
              <input
                className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                value={currency}
                onChange={event => setCurrency(event.target.value.toUpperCase())}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Receipt
              <input
                className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                value={receipt}
                onChange={event => setReceipt(event.target.value)}
              />
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isProcessing}
              onClick={handleCheckout}
              type="button"
            >
              {isProcessing ? 'Processing...' : 'Pay with Razorpay'}
            </button>

            <span className="text-sm text-slate-400">
              Minimum order amount is 100 paise.
            </span>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
            {message}
          </div>
        </div>
      </section>
    </main>
  )
}

export default App