import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center space-x-3">
          {/* Fix: Changed SVG attributes from strokeLineCap/strokeLineJoin to strokeLinecap/strokeLinejoin to match React's camelCase convention for SVG properties. */}
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3M5.636 5.636l1.414 1.414m10.05 10.05l1.414 1.414M18.364 5.636l-1.414 1.414M7.05 17.05l-1.414 1.414"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AI-Powered Electropherogram Analysis</h1>
            <p className="text-sm text-gray-500">A demonstration for Sebia Capillarys 2 Output Interpretation</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
