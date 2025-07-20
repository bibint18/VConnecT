
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-purple-500 text-center px-4">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="mb-6 text-lg">Sorry, the page you are looking for doesn't exist.</p>
      <Link
        to="/"
        className="px-6 py-2 border border-purple-500 rounded-lg hover:bg-purple-500 hover:text-black transition"
      >
        Go Back Home
      </Link>
    </div>
  )
}

export default NotFound
