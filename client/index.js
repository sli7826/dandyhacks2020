var geodata = data[0];
var covid = coviddata[0];
var scores=scoresdata;

    /*var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000"; 
    ctx.fillRect(0, 0, 150, 75); */

    
function project (longitude, latitude) {
    return {
          x: longitude, // Transform “longitude” in some way
          y: latitude // Transform “latitude” in some way
      }
  }

function getBoundingBox (data) {
    var bounds = {}, coords, point, latitude, longitude;
  
    // We want to use the “features” key of the FeatureCollection (see above)
    data = data.features;
  
    // Loop through each “feature”
    for (var i = 0; i < data.length; i++) {
  
      // Pull out the coordinates of this feature
      coords = data[i].geometry.coordinates[0];
  
      // For each individual coordinate in this feature's coordinates…
      for (var j = 0; j < coords.length; j++) {
  
        longitude = coords[j][0];
        latitude = coords[j][1];
  
        // Update the bounds recursively by comparing the current
        // xMin/xMax and yMin/yMax with the coordinate
        // we're currently checking
        bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
        bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
        bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
        bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
      }
  
    }
  
    // Returns an object that contains the bounds of this GeoJSON
    // data. The keys of this object describe a box formed by the
    // northwest (xMin, yMin) and southeast (xMax, yMax) coordinates.
    return bounds;
}
  
var canvas = document.getElementById("myCanvas");

function draw (width, height, bounds, data) {
    var context, coords, point, latitude, longitude, xScale, yScale, scale;
  
    // Get the drawing context from our <canvas> and
    // set the fill to determine what color our map will be.
    context = canvas.getContext('2d');
    context.fillStyle = '#333';
  
    // Determine how much to scale our coordinates by
    xScale = width / Math.abs(bounds.xMax - bounds.xMin);
    yScale = height / Math.abs(bounds.yMax - bounds.yMin);
    scale = xScale < yScale ? xScale : yScale;
  
    // Again, we want to use the “features” key of
    // the FeatureCollection
    data = data.features;
  
    // Loop over the features…
    for (var i = 0; i < data.length; i++) {
		console.log(data[i].properties.name);
		console.log(findscore(data[i].properties.name));
      if (findscore(data[i].properties.name) < 26.0){
        context.fillStyle = '#F00';
      }else {
        if (findscore(data[i].properties.name) < 29.0){
			context.fillStyle = '#D00';
		  }else {
			if (findscore(data[i].properties.name) < 32.0){
				context.fillStyle = '#A00';
			  }else {
				if (findscore(data[i].properties.name) < 35.0){
					context.fillStyle = '#800';
				  }else {
					if (findscore(data[i].properties.name) < 38.0){
						context.fillStyle = '#600';
					  }else {
						if (findscore(data[i].properties.name) < 41.0){
							context.fillStyle = '#400';
						  }else {
							context.fillStyle = '#200';
						  }
					  }
				  }
			  }
		  }
      }
      // …pulling out the coordinates…
      if (data[i].geometry.type == data[20].geometry.type){
        data[i].geometry.coordinates.forEach(function(coords1){
          var feat={'type':'Polygon','coordinates':coords1};
          coords = feat.coordinates[0];
      // …and for each coordinate…
      for (var j = 0; j < coords.length; j++) {
  
        longitude = coords[j][0];
        latitude = coords[j][1];
        // Scale the points of the coordinate
        // to fit inside our bounding box
        point = {
            x: (longitude - bounds.xMin) * scale + 700,
            y: (bounds.yMax - latitude) * scale + 700
        };
        // If this is the first coordinate in a shape, start a new path
        if (j === 0) {
          context.beginPath();
          context.moveTo(point.x, point.y);
  
        // Otherwise just keep drawing
        } else {
          context.lineTo(point.x, point.y);
        }
      }
  
      // Fill the path we just finished drawing with color
      context.fill();
          }
       );
       continue;
      }



      coords = data[i].geometry.coordinates[0];
      // …and for each coordinate…
      for (var j = 0; j < coords.length; j++) {
  
        longitude = coords[j][0];
        latitude = coords[j][1];
        // Scale the points of the coordinate
        // to fit inside our bounding box
        point = {
            x: (longitude - bounds.xMin) * scale + 700,
            y: (bounds.yMax - latitude) * scale + 700
        };
        // If this is the first coordinate in a shape, start a new path
        if (j === 0) {
          context.beginPath();
          context.moveTo(point.x, point.y);
  
        // Otherwise just keep drawing
        } else {
          context.lineTo(point.x, point.y);
        }
      }
  
      // Fill the path we just finished drawing with color
      context.fill();
    }
}

function search(zipcode){
  for (var i = 0; i < covid.length; i++){
    if (zipcode == covid[i].MODIFIED_ZCTA){
      return parseInt(covid[i].COVID_DEATH_COUNT);
    }
  }
}

function findscore(state){
  for (var i = 0; i < scores.length; i++){
    if (state == scores[i].Location){
      return scores[i].score;
    }
  }
}

draw(400, 500, getBoundingBox(geodata), geodata);
console.log(findscore("Alabama"));