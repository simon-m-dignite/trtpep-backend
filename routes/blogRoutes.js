const express = require("express");
const {
  AddNewBlog,
  FetchBlogs,
  FetchBlogById,
  UpdateBlog,
  DeleteBlog,
} = require("../controllers/blogsController");
const router = express.Router();

router.post("/blogs/add-new-blog", AddNewBlog);
router.get("/blogs/fetch-blogs", FetchBlogs);
router.get("/blogs/blog/:_id", FetchBlogById);
router.put("/blogs/update-blog/:_id", UpdateBlog);
router.delete("/blogs/delete-blog/:_id", DeleteBlog);

module.exports = router;
