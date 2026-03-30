import { EditionUser } from '../components/users/ManageUser'
import { useState } from 'react'
import type { User } from '../components/users/ManageUser'
import { motion } from 'framer-motion'

function Dashboard() {
  const [users, setUsers] = useState<User[]>([])

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="modal-bg flex min-h-screen items-center justify-center p-4"
    >
      <div className="flex">
        {/* <Nav></Nav> */}
        <EditionUser users={users} setUsers={setUsers} />
      </div>
    </motion.div>
  )
}

export default Dashboard
