// Global messenger object.
glob.MessengerGlob = new glob.NewGlobType(
  // Static Definitions ///////////////////////////////////////////////////////
  null,
  // Instance Defintions //////////////////////////////////////////////////////
  // The Messenger is a purely static object, so it has no instance data.
  glob.Listeners
);

glob.Messenger = new glob.MessengerGlob();

