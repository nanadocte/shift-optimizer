import type { User } from './ManageUser'

export const fetchUser = async (setUsers: (data: User[]) => void) => {
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

export const updateUser = async (
  formData: { email: string; name: string; job: string; id: number },
  onUpdate: (u: User) => void
) => {
  try {
    const token = localStorage.getItem('token')

    const chargeUtile = JSON.stringify(formData)
    const response = await fetch(`http://localhost:3000/users/${formData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: chargeUtile,
    })
    const data = await response.json()
    if (!data) return console.log('Pas de données reçues')
    onUpdate(data)
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

export const deleteUser = async (onDelete: (u: User) => void, user: User) => {
  const token = localStorage.getItem('token')
  try {
    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    onDelete(user)
  } catch (error) {
    console.error(error)
  }
}

export const addUser = async (
  onAdd: (u: User) => void,
  formData: {
    email: string
    name: string
    id: number
    job: string
  }
) => {
  const chargeUtile = JSON.stringify(formData)
  const token = localStorage.getItem('token')
  try {
    const response = await fetch(`http://localhost:3000/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: chargeUtile,
    })
    const data = await response.json()
    if (!data) return null
    onAdd(data)
  } catch (error) {
    console.log(error)
  }
}
