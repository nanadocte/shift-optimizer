import { useState } from 'react'

function Form() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const emailPassword: { email: string; password: string } = { email, password }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(false)

    try {
      const chargeUtile = JSON.stringify(emailPassword)
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: chargeUtile,
      })
      const data = await response.json()
      if (!data.token) {
        setError(true)
      } else {
        localStorage.setItem('token', data.token)
        window.location.href = '#Hello'
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          Se connecter
        </button>
        {error && <p>Hello c'est faux</p>}
      </form>
    </>
  )
}

export default Form
