import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mt-4">
          Oops! The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2 bg-primary-100 text-dark-100 rounded-full"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
}

export default NotFound
