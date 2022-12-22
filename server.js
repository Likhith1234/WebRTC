const express = require("express");

const app = express();
const server = require("http").Server(app);
const soc = require("socket.io");
const io = soc(server);
const uuid = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    // console.log(uuid.v4());
    res.redirect(`${uuid.v4()}`);
});

app.get("/:roomid", (req, res) => {
    res.render("room", {roomId: req.params.roomid})
});


io.on("connection", socket => {
    // console.log(typeof(socket));
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.on("ready", () => {
            socket.broadcast.to(roomId).emit("user-connected", userId);
        });

        socket.on('disconnect', (roomId, userId) => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        });
    });
});

server.listen(3000);