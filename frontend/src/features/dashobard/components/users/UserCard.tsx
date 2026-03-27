interface User {
  id: number
  job: string
  name: string
  email: string
}

interface UserCardProps {
  user: User
  onClick: () => void
}

function UserCard({ user, onClick }: UserCardProps) {
  return (
    <article
      onClick={onClick}
      className="flex flex-col gap-2 rounded-lg bg-white/70 p-4 shadow-md backdrop-blur-xl"
    >
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <p className="text-sm text-gray-500">{user.job}</p>
    </article>
  )
}

export default UserCard
