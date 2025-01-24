import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { connect } from './config.js';
import { chatModel } from './Schemas/chat.schema.js'
import activeUserModel from './Schemas/activeusers.Schema.js';



const app = express();
let server = http.createServer(app);



const io = new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
});

io.on('connection',(socket)=>{
    console.log('Connection is Established');


    socket.on('join',async(userName)=>{

        socket.userName = userName;
        let newUser = new activeUserModel({user:userName});
        await newUser.save();
        socket.broadcast.emit('newUser',userName);



        //Sending previous messages to client
        let prevMsg = await chatModel.find().sort({timeStamp:1}).limit(50);
        socket.emit('load-msg',prevMsg);

        // sending active users to client
        let userList = await activeUserModel.find();
        socket.emit('get-active-user',userList);
        socket.broadcast.emit('get-active-user',userList);
    });

    socket.on('send-message',(content)=>{
        let newMessage = new chatModel({
            user:socket.userName,
            message:content,
            timeStamp:Date.now()
        })
        newMessage.save();
        socket.broadcast.emit('rcv-message',newMessage);
    })




    socket.on('disconnect',async()=>{
        let user = socket.userName;
        console.log(socket.userName);
        let deleted = await activeUserModel.deleteOne({user:user});
        console.log(deleted);
        socket.broadcast.emit('user-left',user)
        // sending active users to client
        let userList = await activeUserModel.find();
        socket.broadcast.emit('get-active-user',userList);

        console.log('Connection is disconnected');
    })
})


server.listen(3000,()=>{
    console.log('App is listening at 3000');
    connect();
})