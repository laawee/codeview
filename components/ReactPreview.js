import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Script from 'next/script';

const CodeMirror = dynamic(
  () => {
    console.log('Loading CodeMirror...');
    return import('@uiw/react-codemirror').then((mod) => {
      console.log('CodeMirror loaded successfully');
      return mod.UncontrolledReactCodeMirror;
    }).catch(err => {
      console.error('Failed to load CodeMirror:', err);
      return () => <div>Failed to load CodeMirror</div>;
    });
  },
  { ssr: false, loading: () => <div>Loading CodeMirror...</div> }
);

const defaultCode = `
function App() {
  return (
    import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSearch, faShare } from '@fortawesome/free-solid-svg-icons';

const HomeRenovationExamples = () => {
  const examples = [
    {
      id: 1,
      title: '淋浴间共用，分区节省空间',
      tags: ['户型改造', '干湿分离', '洗衣区'],
      author: '老薛设计空间',
      image: '/api/placeholder/400/300'
    },
    {
      id: 2,
      title: '56㎡小两居变身三室两厅',
      tags: ['户型改造', '儿童房', '洗衣区'],
      author: '老薛设计空间',
      image: '/api/placeholder/400/300'
    },
    {
      id: 3,
      title: '天琴园｜早C晚A? 她为了早T晚A装了套房',
      tags: ['单身', '洗衣区', '衣帽间'],
      author: '小被窝',
      image: '/api/placeholder/400/300'
    },
    {
      id: 4,
      title: '大主卧改两室，增设书房+客房',
      tags: ['儿童房', '榻榻米', '书房', '衣帽间'],
      author: '老薛设计空间',
      image: '/api/placeholder/400/300'
    },
  ];

  return (
    <div className="bg-gray-100 p-4">
      <div className="flex items-center mb-4">
        <FontAwesomeIcon icon={faChevronLeft} className="text-gray-600 mr-4" />
        <div className="flex-1 bg-white rounded-full p-2 flex items-center">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2" />
          <input type="text" placeholder="洗衣区" className="w-full outline-none" />
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <button className="font-bold border-b-2 border-black">案例</button>
        <button className="text-gray-500">图片</button>
        <button className="text-gray-500">商品</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {examples.map((example) => (
          <div key={example.id} className="bg-white rounded-lg overflow-hidden">
            <img src={example.image} alt={example.title} className="w-full h-40 object-cover" />
            <div className="p-2">
              <h3 className="font-bold text-sm mb-1">{example.title}</h3>
              <div className="flex flex-wrap">
                {example.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-gray-200 rounded px-1 mr-1 mb-1">{tag}</span>
                ))}
              </div>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <FontAwesomeIcon icon={faShare} className="mr-1" />
                <span>{example.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeRenovationExamples;
  );
}
`;

export default function ReactPreview() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [codeMirrorReady, setCodeMirrorReady] = useState(false);

  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  }, []);

  useEffect(() => {
    if (!scriptsLoaded) return;
    console.log('Scripts loaded, attempting to execute code');

    const timer = setTimeout(() => {
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
        console.log('Code executed successfully');
      } catch (error) {
        console.error('Error executing code:', error);
        setOutput(error.toString());
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [code, scriptsLoaded]);

  const handleCodeChange = (value) => {
    console.log('Code changed');
    setCode(value);
  };

  return (
    <>
      <Script
        src="https://unpkg.com/react@17/umd/react.development.js"
        onLoad={() => {
          console.log('React loaded');
          setScriptsLoaded(prev => prev || false);
        }}
      />
      <Script
        src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"
        onLoad={() => {
          console.log('ReactDOM loaded');
          setScriptsLoaded(prev => prev || false);
        }}
      />
      <Script
        src="https://unpkg.com/@babel/standalone/babel.min.js"
        onLoad={() => {
          console.log('Babel loaded');
          setScriptsLoaded(true);
        }}
      />

      <div className="flex flex-col md:flex-row h-screen bg-gray-100">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-xl font-semibold mb-2">React Code</h2>
          {typeof window !== 'undefined' ? (
            <CodeMirror
              value={code}
              height="calc(100vh - 100px)"
              theme="dark"
              onChange={handleCodeChange}
              options={{
                mode: 'jsx',
              }}
              onMount={() => {
                console.log('CodeMirror mounted');
                setCodeMirrorReady(true);
              }}
            />
          ) : (
            <div>CodeMirror is not available on the server side</div>
          )}
          {!codeMirrorReady && <div>Waiting for CodeMirror to be ready...</div>}
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
    </>
  );
}
