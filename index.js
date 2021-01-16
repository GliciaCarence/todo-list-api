// imports
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
// 'cors' allows a server to indicate any other origins (domain, scheme, or port) --> it checks that the server will permit the actual request
const cors = require("cors");

// access to environment variables
require("dotenv").config();

// start the server with 'express'
const app = express();
app.use(formidable());
// enable all 'cors' requests
app.use(cors());

// connect the database
mongoose.connect(process.env.MONGOBD_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// models
const Task = mongoose.model("Task", {
    title: String,
    isDone: {
        type: Boolean,
        default: false,
    },
});

// routes
// 1. create :
app.post("/create", async (req, res) => {
    try {
        // create a new task
        const title = req.fields.title;
        const newTask = new Task({
            title: title,
        });

        // save the new task in the database
        await newTask.save();

        res.status(200).json({
            message: "New task created!",
            _id: newTask._id,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 2. read
app.get("/getTasks", async (req, res) => {
    try {
        const allTasks = await Task.find();

        res.status(200).json(allTasks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 3. update :
app.put("/update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const isDone = req.fields.isDone;

        // search task to update by its id
        const taskToUpdate = await Task.findById(id);
        taskToUpdate.isDone = isDone;

        // save update
        await taskToUpdate.save();

        res.status(200).json({ message: "Task successfully updated." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 4. delete
app.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // search task to delete by its id
        const taskToDelete = await Task.findById(id);

        // delete task
        await taskToDelete.deleteOne();

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.all("*", (req, res) => {
    res.status(404).json({ message: "Page  not found" });
});

// server listening...
app.listen(process.env.PORT, () => {
    console.log(`Server started on port : ${process.env.PORT}`);
});
