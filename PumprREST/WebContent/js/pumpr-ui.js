var PumprUI = (function() {

  var propDisplay = {
    'date'             : { header: 'Date',          fmt: (d)   => d },
    'gallons'          : { header: 'Vol (gal)',     fmt: (g)   => g.toFixed(2) },
    'dollarsPerGallon' : { header: 'Price ($/gal)', fmt: (dpg) => /*'$'*/ + dpg.toFixed(3) },
    'cost'             : { header: 'Cost ($)',      fmt: (c)   => /*'$'*/ + c.toFixed(2) },
    'odometer'         : { header: 'Odometer (mi)', fmt: (o)   => o.toFixed(1) },
    'miles'            : { header: 'Distance (mi)', fmt: (mi)  => (_.isUndefined(mi)) ? '' : mi.toFixed(1)},
    'mpg'              : { header: 'MPG (mi/gal)',  fmt: (mpg) => (_.isUndefined(mpg)) ? '' : mpg.toFixed(2) },
    'costPerMile'      : { header: 'Cost ($/mi)',   fmt: (cpm) => (_.isUndefined(cpm)) ? '' : /*'$'*/ + cpm.toFixed(2) },
    'comments'         : { header: 'Comments',      fmt: (c)   => c },
  };

  var cols = [ 'date', 'gallons', 'dollarsPerGallon', 'cost', 'odometer',
               'miles', 'mpg', 'costPerMile', 'comments' ];

  var formProps = ['date','gallons','dollarsPerGallon','odometer','comments'];

  var fillupForm = function(fillup, formId, callback) {
    if(!fillup)
      fillup = {};

    $elems = formProps.map((prop) => {
      //console.log(prop);
      return $('<input>').attr('type', 'input')
                         .attr('name', prop)
                         .attr('placeholder', propDisplay[prop].header)
                         .addClass('form-control')
                         .val(fillup[prop]);
    });

    $elems.push(
      $('<button>').text('submit').addClass('btn btn-success').click((e) => {
        console.log('submit');
        e.preventDefault();
        callback(formDataToFillup($form));
        $form.trigger('reset');
      })
    );

    var $form = $('<form>').attr('id',formId);
    $elems.forEach(($elem) => {
      $form.append($elem);
    });

    $('input[name=date]').datepicker({
        format: "yyyy-mm-dd",
        todayBtn: true
    });

    return $form;
  };

  var formDataToFillup = function($form) {
    return $form.serializeArray().reduce((obj, p) => { obj[p.name] = p.value; return obj; }, {});
  };

  var fillupsToTable = function(fillups, tableId) {

    var $thead = $('<thead><tr>').append(
      cols.map((col) => $('<th>').text(propDisplay[col].header))
    );

    var sortCriteria = 'date';

    var $tbody = $('<tbody>');
    _.sortBy(fillups, sortCriteria).forEach((fill) => {
      var $tr = $('<tr>').attr('name', fill.id);

      cols.forEach((col) => {
        $tr.append($('<td>').attr('name', col).text(propDisplay[col].fmt(fill[col])));
      });

      $tr.append(
        $('<button>').text('edit')
                     .addClass('btn btn-primary')
                     .click((e) => editFunction(fill) ),

        $('<button>').text('delete')
                     .addClass('btn btn-danger')
                     .click((e) => deleteFunction(fill) )
      );

      $tbody.append($tr);
    });

    var $table = $('<table>').attr('id', tableId)
                             .addClass('table table-striped table-hover')
                             .append($thead, $tbody);

    return $table;
  };

  var fillupsToChart = function(fillups, stats) {
    var grabem = function(fills, prop) {
      return fills.reduce((arr, fill) => {
        arr.push(fill[prop]);
        return arr;
      }, []);
    };

    var dates = grabem(fillups, 'date');

    var dpgs  = grabem(fillups, 'dollarsPerGallon').map((dpg) => propDisplay.dollarsPerGallon.fmt(dpg));
    lineGraphIt($('#chart1'), propDisplay.dollarsPerGallon.header, dates, dpgs);

    var cpms  = grabem(fillups, 'costPerMile').map((cpm) => propDisplay.costPerMile.fmt(cpm));
    lineGraphIt($('#chart2'), propDisplay.costPerMile.header, _.initial(dates), _.initial(cpms));

    var mpgs  = grabem(fillups, 'mpg').map((x) => propDisplay.mpg.fmt(x));
    lineGraphIt($('#chart3'), propDisplay.mpg.header, _.initial(dates), _.initial(mpgs));

    $('#chart1, #chart2, #chart3').hide();
  };

  var lineGraphIt = function(ctx, desc, dates, dataPoints) {
    //"rgba(75,192,192,0.4)"
    var randomColor = (function(){
      var r = _.random(0, 255);
      var g = _.random(0, 255);
      var b = _.random(0, 255);
      var a = '0.' + _.random(1, 9);
      return 'rgba('+ [r,g,b,a].join(',') +')';
    })();

    var data = {
        labels: dates,
        datasets: [
            {
                label: desc,
                fill: false,
                //backgroundColor: "rgba(75,192,192,0.4)",
                backgroundColor: randomColor,
                data: dataPoints,
            },
        ]
    };

    var options = {
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    displayFormats: {
                        quarter: 'MMM YYYY'
                    }
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero:false
                }
            },
          ]
        }
    };

    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: options
    });
  };

  var defaultCallback = function(fillup) { console.log(fillup.id); };
  var editFunction    = defaultCallback;
  var deleteFunction  = defaultCallback;

  var editCallback = function(newFunc) {
    if(newFunc) {
      editFunction = newFunc;
    }

    return editFunction;
  };

  var deleteCallback = function(newFunc) {
    if(newFunc) {
      deleteFunction = newFunc;
    }

    return deleteFunction;
  };

  return {
    table: fillupsToTable,
    form:  fillupForm,
    chart: fillupsToChart,
    editCallback: editCallback,
    deleteCallback: deleteCallback,
  };

})();
