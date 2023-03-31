
// agregar el src de este script.js tanto en el origen index.html como en el destino index2.html

//Access the HTML elements via the Document Object Model provided by JavaScript.
// origen
//const message = document.querySelector('#message');  // id del textarea del mensaje 
const button = document.querySelector('button');
// destino
//const notify = document.querySelector('#notification'); // id de donde llega el mensaje
//const messageBar = document.querySelector('#message-bar');

//Create an event listener that logs the message provided by the user to the console whenever the form is submitted.
//The code snippet below sends messages to the server when a user clicks the submit button.
function printMessage(e) {
  e.preventDefault();
  //console.log(message.value);
  //socket.emit('message', message.value);
  pointReference = localStorage.getItem('pointReference');
  console.log('available');
  socket.emit('message', pointReference); // emite al message de index.js que le hace on
  //socket.emit('add user', username);
}
button.addEventListener('click', printMessage);

//The code snippet below listens for messages labeled response from the server. If there is a message, it displays the message on the webpage.
/*const socket = io();
socket.on('response', (data) => {
  notify.textContent = data;
  messageBar.style.backgroundColor = '#3F4E4F';
  messageBar.style.height = '20vh';
});*/
