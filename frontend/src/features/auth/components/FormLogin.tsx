import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}
interface FormProps {
  mode: 'login' | 'signup'
  setMode: React.Dispatch<React.SetStateAction<'login' | 'signup'>>
}

function Form({ mode }: FormProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(false)

  const emailPassword =
    mode === 'signup'
      ? {
          email,
          password,
          name,
        }
      : { email, password }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(false)

    try {
      const chargeUtile = JSON.stringify(emailPassword)
      const response = await fetch(`http://localhost:3000/auth/${mode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: chargeUtile,
      })
      const data = await response.json()
      if (!data.token) {
        setError(true)
      } else {
        localStorage.setItem('token', data.token)

        navigate('/dashboard')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="flex h-full flex-col justify-between gap-3"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs" htmlFor="name">
                NAME
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="name"
                type="name"
                className="rounded-full border border-gray-800/40 bg-gray-50 p-2 text-xs"
              ></input>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-xs" htmlFor="email">
              EMAIL
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              placeholder="name@email.com"
              className="rounded-full border border-gray-800/40 bg-gray-50 p-2 text-xs"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs" htmlFor="password">
              PASSWORD
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type="password"
              placeholder="·········"
              className="rounded-full border border-gray-800/40 bg-gray-50 p-2 text-xs"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-indigo-600 p-3 text-white transition hover:bg-indigo-700"
          >
            {mode === 'signup' ? `S'inscrire` : 'Se connecter'}
          </button>

          {error && <p>Une erreur est survenue.</p>}
        </form>
      </motion.div>
    </AnimatePresence>
  )
}

export default Form
