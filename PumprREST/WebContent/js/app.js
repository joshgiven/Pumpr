$(document).ready(function(){
    console.log('LOADED');
    PumprApp.init();
    //PumprApp.exec();
});


var PumprApp = (function() {
  var table = null;
  var form = null;

  var hideAll = function() {
    $('#pumprStats, #pumprTable, #pumprForm, #pumprCharts').hide();
    $('#stats, #list, #new, #charts').removeClass('active');
  };

  var displayStats = function() {
    hideAll();
    //table.refresh();
    $('#pumprStats').show();
    $('#stats').addClass('active');
  };

  var displayTable = function() {
    hideAll();
    table.refresh();
    $('#pumprTable').show();
    $('#list').addClass('active');
  };

  var displayForm = function() {
    hideAll();
    form.doCreate();
    //$('#pumprTable').show(); //?
    $('#pumprForm').show();
    $('#new').addClass('active');
  };

  var displayEditForm = function(fillup) {
    hideAll();
    form.doUpdate(fillup);
    $('#pumprTable').show(); //?
    $('#pumprForm').show();
    $('#list').addClass('active');
    location.href = "#pumprForm";
  };

  var displayChart = function() {
    hideAll();
    // ???
    PumprREST.index((fills) => {
      fills = PumprCalc.calcDerivedProps(fills);
      PumprUI.chart(fills, PumprCalc.calcFillupStats(fills));
    });

    $('#pumprCharts').show();
    $('#charts').addClass('active');
  };

  var setupHandlers = function(){
      $('#list').click((e) => {
        displayTable();
      });

      $('#stats').click((e) => {
        //console.log('click stats');
        displayStats();
      });

      $('#new').click((e) => {
        displayForm();
      });

      $('#charts').click((e) => {
        displayChart();
      });
  };

  var setupChartHandlers = function() {
    //'#chartTab1','#chartTab2','#chartTab3'
    //'#chart1','#chart2','#chart3'

    $('#chartTab1').click((e) => {
      $('#chart1, #chart2, #chart3').hide();
      $('#chartTab1, #chartTab2, #chartTab3').removeClass('active');

      PumprREST.index(function(fills) {
        fills = PumprCalc.calcDerivedProps(fills);
        PumprUI.chart(fills, PumprCalc.calcFillupStats(fills));
      });

      $('#chart1').show();
      $('#chartTab1').addClass('active');
    });

    $('#chartTab2').click((e) => {
      $('#chart1, #chart2, #chart3').hide();
      $('#chartTab1, #chartTab2, #chartTab3').removeClass('active');


      // gen chart

      $('#chart2').show();
      $('#chartTab2').addClass('active');
    });

    $('#chartTab3').click((e) => {
      $('#chart1, #chart2, #chart3').hide();
      $('#chartTab1, #chartTab2, #chartTab3').removeClass('active');

      // gen chart

      $('#chart3').show();
      $('#chartTab3').addClass('active');
    });

  };

  var setupTableHandlers = function() {
    PumprUI.editCallback((fillup) => {
      // form.doUpdate(fillup/*, (oldFillup, newFillup) => {
      //   PumprREST.update(oldFillup.id, newFillup, () => {
      //     //table.refresh();
      //     $('#list').trigger('click');
      //   });
      // }*/);
      // $('#pumprForm').show();
      displayEditForm(fillup);
    });

    PumprUI.deleteCallback((fillup) => {
      if(confirm('Really?')) {
        PumprREST.destroy(fillup.id, () => {
          //table.refresh();
          $('#list').trigger('click');
        });
      }
    });
  };

  var init = function() {
    setupHandlers();
    setupTableHandlers();
    setupChartHandlers();

    table = TableWidget('fills');
    form = FormWidget();

    //table.refresh();
    //form.doCreate();
    $('#list').trigger('click');
  };

  var FormWidget = function() {
    var create = function(/*callback*/) {
      $('#pumprForm').children().remove();

      $('#pumprForm').append(PumprUI.form(null, 'createForm', (fillup) => {
        PumprREST.create(fillup, (newFill) => {
          $('#list').trigger('click');
        });
      }));

      $('input[name=date]').datepicker({format: "yyyy-mm-dd"});
    };

    var update = function(oldFill /*, callback*/) {
      $('#pumprForm').children().remove();

      $('#pumprForm').append(PumprUI.form(oldFill, 'updateForm', (fillup) => {
        PumprREST.update(oldFill.id, fillup, (newFill) => {
          $('#list').trigger('click');
        });
      }));

      $('input[name=date]').datepicker({format: "yyyy-mm-dd"});
    };

    return {
      //formId : () => formId,
      doCreate : create,
      doUpdate : update,
    };
  };

  var TableWidget = function(tableId) {
    var refresh = function() {

      PumprREST.index((fills) => {
        fills = PumprCalc.calcDerivedProps(fills);
        $('#pumprTable').children().remove();
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
