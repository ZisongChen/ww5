import "./styles.css";
var data;
var j = 1;
var jj = 1;
var p;
var n;
var h;

const fetchData = async () => {
  const url =
    "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
  const url1 =
    "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f";
  const url2 =
    "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e";
  const city = await fetch(url);
  const pos = await fetch(url1);
  const nav = await fetch(url2);
  data = await city.json();
  p = await pos.json();
  n = await nav.json();
  console.log(data);
  initMap(data);
};
const initMap = (data) => {
  let map = L.map("map", {
    minZoom: -3,
    weight: 2
  });

  let geoJson = L.geoJSON(data, {
    onEachFeature: getFeature,
    style: getStyle,
    weight: 2
  }).addTo(map);

  let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  let baseMaps = {
    OpenStreetMap: osm
  };

  let overlayMaps = {
    Finland: geoJson
  };

  let layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

  map.fitBounds(geoJson.getBounds());
};

const getFeature = (feature, layer) => {
  layer.bindPopup(
    `<ul>

            <li>Name: ${feature.properties.name}</li>
            <li>positive migration: ${p.dataset.value[j]}</li>
            <li>negative migration: ${n.dataset.value[j]}</li>

        </ul>`
  );
  layer.bindTooltip(feature.properties.name);
  j++;
};
const getStyle = (feature) => {
  h =
    (p.dataset.value[jj] / n.dataset.value[jj]) *
    (p.dataset.value[jj] / n.dataset.value[jj]) *
    (p.dataset.value[jj] / n.dataset.value[jj]) *
    60;
  if (h >= 120) {
    h = 120;
  }
  jj++;

  return {
    color: "hsl(" + h + ",75%,50%)"
  };
};
fetchData();
