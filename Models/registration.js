const knex = require("./connection");

// Register a new user
const register = async (data) => {
  try {
    const [user_id] = await knex('users').insert(data).returning('user_id');
    return { user_id, message: "User registered successfully" };
  } catch (err) {
    throw new Error(err.message || "Error registering user");
  }
};

// Check if a user exists by email
const IsUser = async (email) => {
  try {
    const user = await knex('users')
      .select('user_id', 'email', 'password')
      .where('email', email);
    return user;
  } catch (err) {
    throw new Error(err.message || "Error checking user");
  }
};

// Get user info by username
const me = async (username) => {
  try {
    const userData = await knex('users')
      .select('username', 'first_name', 'last_name', 'email', 'city', 'state', 'country', 'profile_picture_url', 'birth_date')
      .where('username', username);
    return userData;
  } catch (err) {
    throw new Error(err.message || "Error fetching user data");
  }
};

// Store reset token
const enter_token = async (token, email) => {
  try {
    await knex('users')
      .update({ reset_token: token })
      .where('email', email);
    return { message: "Token stored successfully" };
  } catch (err) {
    throw new Error(err.message || "Error storing token");
  }
};

// Verify reset token
const isToken = async (token) => {
  try {
    const user = await knex('users')
      .select('user_id', 'email')
      .where('reset_token', token);
    return user;
  } catch (err) {
    throw new Error(err.message || "Error verifying token");
  }
};

// Update user password
const updatePassword = async (password, user_id) => {
  try {
    await knex('users')
      .update('password', password)
      .where('user_id', user_id);
    return { message: "Password updated successfully" };
  } catch (err) {
    throw new Error(err.message || "Error updating password");
  }
};

// Clear reset token
const updateTokenNull = async (user_id) => {
  try {
    await knex('users')
      .update('reset_token', null)
      .where('user_id', user_id);
    return { message: "Reset token cleared" };
  } catch (err) {
    throw new Error(err.message || "Error clearing token");
  }
};

// Update user profile
const updateProfile = async (data, user_id) => {
  try {
    await knex('users')
      .update(data)
      .where('user_id', user_id);
    return { message: "Profile updated successfully" };
  } catch (err) {
    throw new Error(err.message || "Error updating profile");
  }
};

module.exports = {
  register,
  IsUser,
  me,
  enter_token,
  isToken,
  updatePassword,
  updateTokenNull,
  updateProfile
};
