import Pusher from 'pusher-js';

export default function getPusherInstance({ pusherAppKey, pusherAppCluster, nodeEnv }) {
  if (nodeEnv && nodeEnv !== 'production') {
    Pusher.logToConsole = true;
  }

  if (!(pusherAppCluster && pusherAppKey)) {
    throw Error('Pusher Configuration Not Provided');
  }

  let pusher;

  try {
    pusher = new Pusher(pusherAppKey, {
      cluster: pusherAppCluster,
    });
  } catch (e) {
    // TODO better error handling
    console.log(e);
  }

  return pusher;
}
