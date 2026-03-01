import { Link } from 'react-router-dom';

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

const LearnPage = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 text-gray-800 p-4">
      <h1 className="text-4xl font-bold mb-6">Learn BISINDO (A-Z)</h1>
      <p className="text-lg mb-8">Click on a letter to see its details and practice.</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 w-full max-w-4xl">
        {ALL_LETTERS.map((letter) => (
          <Link
            key={letter}
            to={`/learn/${letter.toLowerCase()}`}
            className="flex items-center justify-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-5xl font-bold text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {letter}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LearnPage;