// TODO: usage docs.

glob.NetworkGlob = glob.NewGlobType(
  null,
  {
    init: function(publishKey, subscribeKey) {
      if (publishKey && subscribeKey) {
        this.pubnub = PUBNUB.init({
           publish_key   : publishKey,
           subscribe_key : subscribeKey
        });
      }
      else if (publishKey) {
        this.pubnub = PUBNUB.init({
           publish_key   : publishKey,
        });
      }
      else if (subscribeKey) {
        this.pubnub = PUBNUB.init({
           subscribe_key : subscribeKey
        });
      }
    },

    subscribe: function(channel, onMessagedCallback, onSubscribeCallback) {
      this.pubnub.subscribe({
        channel : channel,
        message : onMessagedCallback,
        connect: onSubscribeCallback
      });
    },

    publish: function(channel, message, onPublishCallback) {
      this.pubnub.publish({
        channel: channel,
        message: message,
        callback: onPublishCallback
      });
    },

  }
);
