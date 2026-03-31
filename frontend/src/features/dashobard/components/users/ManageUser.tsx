import { useState, useEffect } from 'react'
import UserCard from './UserCard'
import { fetchUser } from './apiUsers'
import { FormEditUser, FormAddUser } from './formUser'

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
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    email: selectedUser?.email || '',
    name: selectedUser?.name || '',
    job: selectedUser?.job || '',
    id: selectedUser?.id || 0,
  })

  useEffect(() => {
    fetchUser(setUsers)
  }, [setUsers])

  const handleAdd = (newUser: User) => {
    setUsers((prev) => [...prev, newUser])
  }
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
        <button onClick={() => setOpen(true)}>Add person</button>
        {open && (
          <FormAddUser
            //   user={user}
            formData={formData}
            setFormData={setFormData}
            setOpen={setOpen}
            onAdd={handleAdd}
          />
        )}
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
    <FormEditUser
      user={user}
      formData={formData}
      onDelete={onDelete}
      onUpdate={onUpdate}
      setFormData={setFormData}
      setEditing={setEditing}
    />
  )
}
