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

    // [
    //   $('<input>').attr('type', 'input').attr('placeholder', propDisplay[prop]).val(fillup[prop]), //.datepicker(),
    //   $('<input>').attr('type', 'input').val(fillup.gallons),
    //   $('<input>').attr('type', 'input').val(fillup.dollarsPerGallon),
    //   $('<input>').attr('type', 'input').val(fillup.odometer),
    //   $('<input>').attr('type', 'input').val(fillup.comments),
    // ];

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
      // $form.append($elem, $('<br>'));
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
        // $('<button>').text('edit').click((e) => { console.log(fill.id); }),
        // $('<button>').text('delete').click((e) => { console.log(fill.id); })
      );

      $tbody.append($tr);
    });

    var $table = $('<table>').attr('id', tableId)
                             .addClass('table')
                             .append($thead, $tbody);

    //$thead.css('border', '1px solid black');
    // .css('border-spacing', '0')
    // .css('border-collapse', 'collapse')
    //$('#'+ tableId +' tbody tr:nth-child(odd)').css('background', 'Azure');
    //$('tbody tr:nth-child(odd)').css('background', 'Azure');

    return $table;
  };

  var fillupsToChart = function(fillups, stats) {

    // fillup props
    // [ 'date', 'gallons', 'dollarsPerGallon', 'cost', 'odometer',
    //             'miles', 'mpg', 'costPerMile', 'comments' ];

    var grabem = function(fills, prop) {
      return fills.reduce((arr, fill) => {
        arr.push(fill[prop]);
        return arr;
      }, []);
    };

    var dates = grabem(fillups, 'date');
    var dpgs  = grabem(fillups, 'dollarsPerGallon').map((dpg) => propDisplay['dollarsPerGallon'].fmt(dpg));
    var cpms  = grabem(fillups, 'costPerMile').map((cpm) => propDisplay['costPerMile'].fmt(cpm));

    // stats
    // ['gallons', 'miles', 'cost', 'mpg', 'costPerMile'] x [hi, lo, sum, avg]

    var data = {
        //labels: ["January", "February", "March", "April", "May", "June", "July"],
        labels: dates,
        datasets: [
            {
                label: "pump ($/gal)",
                fill: false,
                // lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                // borderColor: "rgba(75,192,192,1)",
                // borderCapStyle: 'butt',
                // borderDash: [],
                // borderDashOffset: 0.0,
                // borderJoinStyle: 'miter',
                // pointBorderColor: "rgba(75,192,192,1)",
                // pointBackgroundColor: "#fff",
                // pointBorderWidth: 1,
                // pointHoverRadius: 5,
                // pointHoverBackgroundColor: "rgba(75,192,192,1)",
                // pointHoverBorderColor: "rgba(220,220,220,1)",
                // pointHoverBorderWidth: 2,
                // pointRadius: 1,
                // pointHitRadius: 10,
                ///data: [65, 59, 80, 81, 56, 55, 40],
                data: dpgs,
                // spanGaps: false,
                //maintainAspectRatio: true,
                //responsize: true,
            },
            // {
            //   label: "cost ($/mi)",
            //   fill: false,
            //   data: cpms,
            // }
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
            // {
            //   ticks: {
            //       beginAtZero:false
            //   }
            //}
          ]
        }
    };

    var ctx = $('#chart1'); //.width(800).height(800);

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



/*


  this space intentionally left blank



*/
