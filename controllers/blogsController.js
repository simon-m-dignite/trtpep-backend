const mongoose = require("mongoose");
const BlogModel = mongoose.model("Blogs");

module.exports.AddNewBlog = async (req, res) => {
  const newBlog = new BlogModel(req.body);
  try {
    const savedBlog = await newBlog.save();
    res
      .status(201)
      .json({ message: "Blog added successfully", data: savedBlog });
  } catch (error) {
    console.error("Error adding blog:", error);
    res.status(500).json({
      message: "An error occurred while adding the blog",
      error: error.message,
    });
  }
};

module.exports.FetchBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.find();
    if (blogs.length > 0) {
      return res.status(200).json({ data: blogs });
    }
    res.status(200).json({ message: "No Blogs Found" });
  } catch (error) {
    console.log("Error fetching blogs", error);
    res.status(500).json({
      message: "An error occurred while fetching blogs",
      error: error.message,
    });
  }
};

module.exports.FetchBlogById = async (req, res) => {
  const { _id } = req.params;
  try {
    const blog = await BlogModel.findById({ _id });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "success", data: blog });
  } catch (error) {
    console.log("FetchBlogById error > ", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching blog details." });
  }
};

module.exports.UpdateBlog = async (req, res) => {
  try {
    const { _id } = req.params;
    const blog = await BlogModel.findById({ _id });

    if (!blog) {
      return res.status(404).json({ message: "Blog Not Found" });
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(
      { _id },
      { content: req.body.content },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Blog updated successfully!", data: updatedBlog });
  } catch (error) {
    console.log("UpdateBlog error >> ", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.DeleteBlog = async (req, res) => {
  try {
    const { _id } = req.params;
    const blog = await BlogModel.findById({ _id });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await BlogModel.findByIdAndDelete({ _id });
    res.status(200).json({ message: "Blog dleeted successfully" });
  } catch (error) {
    console.log("deleteBlog error >> ", error);
    res.status(500).json({ message: "An error occurred while deletin blog!" });
  }
};
