function calculateTimeoutRate(consumer) {
  let count = 0;
  const removeListener = consumer.on('consumer.network.request_timeout', () => {
    count += 1;
  });
  setTimeout(() => {
    removeListener();
    consumer.metrics.timeoutRate = count / 30;
  }, 30000);
}

function requestTimeoutRate(consumer) {
  setInterval(calculateTimeoutRate, 60000, consumer);
}

module.exports = requestTimeoutRate;
