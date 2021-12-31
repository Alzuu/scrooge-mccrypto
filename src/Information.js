import { useState, useEffect, useRef } from "react";

const Information = (props) => {
  const [maxLenOfDecPrices, setMaxLenOfDecPrices] = useState(null);
  const [highestVolume, setHighestVolume] = useState({
    value: null,
    date: null,
  });
  const [bestBuyDate, setBestBuyDate] = useState({ value: null, date: null });
  const [bestSellDate, setBestSellDate] = useState({ value: null, date: null });

  const dates = [props.data.startDate, props.data.endDate];
  const days = props.data.days;
  const data = props.data.jsonData;
  let prices = useRef([]);
  const formatDate = (date) => {
    const newDate = new Date(date).toLocaleDateString("en-gb", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return newDate;
  };

  useEffect(() => {
    const retrievePrices = () => {
      let inputArray;
      let prices = [];
      if (days > 1 && days <= 90) {
        /* Split array of all prices into smaller chunks and return the first
      data point of each day as the day's price.
      Max chunk size is 24, since API returns hourly data of prices from
      a range of 1 to 90 days */
        const chunkSize = 24;
        inputArray = data.prices.reduce((resultArray, item, index) => {
          const chunkIndex = Math.floor(index / chunkSize);
          if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
          }
          resultArray[chunkIndex].push(item);
          return resultArray;
        }, []);
        inputArray.forEach((array) => {
          prices.push(array[0]);
        });
        return prices;
      }
      prices = data.prices;
      return prices;
    };

    const maxLenOfDecPrices = (prices) => {
      // 'max' stores the length of the longest decreasing subarray
      // 'len' stores the lengths of longest decreasing subarrays
      // at different instants of time
      let max = 0,
        len = 0;

      for (let i = 1; i < prices.length; i++) {
        // if current element is less than previous element,
        // increase 'len'
        if (prices[i][1] < prices[i - 1][1]) {
          len++;
        } else {
          // if 'len' surpasses 'max' lengthwise, update 'max'
          if (max < len) {
            max = len;
          }
          // reset 'len' for new subarray
          len = 0;
        }
      }
      // compare the length of the last decreasing subarray with 'max'
      if (max < len) {
        max = len;
      }

      return max;
    };

    const findHighestValue = (array) => {
      let values = [];

      array.forEach((index) => {
        values.push(index[1]);
      });

      const highestValue = Math.max(...values);
      const date = array.find((index) => index[1] === highestValue)[0];

      return { value: highestValue, date };
    };

    const findLowestValue = (array) => {
      let values = [];

      array.forEach((index) => {
        values.push(index[1]);
      });

      const lowestValue = Math.min(...values);
      const date = array.find((index) => index[1] === lowestValue)[0];

      return { value: lowestValue, date };
    };
    prices.current = retrievePrices();
    setMaxLenOfDecPrices(maxLenOfDecPrices(retrievePrices()));
    setHighestVolume(findHighestValue(data.total_volumes));
    setBestBuyDate(findLowestValue(prices.current));
    setBestSellDate(findHighestValue(prices.current));
  }, [data, days]);

  const shouldBuyOrSell = maxLenOfDecPrices !== prices.current.length - 1;

  return (
    <div>
      <h2 className="date-range">
        {formatDate(dates[0])} ➡️ {formatDate(dates[1])}
      </h2>
      <div className="cards">
        <div className="card card-1">
          <div className="card-icon">📉</div>
          <p className="info">Longest bearish trend within these dates</p>
          <p className="value">{days >= 1 ? maxLenOfDecPrices : 0}</p>
        </div>
        <div className="card card-2">
          <div className="card-icon">📊</div>
          <p className="info">Highest trading volume</p>
          <p className="value">
            {highestVolume.value} on {formatDate(highestVolume.date)}
          </p>
        </div>
        <div className="card card-3">
          {shouldBuyOrSell && days >= 1 ? (
            <>
              <div className="card-icon">💰</div>
              <p className="info">
                Best day to buy: {formatDate(bestBuyDate.date)}
              </p>
              <p className="value">
                Best day to sell: {formatDate(bestSellDate.date)}
              </p>
            </>
          ) : (
            <>
              <div className="card-icon">🛑</div>
              <p className="stop">Don't Buy & Don't Sell</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Information;
