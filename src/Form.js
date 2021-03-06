import { useState } from 'react';

const Form = ({ analyze }) => {
  const [startDate, setStartDate] = useState({ date: '', number: '' });
  const [endDate, setEndDate] = useState({ date: '', number: '' });

  const today = new Date().toLocaleDateString('en-ca');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${startDate.number}&to=${endDate.number}`
      );
      const data = await res.json();
      await analyze({
        startDate: startDate.date,
        endDate: endDate.date,
        days: (endDate.number - startDate.number) / 86400,
        jsonData: data,
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <form className="form" onSubmit={handleSubmit}>
      <div id="start-field">
        <label htmlFor="start-date">📆 Start date: </label>
        <input
          type="date"
          name="start"
          id="start"
          onChange={(event) =>
            setStartDate({
              date: event.target.value,
              number: Math.floor(event.target.valueAsDate.getTime() / 1000),
            })
          }
          max={today}
          required
        />
      </div>
      <div id="end-field">
        <label htmlFor="end">🔚 End date: </label>
        <input
          type="date"
          name="end"
          id="end"
          onChange={(event) =>
            setEndDate({
              date: event.target.value,
              // 3600s (1h) is added to make sure data is gotten for the end date
              number:
                Math.floor(event.target.valueAsDate.getTime() / 1000) + 3600,
            })
          }
          min={startDate.date}
          max={today}
          required
        />
      </div>
      <input type="submit" id="submit" value="Analyze 🚀" />
    </form>
  );
};

export default Form;
