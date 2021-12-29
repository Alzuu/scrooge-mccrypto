import { useState, useEffect } from 'react';

const Information = (props) => {
  const [prices, setPrices] = useState([]);
  const [maxLenOfDecPrices, setMaxLenOfDecPrices] = useState(null);
  const [highestVolume, setHighestVolume] = useState({
    volume: null,
    date: null,
  });

  const dates = [props.data.startDate, props.data.endDate];
  const days = props.data.days;
  const data = props.data.jsonData;

  const formatDate = (date) => {
    const newDate = new Date(date).toLocaleDateString('en-gb', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

    const highestVolume = (total_volumes) => {
      let volumes = [];

      total_volumes.forEach((index) => {
        volumes.push(index[1]);
      });

      const highestVolume = Math.max(...volumes);
      const date = total_volumes.find((index) => index[1] === highestVolume)[0];

      return { volume: highestVolume, date };
    };
    setPrices(retrievePrices());
    setMaxLenOfDecPrices(maxLenOfDecPrices(retrievePrices()));
    setHighestVolume(highestVolume(data.total_volumes));
    console.log('useEffect ran');
  }, [data, days]);

  return (
    <div className="info">
      <h2>
        Information from {formatDate(dates[0])} to {formatDate(dates[1])}
      </h2>
      <h3>Longest bearish trend within these dates was: {maxLenOfDecPrices}</h3>
      <h3>
        Highest trading volume: {highestVolume.volume}€ on{' '}
        {formatDate(highestVolume.date)}
      </h3>
    </div>
  );
};

export default Information;
