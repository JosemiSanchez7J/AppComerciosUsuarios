define(['dojo/_base/declare', "esri/layers/FeatureLayer",
"esri/tasks/query", "esri/geometry/Circle", "esri/symbols/PictureMarkerSymbol",
"esri/graphic", "esri/symbols/SimpleMarkerSymbol",
"esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer",
"esri/config", "esri/Color", "dojo/dom", 'jimu/BaseWidget'],
  function(declare,FeatureLayer,
    Query, Circle, PictureMarkerSymbol,
    Graphic, SimpleMarkerSymbol,
    SimpleLineSymbol, SimpleFillSymbol, SimpleRenderer,
    esriConfig, Color, dom, BaseWidget) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-customwidget',

      //this property is set by the framework when widget is loaded.
      //name: 'CustomWidget',


      //methods to communication with app container:

      postCreate: function() {
        console.log('postCreate');
      },

      startup: function() {
       console.log('startup', this.map);
      },

      onOpen: function(){
        console.log('onOpen');
        
      },

      funcionUsuario: function(){
        console.log('funcionUsuario');
        var usuariosApp = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/arcgis/rest/services/Usuarios_Demanda/FeatureServer/0", {
          outFields: ["*"]
      });
  
      // Simbología marcado
      var marker = new PictureMarkerSymbol();
      marker.setHeight(15);
      marker.setWidth(20);
      marker.setUrl("https://cdn-icons-png.flaticon.com/512/10/10624.png");
      usuariosApp.setSelectionSymbol(marker);
      
  
      // Make unselected features invisible
      var nullSymbol = new SimpleMarkerSymbol().setSize(0);
      usuariosApp.setRenderer(new SimpleRenderer(nullSymbol));
  
      this.map.addLayer(usuariosApp);
  
      var circulo = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_NULL,
          new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
              new Color([255, 255, 0]),
              2
          ), new Color([255, 255, 0, 0.25])
      );
      var circle;
  
      // When the map is clicked create a buffer around the click point of the specified distance
      this.map.on("click", function (evt) {
          circle = new Circle({
              center: evt.mapPoint,
              geodesic: true,
              radius: radio = document.getElementById("prod").value,
              radiusUnit: "esriMeters"
          });
          console.log("hola", this)
          this.graphics.clear();
          var añadirCirculo = new Graphic(circle, circulo);
          this.graphics.add(añadirCirculo);
  
          var query = new Query();
          query.geometry = circle.getExtent();
          // Use a fast bounding box query. It will only go to the server if bounding box is outside of the visible map.
          usuariosApp.queryFeatures(query, selectInBuffer);
      });
  
      function selectInBuffer(response) {
          var feature;
          var features = response.features;
          var inBuffer = [];
          // Filter out features that are not actually in buffer, since we got all points in the buffer's bounding box
          for (var i = 0; i < features.length; i++) {
              feature = features[i];
              if (circle.contains(feature.geometry)) {
                  inBuffer.push(feature.attributes[usuariosApp.objectIdField]);
              }
          }
          var query2 = new Query();
          query2.objectIds = inBuffer;
          // Use an objectIds selection query (should not need to go to the server)
           usuariosApp.selectFeatures(query2, FeatureLayer.SELECTION_NEW);
      }

      var circulo2 = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_NULL,
        new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_NULL,
            new Color([255, 255, 0]),
            2
        ), new Color([255, 255, 0, 0.25])
    );
    var circle2;

      this.map.on("dbl-click", function (evt) {
        circle2 = new Circle({
            center: evt.mapPoint,
            geodesic: true,
            radius: radio = document.getElementById("prod").value,
            radiusUnit: "esriMeters"
        });

      
        console.log("hola", this)
        this.graphics.clear();
        var añadirCirculo2 = new Graphic(circle2, circulo2);
        this.graphics.add(añadirCirculo2);

        var marker2 = new PictureMarkerSymbol();
        marker2.setHeight(0);
        marker2.setWidth(0);
        marker2.setUrl("https://cdn-icons-png.flaticon.com/512/10/10624.png");
        usuariosApp.setSelectionSymbol(marker2);

        var query = new Query();
        query.geometry = circle.getExtent();
        // Use a fast bounding box query. It will only go to the server if bounding box is outside of the visible map.
        usuariosApp.queryFeatures(query, selectInBuffer);
    });

    function selectInBuffer(response) {
        var feature;
        var features = response.features;
        var inBuffer = [];
        // Filter out features that are not actually in buffer, since we got all points in the buffer's bounding box
        for (var i = 0; i < features.length; i++) {
            feature = features[i];
            if (circle.contains(feature.geometry)) {
                inBuffer.push(feature.attributes[usuariosApp.objectIdField]);
            }
        }
        var query2 = new Query();
        query2.objectIds = inBuffer;
        // Use an objectIds selection query (should not need to go to the server)
         usuariosApp.selectFeatures(query2, FeatureLayer.SELECTION_NEW);
    }
      
      },

      onClose: function(){
        console.log('onClose');
      },

      // onMinimize: function(){
      //   console.log('onMinimize');
      // },

      // onMaximize: function(){
      //   console.log('onMaximize');
      // },

      // onSignIn: function(credential){
      //   /* jshint unused:false*/
      //   console.log('onSignIn');
      // },

      // onSignOut: function(){
      //   console.log('onSignOut');
      // }

      // onPositionChange: function(){
      //   console.log('onPositionChange');
      // },

      // resize: function(){
      //   console.log('resize');
      // }

      //methods to communication between widgets:

    });
  });