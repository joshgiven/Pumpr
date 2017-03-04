
var RestService = function(baseURL) {

  var index = function(callback) {
    $.ajax({ type: 'GET',
             url: baseURL,
             dataType: 'json' })
     .fail(function(jqXHR, textStatus, errorThrown) {
       console.log('bad stuff in GET:', textStatus);
       callback(null);
     })
     .done(function(data, status) {
       callback(data);
     });
  };

  var show = function(id, callback) {
    $.ajax({ type: 'GET',
             url: baseURL + '/' + id,
             dataType: 'json' })
     .fail(function(jqXHR, textStatus, errorThrown) {
       console.log('bad stuff in GET:', textStatus);
       callback(null);
     })
     .done(function(data, status) {
       callback(data);
     });
  };

  var create = function(quiz, callback) {
    $.ajax({ type: 'POST',
             url: baseURL,
             dataType: 'json',
             contentType: 'application/json',
             data: JSON.stringify(quiz)
     })
     .fail(function(jqXHR, textStatus, errorThrown) {
       console.log('bad stuff in POST:', errorThrown);
       callback(false);
     })
     .done(function(data, status) {
       callback(true);
     });
  };

  var update = function(id, quiz, callback) {
    delete quiz.id;

    $.ajax({ type: 'PUT',
             url: baseURL + '/' + id,
             dataType: 'json',
             contentType: 'application/json',
             data: JSON.stringify(quiz)
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.log('bad stuff in PUT:', errorThrown);
      callback(null);
    })
    .done(function(data, status) {
      callback(data);
    });

  };

  var destroy = function(id, callback) {
    $.ajax({ type: 'DELETE',
             url: baseURL + '/' + id})
     .fail(function() {
        console.log('bad stuff in DELETE');
        callback(false);
     })
     .done(function(data, status) {
        callback(true);
     });
  };

  return {
    //validate : validate,
    index    : index,
    show     : show,
    create   : create,
    update   : update,
    destroy  : destroy,
  };

};



var PumprREST = RestService('rest/fillups');

PumprREST.validate = function(fillup) {

  fields = {
    id:       { reqd: false, method: (id)   => Number.isInteger(id) },
    date:     { reqd: true,  method: (date) => date.match(/^\d{4}-\d{2}-\d{2}$/) },
    gallons:  { reqd: true,  method: (gal)  => !Number.isNan(gal) },
    odometer: { reqd: true,  method: (odom) => !Number.isNan(odom) },
    comments: { reqd: true,  method: (comments) => true },
    dollarsPerGallon: { reqd: true, method: (dpg) => !Number.isNan(dpg) },
  };

  var objKeys = Object.keys(fillup);
  var validKeys = Object.keys(fields);
  var reqdKeys = validKeys.filter((k) => fields[k].reqd);

  // fillup has all reqd keys
  if(!reqdKeys.every((k) => k in objKeys)) {
    return false;
  }

  // validate each key
  for(var i=0; i < objKeys.length; i++) {
    var key = objKeys[i];
    var value = fillup[key];
    var validator = fields[key];

    if(!validKeys.includes(key)) {
      return false;
    }

    if(!validator.method(value)) {
      return false;
    }
  }

  return true;
};
