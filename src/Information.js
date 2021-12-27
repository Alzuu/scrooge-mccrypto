const Information = (props) => {
  const dates = [props.data.startDate, props.data.endDate];
  const days = props.data.days;
  const data = props.data.jsonData;

  const highestVolume = (total_volumes) => {
    let volumes = [];

    total_volumes.forEach((index) => {
      volumes.push(index[1]);
    });

    const highestVolume = Math.max(...volumes);
    const date = total_volumes.find((index) => index[1] === highestVolume)[0];

    return [highestVolume, date];
  };

  return (
    <>
      <h2>
        Information from {dates[0]} to {dates[1]}
      </h2>
      <h3>
        Highest trading volume: {highestVolume(data.total_volumes)[0]}€ on{' '}
        {new Date(highestVolume(data.total_volumes)[1]).toLocaleDateString(
          'en-gb',
          { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        )}
      </h3>
    </>
  );
};

export default Information;
