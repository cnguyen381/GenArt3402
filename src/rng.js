(function (ns) {
  "use strict";

  function create(seed) {
    let state = seed >>> 0;
    return function next() {
      state = (state + 0x6D2B79F5) >>> 0;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function nextSeed(seed) {
    return ((seed >>> 0) + 1) >>> 0;
  }

  ns.RNG = { create, nextSeed };
})(window.VenusArt = window.VenusArt || {});
