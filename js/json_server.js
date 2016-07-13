

var JsonServer = function()
{
  var url = 'https://json-server.codeformuenster.org/posts/';

  var highestId = 0;

  return {

    /**
     * @param id: if it's there, then update entry with $id, otherwise create new one.
     */
    saveJson: function (fileData, id) {

      var d = new Date()
      fileData.saveDate = d.toISOString();

      if (!id) { id = ""; }
      var request = $.ajax({
        url: url + id,
        type: id ? "PUT" : "POST",
        data: JSON.stringify(fileData),
        contentType:"application/json; charset=utf-8",
        dataType: "json"
      });

      request.done(function( msg ) {
        //console.log(msg);
        alert( msg );
      });

      request.fail(function( jqXHR, textStatus ) {
        //console.log(jqXHR);
        alert( "Request failed: " + textStatus );
      });

    },

    getList: function(callback) {
      var request = $.ajax({
        url: url,
        method: "GET",
        dataType: "json"
      });

      request.done(function(filelist ) {
        //console.log(filelist);
        callback(filelist);
      });
    },

    getDetails: function(serverId, callback) {
      var request = $.ajax({
        url: url + serverId,
        method: "GET",
        dataType: "json"
      });

      request.done(function(filelist ) {
        console.log("got details of file", filelist);
        callback(filelist);
      });
    }
  }
}();
