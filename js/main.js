

(function() {



    // load remote json data
    //
    function loadExternalJson( url ) {
      $.getJSON( url, {
      })
      .done(function( data ) {
          console.log("got data", data);

          var latLon = data.features[0].geometry.coordinates[0][0] ? data.features[0].geometry.coordinates[0][0] : data.features[0].geometry.coordinates;
          console.log(latLon);
          map.setView([latLon[1], latLon[0]], 13)

          var myStyle = {
              "color": "#ff7800",
              "weight": 5,
              "opacity": 0.65
          };
          var myLayer = L.geoJson(data, {
              style: myStyle
          });
          map.addLayer(myLayer);
          GeoList.addFile(url, url, myLayer);
        });

      }

      $('#goButton').click(function() {
        var file =  $('#fileUrl').val();
          if ( file.toLowerCase().substr(0,4) == "http") {
            loadExternalJson( file );
          } else {
            var myLayer = L.featureGroup([L.marker([50.5, 30.5])]);;
            map.addLayer(myLayer);
            GeoList.addFile("", file, myLayer);
          }
      })


      var filesOnServer = [];

      // show existing files list from serer
      //
      JsonServer.getList(function(data) {
        $.each(data, function(key, value) {
          var filename = value.name;
          console.log("got", filename, value.id);
          if (filename) {
            filesOnServer[value.id] = value;
            $('#filesOnServer').append('<div class="existingFile" data-serverid="'+value.id+'">' + filename + '</div>')
          }
        });

        $(".existingFile").click(function() {
          JsonServer.getDetails( $(this).data('serverid'), function(data) {
            console.log("got this", data );
            console.log("got this data.data", data.data );
            var myLayer = L.geoJson(data.data);
            map.addLayer(myLayer);
            GeoList.addFile(data.url, data.name, data.layer, data.id);
          });
        })

      });

  })();
