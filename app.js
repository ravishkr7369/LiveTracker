const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const socketio = require("socket.io");
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const port=process.env.PORT || 3000;
const io = socketio(server);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
	console.log("User Connected:", socket.id);

	socket.on("sendLocation", (data) => {
		console.log("Location received from:", socket.id);
		io.emit("receiveLocation", { id: socket.id, ...data });
	});

	socket.on("disconnect", () => {
		console.log("User Disconnected:", socket.id);
		io.emit("userDisconnected", socket.id);
	});
});

app.get("/", (req, res) => {
	res.render("index.ejs");
});

server.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
