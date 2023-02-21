mapboxgl.accessToken = "pk.eyJ1Ijoic29oaW5pLTgwNCIsImEiOiJjbGNwYXB4cW8wMmJyM29vajRxYjZsZWhwIn0.zwbkRfV-Y5Mq3YwIH0p93g";

const map = new mapboxgl.Map({
  container: 'map', // container element id
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-4.262852, 55.862211],
  zoom: 12
});

map.on('load', () => {
  map.addLayer({
    id: 'Accidents',
    type: 'circle',
    source: {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/sohini804/SIMD/main/Road_Safety_Accidents.geojson' 
    },
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['number', ['get', 'NUMBER_OF_CASUALTIES']],
        0,
        4,
        8,
        21,
      ],
      'circle-color': [
        'interpolate',
        ['linear'],
        ['number', ['get', 'NUMBER_OF_CASUALTIES']],
        0,
        '#2dc4b2',
        1,
        '#0091AD',
        2,
        '#5C4D7D',
        3,
        '#723C70',
        4,
        '#892B64',
        5,
        '#B7094C'
      ],
      'circle-opacity': 0.6
    }
  });
});
 
const popup = new mapboxgl.Popup({
  offset: [0, -15],
      className: "my-popup",
closeButton: false,
closeOnClick: false
});

map.on('mouseenter', 'Accidents', (e) => {
  const features = map.queryRenderedFeatures(e.point, {
      layers: ["Accidents"] 
    });
  const feature = features[0];
  map.getCanvas().style.cursor = 'pointer';
  
  
const coordinates = e.features[0].geometry.coordinates.slice();
const description = e.features[0].properties.description;
  
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
  
  
popup.setLngLat(coordinates)
  .setHTML(
  `<h3>No. of Vehicles: ${feature.properties.NUMBER_OF_VEHICLES}</h3>
    <h3>Speed Limit: ${feature.properties.SPEED_LIMIT}</h3>
    <h3>Weather: ${feature.properties.WEATHER_CONDITIONS}</h3>
    <h3>Road Conditions: ${feature.properties.ROAD_SURFACE_CONDITIONS}</h3>
    <h3>Light Conditions: ${feature.properties.LIGHT_CONDITIONS}</h3>`)
  .addTo(map);
});

map.on('mouseleave', 'Accidents', () => {
map.getCanvas().style.cursor = '';
popup.remove();
});

  document.getElementById("filters").addEventListener("change", (event) => {
    
    const accident = event.target.value;
    
    console.log(accident);
    
    if (accident == "all") {
      filterAccident = ["!=", ["get", "ACCIDENT_SEVERITY"], "placeholder"];
    } else if (accident == "Fatal") {
      filterAccident = ["==", ["get", "ACCIDENT_SEVERITY"], "Fatal"];
    } else if (accident == "Serious") {
      filterAccident = ["==", ["get", "ACCIDENT_SEVERITY"], "Serious"];
    } else if (accident == "Slight") {
      filterAccident = ["==", ["get", "ACCIDENT_SEVERITY"], "Slight"];  
    } else {
      console.log("error");
    }

    map.setFilter("Accidents", ["all", filterAccident]);
  });

document.getElementById('filters2').addEventListener('change', (event) => {
  const day = event.target.value;
  // update the map filter
  if (day === 'all') {
    filterDay = ['!=', ['string', ['get', 'DAY_OF_WEEK']], 'placeholder'];
  } else if (day === 'weekday') {
    filterDay = ['match', ['get', 'DAY_OF_WEEK'], ['Saturday', 'Sunday'], false, true];
  } else if (day === 'weekend') {
    filterDay = ['match', ['get', 'DAY_OF_WEEK'], ['Saturday', 'Sunday'], true, false];
  } else {
    console.log('error');
  }
  map.setFilter('Accidents', ['all', filterDay]);
});