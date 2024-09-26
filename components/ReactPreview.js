import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const CodeMirror = dynamic(
  () => import('@uiw/react-codemirror').then((mod) => mod.UncontrolledReactCodeMirror),
  { ssr: false }
);

const defaultCode = `
function App() {
  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h1 className="text-2xl font-bold mb-2">Hello, React!</h1>
      <p>This is a live preview of your React code.</p>
    </div>
  );
}
`;

export default function ReactPreview() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        try {
          const transformedCode = window.Babel.transform(code, {
            presets: ['react'],
          }).code;
          const executeCode = new Function('React', 'ReactDOM', `
            ${transformedCode}
            ReactDOM.render(React.createElement(App), document.getElementById('preview'));
          `);
          executeCode(window.React, window.ReactDOM);
          setOutput('');
        } catch (error) {
          setOutput(error.toString());
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="w-full md:w-1/2 p-4">
        <h2 className="text-xl font-semibold mb-2">React Code</h2>
        {typeof window !== 'undefined' && (
          <CodeMirror
            value={code}
            height="calc(100vh - 100px)"
            theme="dark"
            onChange={(value) => setCode(value)}
            options={{
              mode: 'jsx',
            }}
          />
        )}
      </div>
      <div className="w-full md:w-1/2 p-4">
        <h2 className="text-xl font-semibold mb-2">Preview</h2>
        <div id="preview" className="border rounded-lg p-4 bg-white h-[calc(100vh-100px)] overflow-auto"></div>
        {output && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 rounded text-red-700">
            {output}
          </div>
        )}
      </div>
    </div>
  );
}
