import mongoose from 'mongoose';
import Message from '../database/models/message.model.js';
import User from '../database/models/user.model.js';
import cloudinary from '../utils/cloudinary.js';
import { getRecievedSocketId, io } from '../utils/socket.js';
export const getUsers = async (req, res, next) => {
    try {
        const myId = req.user._id;

        const others = await User.find({ _id: { $ne: myId } }).select('-password');

        res.success({ users: others }, 'Users fetched successfully');

        return;
    } catch (error) {
        console.log('Error in get users controller: ', error);
        next(error);
    }
};
export const getMessages = async (req, res, next) => {
    try {
        const { userId: userIChat } = req.params;

        //  check if id is valid mongoose id
        if (!mongoose.isValidObjectId(userIChat)) {
            return next(new Error('Invalid user id', { cause: 400 }));
        }

        if (!userIChat) {
            return next(new Error('User id is required', { cause: 400 }));
        }

        const mySelf = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: userIChat, receiver: mySelf },
                { sender: mySelf, receiver: userIChat },
            ],
        });

        res.success({ messages: !messages.length ? [] : messages });

        return;
    } catch (error) {
        console.log('Error in get messages controller: ', error);
        next(error);
    }
};

export const sendMessage = async (req, res, next) => {
    try {
        const { text: message } = req.body;
        const { userId: userIChat } = req.params;
        const mySelf = req.user._id;

        const chat = new Message({ message, sender: mySelf, receiver: userIChat });

        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
                folder: `${process.env.CLOUDINARY_FOLDER}/messages/${req.user._id}`,
                public_id: Math.round(Math.random() * 1e9) + '_' + req.user._id,
            });

            chat.attachment = { secure_url, public_id };
        }

        const newMessage = await chat.save();

        // Get receiver's socket ID
        const receiverSocketId = getRecievedSocketId(userIChat);
        const senderSocketId = getRecievedSocketId(mySelf); // Add this line

        // Emit to receiver
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        // Emit to sender (so their UI updates)
        if (senderSocketId) {
            io.to(senderSocketId).emit('newMessage', newMessage);
        }

        res.success({ newMessage }, 'Message sent successfully');
    } catch (error) {
        console.log('Error in send message controller: ', error);
        next(error);
    }
};
