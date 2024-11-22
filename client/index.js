// initialize websocket connection

const socket = new io('http://localhost:5000')

socket.on('connect', ()=> {
    console.log("connected to the server");

    socket.emit('send-notification', { message: "This is a notification from the client "});
    socket.on("receive-notification", (data)=> {
        console.log(data);
    });
})

socket.on('task-created', (data)=> {
    console.log(`new notification: ${JSON.stringify(data)}`)
});

socket.on("retrieve-tasks", (data)=> {
    console.log(`new notification: ${JSON.stringify(data)}`);
});

socket.on("update-task-status", (data) => {
    console.log(`new notification: ${JSON.stringify(data)}`);
});

socket.on("task-deleted", (data)=> {
    console.log(`new notification: ${JSON.stringify(data)}`);
})