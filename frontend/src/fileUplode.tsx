import React, { useState } from 'react';

const FileInputComponent = () => {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState('Submit');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setStatus('submit');
    setInputText(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setStatus('In Progress');
    setStatusMessage('');

    try {
      const response = await fetch(`http://localhost:8000/process-hls?path=${inputText}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response;
        setStatusMessage(`Successefully converted!`);
        setStatus('Success');
      } else {
        setStatus('Failed');
        const errorData = await response.json();
        setStatusMessage('Invalid Input file');
      }
    } catch (error) {
      setStatus('Failed');
      setStatusMessage("Unexpected server error");
    }
  };
  // Function to determine button color based on status
  const getButtonColor = () => {
    switch (status) {
      case 'In Progress':
        return { backgroundColor: 'blue', color: 'white' };
      case 'Success':
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
      {status === 'Failed' && <p style={{ color: 'red' }}>{statusMessage}</p>}
      {status === 'Success' && <p style={{ color: 'green' }}>{statusMessage}</p>}
    </div>
  );
};

export default FileInputComponent;
