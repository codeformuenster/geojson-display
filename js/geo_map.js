
        // generate map
        var map = L.map('map').setView([51.505, -0.09], 13);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([51.5, -0.09]).addTo(map)
            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            .openPopup();

// https://raw.githubusercontent.com/codeformuenster/open-data/master/stimmbezirke.geojson
// https://raw.githubusercontent.com/codeformuenster/open-data/master/spielplaetze.geojson
// https://crossorigin.me/http://www.metropia.com/cities.geojson

        var GeoList = function() {

          var files = [];
          var filecounter = 0;
          var noMoreEdit = 0;

          $( "#fileList" ).click(function( event ) {
              console.log( "clicked: ", event.target );
              var ele = $(event.target);
              var layerId = ele.data('id');
              if (ele.hasClass('layerClick')) {
                files[layerId].show = 1 - files[layerId].show ;
                var myLayer = files[layerId].layer;
                if ( files[layerId].show) {
                  ele.css('opacity','');
                  map.addLayer(myLayer);
                } else {
                  map.removeLayer(myLayer);
                  ele.css('opacity','0.5');
                }
              }
              else if (ele.hasClass('layerEdit')) {
                var myFileData = files[layerId];
                map.addLayer(myFileData.layer);
                noMoreEdit = 1;
                $('.layerEdit').hide();
                showDrawControls(myFileData);
              }
          });

          return {
            addFile: function(url, name, layer, serverId) {
              var fileId = filecounter++;
              files[fileId] =
                { id: fileId,
                  serverId: serverId,
                  url: url,
                  name: name || url,
                  show: 1,
                  layer:layer
                };
              $('#fileList').append('<div class="layerClick" data-id="' + fileId + '">'
                +'<input data-id="' + fileId + '" type="button" class="layerEdit uk-button uk-button-condensed" value="edit" /> ' + (name || url) + '</div>');
              if (noMoreEdit) {
                $('.layerEdit').hide();
              }
            }
          }
    }();


      function showDrawControls(fileData) {
            var drawnItems = fileData.layer;

        		var drawControl = new L.Control.Draw({
        			draw: {
        				position: 'topleft',
        				polygon: {
        					title: 'Draw a sexy polygon!',
        					allowIntersection: false,
        					drawError: {
        						color: '#b00b00',
        						timeout: 1000
        					},
        					shapeOptions: {
        						color: '#bada55'
        					},
        					showArea: true
        				},
        				polyline: {
        					metric: false
        				},
        				circle: {
        					shapeOptions: {
        						color: '#662d91'
        					}
        				}
        			},
        			edit: {
        				featureGroup: drawnItems
        			}
        		});
        		map.addControl(drawControl);

            map.on('draw:created', function (e) {
              var type = e.layerType,
                layer = e.layer;

              if (type === 'marker') {
                layer.bindPopup('A popup!');
              }

              drawnItems.addLayer(layer);

            });

            map.on('draw:edited', function (e) {
              var geoj = drawnItems.toGeoJSON();
              var saveData = fileData;
              saveData.layer = '';
              saveData.data = geoj;
                console.log("saving", saveData);
                JsonServer.saveJson(saveData);
            });


      }
