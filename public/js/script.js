const socket = io();
 
if (navigator.geolocation) {
	navigator.geolocation.watchPosition(
		(position) => {
			const { latitude, longitude } = position.coords;
			socket.emit("sendLocation", { latitude, longitude });
			console.log("Location sent:", latitude, longitude);
		},
		(error) => {
			console.log("Geolocation error:", error);
		},
		{
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0,
		}
	);
}


const map = L.map("map").setView([0, 0], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 19,
	attribution: "© OpenStreetMap",
}).addTo(map);

const markers = {};
socket.on("receiveLocation", (data) => {
	const { id, latitude, longitude } = data;

	
	if (!markers[id]) {
		map.setView([latitude, longitude]);
	}

	if (markers[id]) {
		markers[id].setLatLng([latitude, longitude]);
	} else {
		markers[id] = L.marker([latitude, longitude]).addTo(map)
			.bindPopup(`User: ${id}`)
			.openPopup();
	}
});


socket.on("userDisconnected", (id) => {
	if (markers[id]) {
		map.removeLayer(markers[id]);
		delete markers[id];
	}
});
