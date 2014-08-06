function includes(arr, obj) {
    return (arr.indexOf(obj) != -1);
}

function timestamp() {
    // Return unix timestamp with milliseconds accuracy.
    return +new Date()
}

var guid = (function() {
  // Generate a unique ID
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();
