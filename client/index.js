var geodata = data[0];
var covid = coviddata[0];

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
    context.fillStyle = '#AAA';
  
    // Determine how much to scale our coordinates by
    xScale = width / Math.abs(bounds.xMax - bounds.xMin);
    yScale = height / Math.abs(bounds.yMax - bounds.yMin);
    scale = xScale < yScale ? xScale : yScale;
  
    // Again, we want to use the “features” key of
    // the FeatureCollection
    data = data.features;
  
    // Loop over the features…
    for (var i = 0; i < data.length; i++) {
      if (search(data[i].properties.postalCode) < 60){
        context.fillStyle = '#100';
      }else {
         if (search(data[i].properties.postalCode) < 120){
			context.fillStyle = '#200';
		  }else {
			 if (search(data[i].properties.postalCode) < 180){
				context.fillStyle = '#300';
			  }else {
				 if (search(data[i].properties.postalCode) < 240){
					context.fillStyle = '#500';
				  }else {
					context.fillStyle = '#F00';
				  }
			  }
		  }
      }
      // …pulling out the coordinates…
      coords = data[i].geometry.coordinates[0];
  
      // …and for each coordinate…
      for (var j = 0; j < coords.length; j++) {
  
        longitude = coords[j][0];
        latitude = coords[j][1];
        // Scale the points of the coordinate
        // to fit inside our bounding box
        point = {
            x: (longitude - bounds.xMin) * scale + 300,
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

draw(500, 500, getBoundingBox(geodata), geodata)