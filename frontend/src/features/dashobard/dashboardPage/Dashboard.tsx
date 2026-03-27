import { GetUser } from '../components/users/ManageUser'
import { UpdateUser } from '../components/users/ManageUser'
import { useState } from 'react'
import type { User } from '../components/users/ManageUser'

function Dashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    )
    setSelectedUser(updatedUser)
  }

  return (
    <div className="modal-bg flex min-h-screen items-center justify-center bg-[radial-gradient(at_top_left,#4f46e5,transparent_60%),radial-gradient(at_top_right,#8b5cf6,transparent_60%),radial-gradient(at_bottom_left,#8b5cf6,transparent_80%),radial-gradient(at_bottom_right,#4f46e5,transparent_60%)] p-4 bg-blend-multiply">
      <GetUser users={users} setUsers={setUsers} onSelect={setSelectedUser} />

      {selectedUser && (
        <UpdateUser user={selectedUser} onUpdate={handleUpdateUser} />
      )}
    </div>
  )
}

export default Dashboard
