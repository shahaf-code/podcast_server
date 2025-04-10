import React, { useEffect, useState } from 'react';
import ProgressBar from './prograssBar';

const FileInputComponent = () => {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState('Submit');
  const [statusMessage, setStatusMessage] = useState('');
  const [percent, setPercent] = useState(0);

  const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setStatus('submit');
    setInputText(e.target.value);
    setPercent(0);
    setStatusMessage('');

  };
  
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setStatus('In Progress');
    setPercent(0);
    setStatusMessage('');
    const encodedPath = encodeURIComponent(inputText);
    const eventSource = new EventSource(`http://localhost:8000/process-hls?path=${encodedPath}`);

    eventSource.onmessage = (event) => {
      console.log('SSE: ', event.data)
      const data = JSON.parse(event.data);
      if (data.type === 'progress') {
        setPercent(parseFloat(data.percent));
        setStatusMessage(`Progress: ${data.percent}%`);

      } else if (data.type === 'done') {
        setPercent(100);
        setStatus('Done');
        setStatusMessage('Successfully converted!');
        eventSource.close();
        } else if (data.type === 'error') {
        setStatus('Failed');
        setStatusMessage(`Error: ${data.message}`);
        eventSource.close();
        }
        }
    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      setStatus('Failed');
      setStatusMessage('Connection error.');
      eventSource.close();
    };
  };
  // Function to determine button color based on status
  const getButtonColor = () => {
    switch (status) {
      case 'In Progress':
        return { backgroundColor: 'blue', color: 'white' };
      case 'Done':
        return { backgroundColor: 'green', color: 'white' };
      case 'Failed':
        return { backgroundColor: 'red', color: 'white' };
      default:
        return { backgroundColor: 'gray', color: 'white' };
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={handleChange}
          placeholder="Enter text"
        />
        <button
          type="submit"
          style={getButtonColor()}
        >
          {status}
        </button>
      </form>
      <progress value={percent} max="100" style={{width: '60%', marginTop: '40px'}}/>

      {status === 'Failed' && <p style={{ color: 'red' }}>{statusMessage}</p>}
      {status === 'Done' && <p style={{ color: 'green' }}>{statusMessage}</p>}
    </div>
  );
};

export default FileInputComponent;
function setPercent(arg0: number) {
  throw new Error('Function not implemented.');
}

