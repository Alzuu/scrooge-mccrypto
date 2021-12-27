import { useState } from 'react';

const Form = ({ analyze }) => {
  const [startDate, setStartDate] = useState({ date: '', number: '' });
  const [endDate, setEndDate] = useState({ date: '', number: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${startDate.number}&to=${endDate.number}`
    )
      .then((response) => response.json())
      .then((json) =>
        analyze({
          startDate: startDate.date,
          endDate: endDate.date,
          days: (endDate.number - startDate.number) / 86400,
          jsonData: json,
        })
      )
      .catch((error) => console.error(error));
  };
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="start">Start date:</label>
      <input
        type="date"
        name="start-date"
        id="start"
        onChange={(event) =>
          setStartDate({
            date: event.target.value,
            number: Math.floor(event.target.valueAsDate.getTime() / 1000),
          })
        }
        required
      />
      <label htmlFor="end">End date:</label>
      <input
        type="date"
        name="end-date"
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
        required
        disabled={!startDate.date}
      />
      <input type="submit" value="Analyze" />
    </form>
  );
};

export default Form;
