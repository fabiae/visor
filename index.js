

//Configuracion Inicial

var map = L.map('map').setView([1.063744, -75.262871], 15);


//Mapas bases
var Base1 = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
     maxZoom: 22
}).addTo(map);

var mapasBase = {
     OppenStreetMap: Base1,

};

var capasGenerales = {

}

const layerGenerales = async (nombre, style, popup) => {
     return await fetch(`http://localhost:8080/geoserver/visor/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=visor%3A${nombre}&outputFormat=application%2Fjson`).then(function (res) {
          return res.json();
     }).then(function (res) {
          capasGenerales[nombre] = L.geoJson(res, { style, onEachFeature: popup }).addTo(map);
     });
}

const layerEspecifica = async (nombre, style, popup) => {
     return await fetch(`http://localhost:8080/geoserver/visor/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=visor%3A${nombre}&outputFormat=application%2Fjson`).then(function (res) {
          return res.json();
     }).then(function (res) {
          capasGenerales[nombre] = L.geoJson(res, { style, onEachFeature: popup });
     });
}

async function general() {

     /*CAPAS GENERALES*/

     //Casa
     function styleCasa() {
          return {
               weight: 2,
               opacity: 1,
               color: 'yellow',
               fillOpacity: 0.8
          };
     }
     function popupCasa(feature, layer) {
          layer.bindPopup(feature.properties.nombre);
     }
     await layerGenerales("Casa", styleCasa, popupCasa);

     //Quebradas
     function styleQuebradas() {
          return {
               weight: 2,
               opacity: 1,
               color: 'blue',
               fillOpacity: 0.9
          };
     }
     await layerGenerales("quebradas", styleQuebradas);

     //Colindantes
     function styleColindantes(feature) {
          return {
               weight: 2,
               opacity: 1,
               color: 'olive',
               fillOpacity: 0.3
          };
     }
     function popupColindantes(feature, layer) {
          layer.bindPopup("Predio de " + feature.properties.nombre);
     }
     await layerGenerales("colindantes", styleColindantes, popupColindantes);

     //Limites
     function styleLimites() {
          return {
               weight: 1,
               opacity: 1,
               color: 'red',
               fillOpacity: 0.1
          };
     }
     function popupLimites(feature, layer) {
          layer.bindPopup("Perimetro de la Finca El Vergel " + feature.properties.perimetro + " m2");
     }
     await layerGenerales("limites", styleLimites, popupLimites);

     //Potreros
     function stylePotreros() {
          return {
               weight: 2,
               opacity: 1,
               color: 'gray',
               fillOpacity: 0.4
          };
     }
     function popupPotreros(feature, layer) {
          layer.bindPopup("Potrero N° " + feature.id + "<br/> Area: " + feature.properties.area + " m2");
     }
     await layerGenerales("potreros", stylePotreros, popupPotreros);
     //Potreros futuros
     await layerEspecifica("potreros_futuros", stylePotreros, popupPotreros);

     //Establo
     function styleEstablo() {
          return {
               weight: 2,
               opacity: 1,
               color: 'black',
               fillOpacity: 0.9
          };
     }
     function popupEstablo(feature, layer) {
          layer.bindPopup(feature.properties.nombre);
     }
     await layerGenerales("Establo", styleEstablo, popupEstablo);


     /*CAPAS ESPECIFICAS*/

     //Reservas Actual
     function styleReservas() {
          return {
               weight: 2,
               opacity: 1,
               color: 'green',
               fillOpacity: 0.7
          };
     }
     function popupReservas(feature, layer) {
          layer.bindPopup(feature.id + "<br/> Area: " + feature.properties.area + " m2");
     }
     await layerEspecifica("reservas_actual", styleReservas, popupReservas);
     //Reservas futuras
     await layerEspecifica("reservas_futuras", styleReservas, popupReservas);

     //Cultivos actual
     function styleCultivos() {
          return {
               weight: 2,
               opacity: 1,
               color: 'orange',
               fillOpacity: 0.5
          };
     }
     function popupCultivos(feature, layer) {
          layer.bindPopup("Cultivos de " + feature.properties.nombre + "<br/> Area: " + feature.properties.area + " m2");
     }
     await layerEspecifica("cultivos_actual", styleCultivos, popupCultivos);
     //Cultivos futuros
     await layerEspecifica("cultivos_futuros", styleCultivos, popupCultivos);

     //Arboles actual
     await layerEspecifica("arboles_actual");
     //Arboles futuros
     await layerEspecifica("arboles_futuros");

     //Tanques
     await layerEspecifica("tanques");

     //Senderos
     function styleSenderos() {
          return {
               weight: 2,
               opacity: 1,
               color: 'maroon',
               fillOpacity: 0.8
          };
     }
     await layerEspecifica("senderos", styleSenderos);

     L.control.layers(mapasBase, capasGenerales, {
          position: 'topright', // 'topleft', 'bottomleft', 'bottomright'
          collapsed: false, // true

     }).addTo(map);
     L.control.attribution({
          prefix: "Visor de La Planificacion Predial de la Finca el Vergel<br/> Yeison Fabian Claros Gonzalez<br/>Yulder Adrian Canamejoy Portilla<br/>Linea de Profundizacion B",
          position: 'topleft'
     }).addTo(map);
     L.control.scale().addTo(map);
};

general();





