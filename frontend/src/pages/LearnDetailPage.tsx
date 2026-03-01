import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Placeholder data for letter details
const letterDetails: { [key: string]: { description: string; imageUrl: string } } = {
  a: { description: "Place your hand open, palm facing forward, thumb extended out to the side.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+A" },
  b: { description: "Hold your hand up, palm forward, all fingers together and pointing up.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+B" },
  c: { description: "Curve your hand to form a 'C' shape, palm facing forward.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+C" },
  d: { description: "Index finger and thumb form a circle, other fingers extended up.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+D" },
  e: { description: "Fingers curled inward, thumb tucked in.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+E" },
  f: { description: "Index finger and thumb touch, other three fingers extended.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+F" },
  g: { description: "Hand closed, index finger pointing to the side, thumb extended.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+G" },
  h: { description: "Index and middle fingers extended side-by-side, thumb tucked.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+H" },
  i: { description: "Pinky finger extended upwards, other fingers closed.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+I" },
  j: { description: "Pinky finger extended, drawing a 'J' shape in the air.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+J" },
  k: { description: "Index and middle fingers extended up, middle finger bent at knuckle, thumb between them.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+K" },
  l: { description: "Thumb extended up, index finger extended forward, forming an 'L' shape.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+L" },
  m: { description: "Three fingers (index, middle, ring) over the thumb.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+M" },
  n: { description: "Two fingers (index, middle) over the thumb.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+N" },
  o: { description: "Fingers and thumb form a circle, resembling an 'O'.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+O" },
  p: { description: "Similar to 'K', but index finger points down.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+P" },
  q: { description: "Similar to 'G', but index finger points down.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+Q" },
  r: { description: "Index and middle fingers crossed.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+R" },
  s: { description: "Hand closed in a fist, thumb over the fingers.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+S" },
  t: { description: "Hand closed, thumb between index and middle fingers.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+T" },
  u: { description: "Index and middle fingers extended straight up, together.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+U" },
  v: { description: "Index and middle fingers extended up, spread apart, forming a 'V'.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+V" },
  w: { description: "Three fingers (index, middle, ring) extended up, spread apart.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+W" },
  x: { description: "Index finger bent at the knuckle, resembling a hook.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+X" },
  y: { description: "Thumb and pinky finger extended, other fingers closed.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+Y" },
  z: { description: "Index finger drawing a 'Z' shape in the air.", imageUrl: "https://via.placeholder.com/300x200?text=Sign+for+Z" },
};

const LearnDetailPage = () => {
  const { letter } = useParams<{ letter: string }>();
  const displayLetter = letter ? letter.toUpperCase() : '';
  const [details, setDetails] = useState<{ description: string; imageUrl: string } | null>(null);

  useEffect(() => {
    if (letter) {
      setDetails(letterDetails[letter.toLowerCase()] || { description: "Details not available for this letter.", imageUrl: "https://via.placeholder.com/300x200?text=No+Image" });
    } else {
      setDetails(null);
    }
  }, [letter]);

  if (!letter || !details) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <h1 className="text-4xl font-bold mb-4">Letter Not Found</h1>
        <p className="text-lg">Please select a valid letter from the learning grid.</p>
        <Link to="/learn" className="mt-4 text-blue-500 hover:underline">Go back to Learn</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 text-gray-800 p-4">
      <h1 className="text-4xl font-bold mb-6">Learn: {displayLetter}</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
        <img src={details.imageUrl} alt={`Sign for ${displayLetter}`} className="mx-auto mb-4 rounded-lg" />
        <p className="text-lg mb-4">{details.description}</p>
        <Link
          to={`/practice/${letter}`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Start Practice for {displayLetter}
        </Link>
      </div>
      
      <Link to="/learn" className="mt-6 text-blue-500 hover:underline">Back to All Letters</Link>
    </div>
  );
};

export default LearnDetailPage;