import { GetUser } from '../components/users/ManageUser'
import { UpdateUser, DeleteUser } from '../components/users/ManageUser'
import { useState } from 'react'
import type { User } from '../components/users/ManageUser'
import { motion } from 'framer-motion'

function Dashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    )
    setSelectedUser(updatedUser)
  }
  const handleDeleteUser = (deletedUser: User) => {
    setUsers((prev) => prev.filter((u) => u.id !== deletedUser.id))
    setSelectedUser(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="modal-bg flex min-h-screen items-center justify-center p-4"
    >
      <GetUser users={users} setUsers={setUsers} onSelect={setSelectedUser} />

      {selectedUser && (
        <>
          <UpdateUser user={selectedUser} onUpdate={handleUpdateUser} />
          <DeleteUser user={selectedUser} onDelete={handleDeleteUser} />
        </>
      )}
    </motion.div>
  )
}

export default Dashboard
