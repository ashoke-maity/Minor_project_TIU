export default function AdminStats() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Alumni</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,200</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Events Hosted</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">45</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Messages Received</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">230</p>
        </div>
      </div>
    );
  }
  