const knex = require("./connection");

// Create a new post
const newpost = async (user_id, caption, post_url) => {
  try {
    const [post_id] = await knex('mypost').insert({
      user_id,
      caption,
      img_url: post_url
    }).returning('post_id'); 
    return { post_id, message: "Post created successfully" };
  } catch (err) {
    throw new Error(err.message || "Error creating new post");
  }
};

// Get all posts with user info
const get_post = async () => {
  try {
    const posts = await knex('mypost')
      .select('users.user_id', 'users.username', 'mypost.caption', 'mypost.img_url')
      .join('users', 'mypost.user_id', '=', 'users.user_id')
      .orderBy('mypost.post_id', 'desc'); 
    return posts;
  } catch (err) {
    throw new Error(err.message || "Error fetching posts");
  }
};

// Get user ID of a post
const getPostUid = async (post_id) => {
  try {
    const result = await knex('mypost')
      .select('user_id')
      .where('post_id', post_id);
    return result;
  } catch (err) {
    throw new Error(err.message || "Error fetching post user");
  }
};

// Delete a post
const deletePost = async (post_id) => {
  try {
    await knex('mypost')
      .where('post_id', post_id)
      .del();
    return { message: "Post deleted successfully" };
  } catch (err) {
    throw new Error(err.message || "Error deleting post");
  }
};

module.exports = {
  newpost,
  get_post,
  getPostUid,
  deletePost
};
