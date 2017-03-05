$(document).ready(function(){
    console.log('LOADED');
    PumprApp.init();
    //PumprApp.exec();
});


var PumprApp = (function() {
  var table = null;
  var form = null;

  var hideAll = function() {
    $('#pumprTable, #pumprForm, #pumprChart').hide();
    $('#list, #new, #chart').removeClass('active');
  };

  var displayTable = function() {
    $('#pumprTable').show();
    $('#list').addClass('active');
  };

  var displayForm = function() {
    $('#pumprForm').show();
    $('#new').addClass('active');
  };

  var displayChart = function() {
    $('#pumprChart').show();
    $('#chart').addClass('active');
  };

  var init = function() {

    $('#list').click((e) => {
      hideAll();
      table.refresh();
      displayTable();
    });

    $('#new').click((e) => {
      hideAll();
      form.createFillup();
      displayForm();
    });

    $('#charts').click((e) => {
      hideAll();
      // ???
      displayChart();
    });

    PumprUI.editCallback((fillup) => {
      form.updateFillup(fillup, (oldFillup, newFillup) => {
        PumprREST.update(oldFillup.id, newFillup, () => {
          //table.refresh();
          $('#list').trigger('click');
        });
      });
    });

    PumprUI.deleteCallback((fillup) => {
      if(confirm('Really?')) {
        PumprREST.destroy(fillup.id, () => {
          //table.refresh();
          $('#list').trigger('click');
        });
      }
    });

    table = TableWidget('fills');
    form = FormWidget();

    table.refresh();
    //form.createFillup();
  };

  var FormWidget = function() {
    var create = function(callback) {
      $('#pumprForm').children().remove();

      $('#pumprForm').append(PumprUI.form(null, 'createForm', (fillup) => {
        PumprREST.create(fillup, (newFill) => {
          //table.refresh();
          $('#list').trigger('click');
        });
      }));
    };

    var update = function(oldFill, callback) {
      $('#pumprForm').children().remove();

      $('#pumprForm').append(PumprUI.form(oldFill, 'updateForm', (fillup) => {
        PumprREST.update(oldFill.id, fillup, (newFill) => {
          callback(oldFill, newFill);
        });
      }));
    };

    return {
      //formId : () => formId,
      createFillup : create,
      updateFillup : update,
    };
  };

  var TableWidget = function(tableId) {
    var refresh = function() {
      $('#pumprTable').children().remove();

      PumprREST.index((fills) => {
        fills = PumprCalc.calcDerivedProps(fills);
        $('#pumprTable').append(PumprUI.table(fills, tableId));
      });
    };

    return {
      tableId : () => tableId,
      refresh : refresh,
    };
  };

  return {
    init : init,
  };

})();


/*






*/
