// agregar el src de este script.js tanto en el origen index.html como en el destino index2.html

//Access the HTML elements via the Document Object Model provided by JavaScript.
// origen
//const message = document.querySelector('#message');  // id del textarea del mensaje 
//const button = document.querySelector('button');
// destino
const notify = document.querySelector('#notification'); // id de donde llega el mensaje
const messageBar = document.querySelector('#message-bar');

//Create an event listener that logs the message provided by the user to the console whenever the form is submitted.
//The code snippet below sends messages to the server when a user clicks the submit button.
/*function printMessage(e) {
  e.preventDefault();
  //console.log(message.value);
  //socket.emit('message', message.value);
  console.log('available');
  socket.emit('message', 'available');
}
button.addEventListener('click', printMessage);*/

//The code snippet below listens for messages labeled response from the server. If there is a message, it displays the message on the webpage.
const socket = io();
socket.on('response', (data) => {
  console.log(data); // data corresponde al referencePoint que se libera en el click de free parking
  console.log(markers);  // markers corresponde a ese marcador en particular
  notify.textContent = "Free Parking Spot #" + data + " Available";
  messageBar.style.backgroundColor = 'green';
  messageBar.style.color = 'white';
  messageBar.style.height = '15px';
  messageBar.style.fontWeight = 'bold';
  localStorage.setItem('pointReference_change', data);
  //markerLocation = new L.LatLng(6.1522974, -75.5782741);
  //markers = new L.Marker(markerLocation, {icon: greenIcon});
  //markers.bindPopup('asdasdad').openPopup();
  //map.addLayer(markers);
  markers.bindPopup(data + '-' + 'Available', {autoClose: false, autoPan: false,closeOnClick: false}).openPopup();
  markers.setIcon(greenIcon)
});

// para recibir el nuevo marcador creado
socket.on('load_init_on', (data) => {
  console.log(data); // data corresponde a mensaje broadcasted via index.js y desde index2
});
