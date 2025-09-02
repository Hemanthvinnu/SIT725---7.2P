function changeText() {
  var textsArray = ["Text 1","Text 2","Text 3","Text 4","Text 5"];
  var number = Math.floor(Math.random() * textsArray.length);
  document.getElementById("heading").innerHTML = textsArray[number];
}

// --- Socket.IO integration ---
const socket = io(); // connects to same origin (http://localhost:3001)

socket.on('number', (msg) => {
  console.log('Random number from server:', msg);
  const el = document.getElementById('number');
  if (el) el.textContent = String(msg);
});
