$(document).ready(function() {
    console.log('LOADED');
    PumprApp.init();
});


var PumprApp = (function() {
  var table = null;
  var form = null;

  var hideAll = function() {
    $('#pumprStats, #pumprTable, #pumprForm, #pumprCharts, #pumprTest').hide();
    $('#stats, #list, #new, #charts, #test').removeClass('active');
  };

  var displayStats = function() {
    hideAll();

    // do something

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
    $('#pumprTable').show();
    $('#pumprForm').show();
    $('#list').addClass('active');
    location.href = "#pumprForm";
  };

  var displayDestroyConfirm = function(fillup) {
    if(confirm('Really?')) {
      PumprREST.destroy(fillup.id, () => {
        //table.refresh();
        $('#list').trigger('click');
      });
    }
  };

  var displayChart = function() {
    hideAll();

    PumprREST.index((fills) => {
      fills = PumprCalc.calcDerivedProps(fills);
      PumprUI.chart(fills, PumprCalc.calcFillupStats(fills));
      $('#chartTab1').trigger('click');
    });

    $('#pumprCharts').show();
    $('#charts').addClass('active');
  };

  var displayTest = function() {
    hideAll();
    $('#pumprTest').show();
    $('#test').addClass('active');
  };

  var setupHandlers = function(){
      $('#list').click((e) => {
        displayTable();
      });

      $('#stats').click((e) => {
        displayStats();
      });

      $('#new').click((e) => {
        displayForm();
      });

      $('#charts').click((e) => {
        displayChart();
      });

      $('#test').click((e) => {
        displayTest();
      });
  };

  var setupChartHandlers = function() {
    $('#chartTab1').click((e) => {
      $('#chart1, #chart2, #chart3').hide();
      $('#chartTab1, #chartTab2, #chartTab3').removeClass('active');

      $('#chart1').show();
      $('#chartTab1').addClass('active');
    });

    $('#chartTab2').click((e) => {
      $('#chart1, #chart2, #chart3').hide();
      $('#chartTab1, #chartTab2, #chartTab3').removeClass('active');

      $('#chart2').show();
      $('#chartTab2').addClass('active');
    });

    $('#chartTab3').click((e) => {
      $('#chart1, #chart2, #chart3').hide();
      $('#chartTab1, #chartTab2, #chartTab3').removeClass('active');

      $('#chart3').show();
      $('#chartTab3').addClass('active');
    });
  };

  var setupTableHandlers = function() {
    PumprUI.editCallback((fillup) => {
      displayEditForm(fillup);
    });

    PumprUI.deleteCallback((fillup) => {
      displayDestroyConfirm(fillup);
    });
  };

  var init = function() {
    setupHandlers();
    setupTableHandlers();
    setupChartHandlers();

    table = TableWidget('fills');
    form = FormWidget();

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

        $('td[name=mpg],td[name=miles],td[name=costPerMile]')
          .addClass('success')
          //.css('color','rgb(119, 6, 208)')
          .css('font-weight','bold');

        //$('tbody tr:nth-child(odd)').css('background', 'Azure');

        $('.navbar p').addClass('text-right');
      });
    };

    return {
      refresh : refresh,
    };
  };

  return {
    init : init,
  };

})();


/*






*/
