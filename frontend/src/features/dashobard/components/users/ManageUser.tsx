import { useState, useEffect } from 'react'
import UserCard from './UserCard'

export interface User {
  id: number
  name: string
  email: string
  job: string
}

export function GetUser({
  users,
  setUsers,
  onSelect,
}: {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  onSelect: (user: User) => void
}) {
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')

      try {
        const response = await fetch(`http://localhost:3000/users`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`)
        }
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchUser()
  }, [])

  return (
    <div className="grid auto-cols-[200px] grid-flow-col gap-4 overflow-x-auto p-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} onClick={() => onSelect(user)} />
      ))}
    </div>
  )
}
export function DeleteUser({
  user,
  onDelete,
}: {
  user: User
  onDelete: (u: User) => void
}) {
  const deleteUser = async () => {
    const token = localStorage.getItem('token')

    try {
      const chargeUtile = JSON.stringify(user.id)
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Contente-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: chargeUtile,
      })
      await response.json()
      onDelete(user)
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
  return (
    <div>
      <button onClick={deleteUser}>Delete</button>
    </div>
  )
}

export function UpdateUser({
  user,
  onUpdate,
}: {
  user: User
  onUpdate: (u: User) => void
}) {
  const [editing, setEditing] = useState(false)
  const [email, setEmail] = useState(user.email)
  const [name, setName] = useState(user.name)
  const [job, setJob] = useState(user.job || '')

  useEffect(() => {
    setEmail(user.email)
    setName(user.name)
    setJob(user.job || '')
  }, [user])

  const updateUser = async () => {
    try {
      const token = localStorage.getItem('token')

      const chargeUtile = JSON.stringify({ email, name, job })
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: chargeUtile,
      })
      const data = await response.json()
      if (!data) return console.log(Error)
      onUpdate(data)
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        updateUser()
      }}
    >
      <div>
        <label htmlFor="job">Job</label>
        <input
          id="job"
          value={job}
          placeholder={user.job || 'Job'}
          onChange={(e) => setJob(e.target.value)}
        ></input>
      </div>{' '}
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={name}
          placeholder={user.name}
          onChange={(e) => setName(e.target.value)}
        ></input>
      </div>{' '}
      <div>
        <label htmlFor="email">email</label>
        <input
          id="email"
          value={email}
          placeholder={user.email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </div>{' '}
      <button type="submit">Change</button>
    </form>
  )
}
