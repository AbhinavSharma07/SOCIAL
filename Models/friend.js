const knex = require("./connection");

// Check if a user exists by their ID
const isExistsFid = async (fId) => {
  try {
    const user = await knex("users").select("user_id").where("user_id", fId);
    return user;
  } catch (err) {
    throw new Error(err.message || "Error checking friend ID");
  }
};

// Send a friend request
const sendfriendReq = async (activeUser, friendId) => {
  try {
    await knex("relationship").insert({
      user_one_id: activeUser,
      user_two_id: friendId,
      action_user_id: activeUser,
      status: 0, // 0 = pending
    });
    return { message: "Friend request sent successfully" };
  } catch (err) {
    throw new Error(err.message || "Error sending friend request");
  }
};

// Convert action string to status code
const activeStatus = (Action) => {
  switch (Action) {
    case "reject":
      return 2;
    case "addfriend":
      return 1;
    case "block":
      return 3;
    default:
      return 0;
  }
};

// Respond to a friend request
const friendReq = async (activeUser, friendId, Action) => {
  try {
    const status = activeStatus(Action);
    await knex("relationship")
      .update({ action_user_id: activeUser, status: status })
      .where({ user_one_id: activeUser, user_two_id: friendId })
      .orWhere({ user_one_id: friendId, user_two_id: activeUser });
    return { message: "Friend request action completed" };
  } catch (err) {
    throw new Error(err.message || "Error updating friend request");
  }
};

// Get friend list for a user
const friendList = async (activeUser) => {
  try {
    const friends = await knex("relationship")
      .join("users", function () {
        this.on("users.user_id", "=", "relationship.user_one_id")
          .orOn("users.user_id", "=", "relationship.user_two_id");
      })
      .where(function () {
        this.where("relationship.user_one_id", activeUser)
          .orWhere("relationship.user_two_id", activeUser);
      })
      .andWhere("relationship.status", 1)
      .andWhereNot("users.user_id", activeUser)
      .select("users.user_id", "users.username");

    return friends;
  } catch (err) {
    throw new Error(err.message || "Error fetching friend list");
  }
};

module.exports = {
  isExistsFid,
  sendfriendReq,
  friendReq,
  friendList,
};
