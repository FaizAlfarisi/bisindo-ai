import { useParams, Link } from 'react-router-dom';
import { BISINDO_ALPHABET } from '../data/bisindoData';

const LearnDetailPage = () => {
  const { letter } = useParams<{ letter: string }>();
  const letterData = letter ? BISINDO_ALPHABET[letter.toUpperCase()] : null;

  if (!letterData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Letter Not Found</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">The letter you're looking for isn't in our current BISINDO alphabet database.</p>
        <Link to="/learn" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg">
          Back to Learning Module
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center space-x-4 mb-10">
          <Link to="/learn" className="p-3 rounded-2xl hover:bg-gray-200 transition-all text-gray-600 bg-white shadow-sm border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-4xl font-black text-gray-900 leading-none tracking-tight">Learn Letter {letterData.letter}</h1>
            <p className="text-gray-500 mt-1 font-bold uppercase tracking-widest text-xs">BISINDO Abjad Indonesia</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Visual Reference Section (3 columns) */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center">
              <div className="w-full aspect-video bg-white rounded-3xl flex items-center justify-center mb-8 relative group overflow-hidden border border-gray-50">
                <img 
                  src={letterData.imagePath} 
                  alt={`BISINDO ${letterData.letter}`} 
                  className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-6 right-6 z-30">
                  <div className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-black shadow-xl uppercase tracking-widest">
                     {letterData.category}
                  </div>
                </div>
              </div>
              
              <div className="text-center px-4 max-w-md">
                <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Core Characteristic</h4>
                <p className="text-3xl font-black text-gray-900 leading-tight">
                  "{letterData.description}"
                </p>
              </div>
            </div>
          </div>

          {/* Instructions Section (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
              <h2 className="text-2xl font-black mb-8 flex items-center text-gray-900">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h2a2 2 0 002 2" />
                  </svg>
                </div>
                How to Form It
              </h2>
              <ol className="space-y-6">
                {letterData.steps.map((step, index) => (
                  <li key={index} className="flex items-start group">
                    <span className="flex-shrink-0 w-8 h-8 bg-gray-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center text-sm font-black mr-4 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                      {index + 1}
                    </span>
                    <span className="text-gray-600 font-bold leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 p-8 rounded-[2rem]">
              <h3 className="text-sm font-black text-amber-900 mb-2 uppercase tracking-widest flex items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                Pro Tip
              </h3>
              <p className="text-amber-800 font-bold leading-relaxed">{letterData.tips}</p>
            </div>

            <Link 
              to={`/practice/${letterData.letter.toLowerCase()}`}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-5 rounded-3xl font-black text-xl shadow-xl shadow-blue-200 transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              Start Practice Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnDetailPage;
