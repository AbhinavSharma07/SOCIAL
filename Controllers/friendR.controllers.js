const knex = require("../Models/friend");
const { getUid } = require("./users.controllers");

/**
 * Send a friend request
 */
const sendReq = async (req, res) => {
  try {
    const { fId } = req.params;
    const activeUser = getUid(req);

    if (!fId || isNaN(fId)) {
      return res.status(400).json({ message: "Invalid friend ID" });
    }

    const userExists = await knex.isExistsFid(fId);
    if (!userExists.length) {
      return res.status(404).json({ message: `User with id ${fId} not found` });
    }

    await knex.sendfriendReq(activeUser.userId, fId);
    res.status(200).json({ message: `Friend request sent to user ${fId}` });
  } catch (err) {
    console.error("Error in sendReq:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Accept / Reject / Cancel a friend request
 */
const Frirequest = async (req, res) => {
  try {
    const { Action, fId } = req.params;
    const activeUser = getUid(req);

    if (!["accept", "reject", "cancel"].includes(Action.toLowerCase())) {
      return res.status(400).json({ message: "Invalid action type" });
    }

    const userExists = await knex.isExistsFid(fId);
    if (!userExists.length) {
      return res.status(404).json({ message: `User with id ${fId} not found` });
    }

    await knex.friendReq(activeUser.userId, fId, Action.toLowerCase());
    res.status(200).json({ message: `Request ${Action}ed successfully` });
  } catch (err) {
    console.error("Error in Frirequest:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get logged-in user's friend list
 */
const friendlist = async (req, res) => {
  try {
    const activeUser = getUid(req);
    const friends = await knex.friendList(activeUser.userId);

    if (!friends.length) {
      return res.status(404).json({ message: "No friends found" });
    }

    res.status(200).json(friends);
  } catch (err) {
    console.error("Error in friendlist:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  sendReq,
  Frirequest,
  friendlist,
};
