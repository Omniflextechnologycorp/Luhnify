import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import LuhnGenerator from '@/components/LuhnGenerator';

export default function Home() {
  const [showGenerator, setShowGenerator] = useState(false);

  const handleEnterApp = () => {
    setShowGenerator(true);
  };

  const handleBack = () => {
    setShowGenerator(false);
  };

  return (
    <div className="min-h-screen">
      {showGenerator ? (
        <LuhnGenerator onBack={handleBack} />
      ) : (
        <LandingPage onEnterApp={handleEnterApp} />
      )}
    </div>
  );
}
