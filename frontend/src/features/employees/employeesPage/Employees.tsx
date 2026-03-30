import { useState } from 'react'
import type { User } from '../../dashobard/components/users/ManageUser'
import { GetUser } from '../../dashobard/components/users/ManageUser'
function Employees() {
  const [users, setUsers] = useState<User[]>([])

  return <GetUser users={users} setUsers={setUsers} />
}

export default Employees
