
import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-r-lg text-yellow-800" role="alert">
      <h4 className="font-bold">Important Disclaimer</h4>
      <p className="text-sm">
        This is a demonstration application for educational purposes only. The analysis is performed by a generative AI model and may not be accurate or consistent.
        The information provided should NOT be used for medical diagnosis or treatment. Always consult a qualified healthcare professional for any health concerns.
      </p>
    </div>
  );
};

export default Disclaimer;
