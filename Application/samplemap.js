var pgCounty = [38.837847,-76.848410];
//var map = L.map('map').setView(pgCounty, 11);

// The URL for the map which includes our CloudMade API key.
      var cmAttr = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
          myMapURL = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';


      var minimal = L.tileLayer(myMapURL, {
          styleId: 22677,
          attribution: cmAttr
      }),
          midnight = L.tileLayer(myMapURL, {
              styleId: 999,
              attribution: cmAttr
          });

      // This is a mapnik basemap
      var anne = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png');

      // Styles our county layer
      // var countyStyle = {
      //     "color": "#ff7c00",
      //     "weight": 3,
      //     "opacity": 0.25
      // };

       // Create our County layer
      // var county = new L.geoJson(baltimoreCounty, {
      //     //some options
      //     style: countyStyle
      // });

      // Style our Maryland layer
      // var mdStyle = {
      //   "weight": 3,
      //   "opacity": 0.25,
      //   "color": "#ff7c00",
      //   "dashArray": 4
      // };

      // Create the Maryland layer
      var maryland = new L.geoJson(maryland, {
          style: style,
          onEachFeature: onEachFeature
      });

       // Create our POI layer and add popups
      var poi = new L.geoJson(annesPOI, {
          // add options...eventually
          onEachFeature: function (feature, layer) {
              layer.bindPopup('<b>' + feature.properties.Name + ": " + '</b>' + feature.properties.Comments);
          }
      });

       // Create our map object, center it, set initial zoom level, and list all of the layers
      var map = L.map('map', {
          center: pgCounty,
          zoom: 11,
          layers: [minimal, maryland]
      });

       // Adding our basemaps to baseLayers
      var baseLayers = {
          "Minimal": minimal,
          //"Night View": midnight,
          //"Anne": anne
      };

       // Adding our vectors
      var overlays = {
          //"County": county,
          "Maryland": maryland,
          "POI": poi
      };

    function highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
          weight: 5,
          color: '#D40808',
          dashArray: '',
          fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
      }

      info.update(layer.feature.properties);
    }

    function style(feature) {
      return {
          "weight": 3,
          "opacity": 0.25,
          "color": "#ff7c00",
          "dashArray": 4
          //fillColor: getColor(feature)
      };
    }

    function resetHighlight(e) {
      maryland.resetStyle(e.target);
      info.update();
    }

    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
        
      });
    }
      // Simple working popup example
      //poi.bindPopup("I am a marker!");

      // Add our baselayers and overlays to the map
      L.control.layers(baseLayers, overlays).addTo(map);

      // Add the control that shows county info on hover
      var info = L.control();

      info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
      };

      info.update = function (props) {
        this._div.innerHTML = '<h4>Visitors by County</h4>' + (props ? '<b>' + props.COUNTYNAME + ':</b> ' + props.NUMVIS + '<br />' : 'Hover over a county');
      };

      info.addTo(map);