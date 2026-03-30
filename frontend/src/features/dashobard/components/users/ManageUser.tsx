import { useState, useEffect } from 'react'
import UserCard from './UserCard'
import { fetchUser, deleteUser, updateUser } from './apiUsers'

export interface User {
  id: number
  name: string
  email: string
  job: string
}

export function GetUser({
  users,
  setUsers,
}: {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
}) {
  fetchUser(setUsers)

  return (
    <>
      <div className="flex flex-row justify-center gap-4 overflow-x-auto p-4">
        {users.map((u) => (
          <UserCard key={u.id} user={u} onClick={() => {}} />
        ))}
      </div>
    </>
  )
}

export function EditionUser({
  users,
  setUsers,
}: {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
}) {
  const [editing, setEditing] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUser(setUsers)
  }, [setUsers])

  const handleUpdate = (updatedUser: User) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
  }

  const handleDelete = (deletedUser: User) => {
    setUsers(users.filter((u) => u.id !== deletedUser.id))
  }

  return (
    <>
      {editing && (
        <div className="fixed inset-0 z-10" onClick={() => setEditing(false)} />
      )}

      <div className="z-20 flex flex-row gap-4 overflow-x-auto p-4">
        {users.map((user) => (
          <div
            key={user.id}
            className={`shrink-0 transition-all duration-300 ${
              editing && selectedUser?.id === user.id ? 'w-87.5' : 'w-50'
            }`}
          >
            {editing && selectedUser?.id === user.id ? (
              <UpdateUser
                user={user}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                editing={editing}
                setEditing={setEditing}
              />
            ) : (
              <UserCard
                user={user}
                onClick={() => {
                  setSelectedUser(user)
                  setEditing(true)
                }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export function UpdateUser({
  user,
  onUpdate,
  onDelete,
  editing,
  setEditing,
}: {
  user: User
  onUpdate: (u: User) => void
  onDelete: (u: User) => void
  editing: boolean
  setEditing: (v: boolean) => void
}) {
  const [formData, setFormData] = useState({
    email: user.email,
    name: user.name,
    job: user.job || '',
    id: user.id,
  })

  if (!editing) return null
  return (
    <div
      className={`rounded-xl border border-gray-200/50 bg-white p-6 shadow-sm`}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
          {user.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-gray-400">Modifier le profil</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          updateUser(formData, onUpdate)
          setEditing(false)
        }}
        className="flex flex-col gap-4"
      >
        {[
          {
            id: 'name',
            label: 'Nom',
            value: formData.name,
            fieldName: 'name',
            placeholder: user.name,
          },
          {
            id: 'email',
            label: 'Email',
            value: formData.email,
            fieldName: 'email',
            placeholder: user.email,
          },
          {
            id: 'job',
            label: 'Poste',
            value: formData.job,
            fieldName: 'job',
            placeholder: user.job || 'Job',
          },
        ].map(({ id, label, value, fieldName, placeholder }) => (
          <div key={id} className="flex flex-col gap-1.5">
            <label
              htmlFor={id}
              className="text-[11px] font-medium tracking-wide text-gray-400 uppercase"
            >
              {label}
            </label>
            <input
              id={id}
              value={value}
              placeholder={placeholder}
              onChange={(e) =>
                setFormData({ ...formData, [fieldName]: e.target.value })
              }
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
            />
          </div>
        ))}

        <div className="mt-2 flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Enregistrer
          </button>
          <button
            className="rounded-lg border border-pink-200 px-4 py-2 text-sm text-pink-500 hover:bg-pink-50"
            type="button"
            onClick={() => deleteUser(onDelete, user)}
          >
            Supprimer
          </button>
        </div>
      </form>
    </div>
  )
}
