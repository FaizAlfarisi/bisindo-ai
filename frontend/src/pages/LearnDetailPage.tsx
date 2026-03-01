import { useParams } from 'react-router-dom';

const LearnDetailPage = () => {
  const { letter } = useParams<{ letter: string }>();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Learn: {letter ? letter.toUpperCase() : 'Letter'}</h1>
      <p className="text-lg">Details for the selected letter.</p>
    </div>
  );
};

export default LearnDetailPage;
