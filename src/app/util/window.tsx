let WINDOW = {};

if (typeof window !== "undefined") {
  // When code is on client-side. So we need to use actual methods and data.
  WINDOW = window;
} else {
  // When code is on server-side.

  // Other component are mostly server-side and need to match their logic and check their variable with other server-side components and logics.
  // So following code will be use for them to pass the logic checking.
  WINDOW = {
    document: {
      location: {},
    },
    localStorage: {
      getItem :() => {},
      setItem :() => {}
    },
  };
}


export default WINDOW;