import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Task } from "../models/task.model.js"; // Double-check this file exists!
import { ApiResponse } from "../utils/ApiResponse.js";

const createTask = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    if (!title) throw new ApiError(400, "Title is required");

    const task = await Task.create({
        title,
        description,
        owner: req.user._id 
    });

    return res.status(201).json(
        new ApiResponse(201, task, "Task created successfully")
    );
});

const getUserTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ owner: req.user._id });

    return res.status(200).json(
        new ApiResponse(200, tasks, "Tasks fetched successfully")
    );
});

const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findOneAndUpdate(
        { _id: taskId, owner: req.user._id },
        { $set: { title, description, status } },
        { new: true }
    );

    if (!task) throw new ApiError(404, "Task not found or unauthorized");

    return res.status(200).json(
        new ApiResponse(200, task, "Task updated successfully")
    );
});

const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.findOneAndDelete({ _id: taskId, owner: req.user._id });

    if (!task) throw new ApiError(404, "Task not found or unauthorized");

    return res.status(200).json(
        new ApiResponse(200, {}, "Task deleted successfully")
    );
});

const adminGetAllTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({}).populate("owner", "username email");

    return res.status(200).json(
        new ApiResponse(200, tasks, "All tasks fetched successfully for Admin")
    );
});

export { createTask, getUserTasks, updateTask, deleteTask, adminGetAllTasks };