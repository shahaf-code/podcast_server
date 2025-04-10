import React, { useEffect, useState } from 'react';

const ProgressBar: React.FC = () => {
  const [percent, setPercent] = useState<number>(0);
  const [status, setStatus] = useState<string>('Waiting...');

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8000/process-hls');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'progress') {
        setPercent(parseFloat(data.percent));
        setStatus(`Processing: ${data.percent}%`);
      } else if (data.type === 'done') {
        setStatus('Conversion complete!');
        setPercent(100);
        eventSource.close();
      } else if (data.type === 'error') {
        setStatus(`Error: ${data.message}`);
        eventSource.close();
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', textAlign: 'center' }}>
      <h2>{status}</h2>
      <progress value={percent} max={100} style={{ width: '100%' }} />
      <p>{percent.toFixed(2)}%</p>
    </div>
  );
};

export default ProgressBar;
