import React from 'react';

const CompilerOutput = ({ output }) => {
  return (
    <pre className="w-full h-64 p-2 border rounded bg-gray-100 font-mono overflow-auto">
      {output}
    </pre>
  );
};

export default CompilerOutput;
