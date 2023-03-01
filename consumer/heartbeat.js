// Overall functionality:
// provides constantly updated static property values for lastHeartbeat timestamp, lastHeartbeatDuration, longestHeartbeatDuration
// provides methods to turn on/off console log for each heartbeat event emitted
// provides methods to set/turn off breakpoint alert message when lastHeartbeatDuration exceeds inputted time interval
// TODO: Consider accessing saved consumer name for console logs

// These properties (with default values) on consumer.metrics are related to heartbeatOn function:
// consumer.metrics.lastHeartbeat = 0;
// consumer.metrics.lastHeartbeatDuration = 0;
// consumer.metrics.longestHeartbeatDuration = 0;

// consumer.metrics.options.heartbeat.logOn = false;
// consumer.metrics.options.heartbeat.breakpoint = null;

function heartbeatOn(consumer) {
  // initializes event emitter for HEARTBEAT
  consumer.on('consumer.heartbeat', (e) => {
    // console logs the heartbeat timestamp if logOn is turned on thru logOn method
    if (consumer.metrics.options.heartbeat.logOn) {
      if (consumer.metrics.name) {
        console.log(
          `heartbeat emitted at ${e.timestamp} for consumer ${consumer.metrics.name} (member id: ${consumer.metrics.memberId})`
        );
      } else {
        console.log(
          `heartbeat emitted at ${e.timestamp} for consumer (member id: ${consumer.metrics.memberId})`
        );
      }
    }
    //calculate and update metrics:

    // if this is the first heartbeat, set lastHeartbeat to equal e.timestamp. skip other updates
    if (consumer.metrics.lastHeartbeat === 0) {
      consumer.metrics.lastHeartbeat = e.timestamp;
    } else {
      // calculates and updates lastHeartbeatDuration
      const lastDuration = e.timestamp - consumer.metrics.lastHeartbeat;
      consumer.metrics.lastHeartbeatDuration = lastDuration;
      if (lastDuration > consumer.metrics.longestHeartbeatDuration) {
        consumer.metrics.longestHeartbeatDuration = lastDuration;
      }
      // updates lastHeartbeat with most recent timestamp
      consumer.metrics.lastHeartbeat = e.timestamp;

      // conditional for sending breakpoint alert (if turned on thru breakpointOn method)

      if (
        consumer.metrics.options.heartbeat.breakpoint &&
        consumer.metrics.lastHeartbeatDuration &&
        consumer.metrics.lastHeartbeatDuration >
          consumer.metrics.options.heartbeat.breakpoint
      ) {
        const msExceeded =
          lastDuration - consumer.metrics.options.heartbeat.breakpoint;
        if (consumer.metrics.name) {
          console.warn(
            `BREAKPOINT ALERT: heartbeat breakpoint exceeded by ${msExceeded}ms for consumer ${consumer.metrics.name} (member id: ${consumer.metrics.memberId})`
          );
        } else {
          console.warn(
            `BREAKPOINT ALERT: heartbeat breakpoint exceeded by ${msExceeded}ms for consumer (member id: ${consumer.metrics.memberId})`
          );
        }
      }

      // ADD FUNCTIONALITY TO DISCONNECT EVENT EMITTER IF A DISCONNECT EVENT OCCURS
      // RESET LAST HEARTBEAT, LASTHEARTBEAT DURATION, LONGEST HEARTBEAT DURATION
    }
  });
}

module.exports = heartbeatOn;
