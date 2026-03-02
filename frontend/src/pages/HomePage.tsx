import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-6 bg-blue-50 text-blue-600 rounded-full text-sm font-black uppercase tracking-widest animate-fade-in">
            New Era of Learning
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 tracking-tight leading-tight">
            Master BISINDO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              with AI Magic.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            Interactive, real-time, and fun. Learn Indonesian Sign Language with our advanced hand-tracking technology.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/learn"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-3xl font-black text-xl shadow-2xl shadow-blue-200 transition-all hover:scale-105 active:scale-95"
            >
              Start Learning Free
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-900 px-10 py-5 rounded-3xl font-black text-xl transition-all hover:bg-gray-50 active:scale-95"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {[
            { 
              title: "Real-time AI", 
              desc: "Instant feedback on your hand gestures using MediaPipe technology.", 
              icon: "🤖",
              color: "bg-blue-500" 
            },
            { 
              title: "Step-by-Step", 
              desc: "Carefully curated modules to take you from beginner to pro.", 
              icon: "📚",
              color: "bg-indigo-500" 
            },
            { 
              title: "Track Progress", 
              desc: "Visual dashboards and history to keep you motivated.", 
              icon: "📈",
              color: "bg-teal-500" 
            },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-100 border border-gray-50 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-lg shadow-gray-200`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
