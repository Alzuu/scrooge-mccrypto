import { useState, useEffect } from 'react';
import './App.css';
import Form from './Form';
import Information from './Information';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('use effect ran');
    console.log(data);
  }, [data]);

  return (
    <div className="App">
      <div className="content">
        <h1>Scrooge McCrypto</h1>
        <Form analyze={(json) => setData(json)} />
        {data && <Information data={data} />}
      </div>
    </div>
  );
};

export default App;
