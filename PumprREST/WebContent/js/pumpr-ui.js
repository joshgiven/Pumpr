var PumprUI = (function() {

  var headerNames = {
    'date'             : 'Date',
    'gallons'          : 'Vol (G)',
    'dollarsPerGallon' : 'Price ($/G)',
    'odometer'         : 'Mileage',
    'comments'         : 'Comments',
  };

  var cols = ['date','gallons','dollarsPerGallon','odometer','comments'];


  var fillupForm = function(fillup, formId, callback) {
    if(!fillup)
      fillup = {};

    // [
    //   $('<input>').attr('type', 'input').attr('placeholder', headerNames[prop]).val(fillup[prop]), //.datepicker(),
    //   $('<input>').attr('type', 'input').val(fillup.gallons),
    //   $('<input>').attr('type', 'input').val(fillup.dollarsPerGallon),
    //   $('<input>').attr('type', 'input').val(fillup.odometer),
    //   $('<input>').attr('type', 'input').val(fillup.comments),
    // ];

    $elems = cols.map((prop) => {
      //console.log(prop);
      return $('<input>').attr('type', 'input')
                         .attr('name', prop)
                         .attr('placeholder', headerNames[prop])
                         .addClass('form-control')
                         .val(fillup[prop]);
    });

    $elems.push(
      $('<button>').text('submit').addClass('btn', 'btn-success').click((e) => {
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

    return $form;
  };

  var formDataToFillup = function($form) {
    return $form.serializeArray().reduce((obj, p) => { obj[p.name] = p.value; return obj; }, {});
  };

  var fillupsToTable = function(fillups, tableId) {

    var $thead = $('<thead><tr>').append(
      cols.map((col) => $('<th>').text(headerNames[col]))
    );

    var sortCriteria = 'date';

    var $tbody = $('<tbody>');
    _.sortBy(fillups, sortCriteria).forEach((fill) => {
      var $tr = $('<tr>').attr('name', fill.id);

      cols.forEach((col) => {
        $tr.append($('<td>').attr('name', col).text(fill[col]));
      });

      $tr.append(
        $('<button>').text('edit').click((e) => editFunction(fill) ),
        $('<button>').text('delete').click((e) => deleteFunction(fill) )
        // $('<button>').text('edit').click((e) => { console.log(fill.id); }),
        // $('<button>').text('delete').click((e) => { console.log(fill.id); })
      );

      $tbody.append($tr);
    });

    var $table = $('<table>').attr('id', tableId).append($thead, $tbody);

    $thead.css('border', '1px solid black');

    // .css('border-spacing', '0')
    // .css('border-collapse', 'collapse')
    //$('#'+ tableId +' tbody tr:nth-child(odd)').css('background', 'Azure');
    //$('tbody tr:nth-child(odd)').css('background', 'Azure');

    return $table;
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
    editCallback: editCallback,
    deleteCallback: deleteCallback,
  };

})();



/*


  this space intentionally left blank



*/
