import { useState } from 'react';
import './App.css';
import Form from './Form';
import Information from './Information';

const App = () => {
  const [data, setData] = useState(null);

  return (
    <div className="App">
      <div className="content">
        <h1 className="title">Scrooge McCrypto</h1>
        <Form analyze={async (json) => await setData(json)} />
        {data && <Information data={data} />}
      </div>
    </div>
  );
};

export default App;
