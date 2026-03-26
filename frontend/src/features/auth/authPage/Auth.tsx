import viteLogo from '../../../assets/vite.svg'
import Form from '../components/FormLogin'

function Auth() {
  return (
    <div className="modal-bg flex min-h-screen items-center justify-center bg-[radial-gradient(at_top_left,#4f46e5,transparent_60%),radial-gradient(at_top_right,#8b5cf6,transparent_60%),radial-gradient(at_bottom_left,#8b5cf6,transparent_80%),radial-gradient(at_bottom_right,#4f46e5,transparent_80%)] p-4 bg-blend-multiply">
      <div className="flex w-full max-w-2xl rounded-2xl shadow-xl backdrop-blur-xl">
        {/* Colonne gauche */}
        <div className="flex w-1/2 flex-1 flex-col rounded-l-2xl bg-white/70 p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-3">
            <img alt="logo" src={viteLogo} className="h-10 w-10" />
            <p className="text-lg font-semibold">Shift Optimizer</p>
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-bold">
              Precision Orchestrated Management
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Transform chaotic scheduling into a fluid, automated command
              center. Reduce conflicts by 84% with our AI-driven engine.
            </p>
          </div>

          <div className="mb-6">
            <i className="fa-star fa-solid text-yellow-400"></i>
            <p className="mt-1 text-sm italic">
              "The most intuitive logistics tool I've used in a decade of
              operations management."
            </p>
            <p className="mt-1 text-xs text-gray-500">Director of logistics</p>
          </div>

          <div className="flex gap-4 text-xs text-gray-400">
            <a href="#">2026</a>
            <a href="#">Privacy policy</a>
            <a href="#">Terms of service</a>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="flex w-1/2 flex-1 flex-col rounded-r-2xl bg-white/80 p-6 backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-sm text-gray-600">Access your portal</p>
          </div>
          <Form />
        </div>
      </div>
    </div>
  )
}

export default Auth
