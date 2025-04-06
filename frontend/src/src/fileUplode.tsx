import React, { useState } from 'react';

const FileInputComponent = () => {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState('Submit');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setStatus('submit');
    setInputText(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setStatus('In Progress');
    setErrorMessage('');

    try {
      const response = await fetch(`http://localhost:8000/process-hls?path=${inputText}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setStatus('Success');
        console.log(data); // Handle the response as needed
      } else {
        setStatus('Failed');
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Unknown error');
      }
    } catch (error) {
      setStatus('Failed');
      setErrorMessage('Error connecting to the server');
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
      {status === 'Failed' && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default FileInputComponent;
