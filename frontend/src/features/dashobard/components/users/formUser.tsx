import { updateUser, deleteUser, addUser } from './apiUsers'
import type { User } from './ManageUser'

export function FormEditUser({
  user,
  formData,
  setFormData,
  onUpdate,
  onDelete,
  setEditing,
}: {
  user: User
  formData: { email: string; name: string; job: string; id: number }
  setFormData: React.Dispatch<
    React.SetStateAction<{
      email: string
      name: string
      job: string
      id: number
    }>
  >
  onUpdate: (u: User) => void
  onDelete: (u: User) => void
  setEditing: (v: boolean) => void
}) {
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

export function FormAddUser({
  //   user,
  formData,
  setFormData,

  setOpen,
  onAdd,
}: {
  //   user: User
  formData: { email: string; name: string; job: string; id: number }
  setFormData: React.Dispatch<
    React.SetStateAction<{
      email: string
      name: string
      job: string
      id: number
    }>
  >

  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  onAdd: (u: User) => void
}) {
  return (
    <div
      className={`rounded-xl border border-gray-200/50 bg-white p-6 shadow-sm`}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
          {/* {user.name.slice(0, 2).toUpperCase() || null} */}
        </div>
        <div>
          {/* <p className="text-sm font-medium">{user.name || null}</p> */}
          <p className="text-xs text-gray-400">Modifier le profil</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          addUser(onAdd, formData)
          setOpen(false)
        }}
        className="flex flex-col gap-4"
      >
        {[
          {
            id: 'name',
            label: 'Nom',
            value: formData.name,
            fieldName: 'name',
            placeholder: 'name',
          },
          {
            id: 'email',
            label: 'Email',
            value: formData.email,
            fieldName: 'email',
            placeholder: 'email',
          },
          {
            id: 'job',
            label: 'Poste',
            value: formData.job,
            fieldName: 'job',
            placeholder: 'Job',
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
              placeholder={placeholder || ''}
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
            onClick={() => {
              setOpen(false)
            }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
