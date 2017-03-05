
var PumprCalc = (function(){
  var calc = {};

  calc.calcDerivedProps = function(fillups) {
    // ['miles', 'cost', 'mpg', 'costPerMile']

    var prevFill = null;
    _.sortBy(fillups, 'date').forEach((fill) => {
      if(prevFill !== null) {
        fill.miles = fill.odometer - prevFill.odometer;
        if(fill.miles < 0) {
          delete fill.miles;
          throw 'bad odometer value';
        }
      }

      fill.cost = fill.gallons * fill.dollarsPerGallon;

      if(fill.miles) {
        fill.mpg = fill.miles / fill.gallons;
        fill.costPerMile = fill.cost / fill.miles;
      }

      prevFill = fill;
    });

    return fillups;
  };


  calc.calcFillupStats = function(fillups) {
    var stats = {};

    fillups = _.sortBy(fillups, 'date');

    ['gallons', 'miles', 'cost', 'mpg', 'costPerMile'].forEach((prop) => {
      stats = _.extend(stats, propSumHiLoAvg(fillups, prop));
    });

    return stats;
  };

  var propSumHiLoAvg = function(fillups, prop) {
    if(!fillups)
      return {};

    var retVals = {};
    var n = 0;

    retVals[prop + 'Hi'] = fillups[0][prop];
    retVals[prop + 'Lo'] = fillups[0][prop];
    retVals[prop + 'Sum'] = 0;

    fillups.forEach((fill) => {
      //if(isNaN(fill[prop]))
      if(fill[prop] !== null && !isNaN(fill[prop])) {
        if(retVals[prop + 'Hi'] === undefined || fill[prop] > retVals[prop + 'Hi']) {
          retVals[prop + 'Hi'] = fill[prop];
        }

        if(retVals[prop + 'Lo'] === undefined || fill[prop] < retVals[prop + 'Lo']) {
          retVals[prop + 'Lo'] = fill[prop];
        }
        //retVals[prop + 'Hi'] = (fill[prop] > retVals[prop + 'Hi']) ? fill[prop] : retVals[prop + 'Hi'];

        retVals[prop + 'Sum'] += fill[prop];
        n += 1;
      }
    });

    retVals[prop + 'Avg'] = retVals[prop + 'Sum']/n;

    return retVals;
  };

  return calc;
})();
