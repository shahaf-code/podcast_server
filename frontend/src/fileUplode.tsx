import React, { useState } from 'react';

const FileUploadComponent: React.FC = () => {
  // Gets a file path and a submit from the user.
  On submission, he sends a request to the server, that converts the data.
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      if (selectedFile.name.endsWith('.wav')) {
        setFile(selectedFile);
        setError(null); // Clear any previous errors
      } else {
        setError('Please select a valid .wav file.');
        setFile(null);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('No file selected.');
      return;
    }

    // Reset error state
    setError(null);

    // Implement file upload logic here
    // For example, using FormData to send the file to a server
    const formData = new FormData();
    formData.append('file', file);
    console.log("sending stuff")
    try {
      const response = await fetch(`http://localhost:8000/process-hls?path=${file.name}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('File upload failed.');
      }
      // Handle successful upload (e.g., display a success message)
    } catch (err) {
      setError("error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit">Submit</button>
    </form>
  );
};

export default FileUploadComponent;
