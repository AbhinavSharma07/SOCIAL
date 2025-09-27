const knex = require("../Models/friend");
const {getUid} = require('./users.controllers');

const sendReq = (req, res, next) => {
    console.log(req,'req');
    var fId = req.params.fId;
    knex.isExistsFid(fId)
    .then((isexistsfid) =>{
        console.log(isexistsfid);
        if(isexistsfid.length)
        {
            var activeUser = getUid(req)
            knex.sendfriendReq(activeUser.userId , fId)
            .then(() =>{
                res.status(200).json({
                    message: "sent friend Request"  + fId
                });
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json({
                message: err.toString()
                })
            });
        }
        else {
            res.status(404).json({
                message: 'invaild fId ' + `${fId}`
            });
        }
    })
    .catch((err) => {
        res.status(500).json({
            error: err,
        });
    });
}


const Frirequest =async (req, res, next) => {
    var Action = req.params.Action 
    var fId = req.params.fId;
    knex.isExistsFid(fId)
    .then((isexistsfid) =>{ 
        console.log(isexistsfid);
        if(isexistsfid.length)
        {
            var activeUser = getUid(req)
            knex.friendReq(activeUser.userId , fId, Action)
            .then(() =>{
                res.status(200).json({
                    message: "Successful Request :)" 
                });
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json({
                message: err.toString()
                })
            });
        }
        else {
            res.status(404).json({
                message: 'invaild fId ' + `${fId}`
            });
        }
    })
    .catch(() => {
        res.status(500).json({
            error: 'Something Went Wrong ',
        });
    });
}

const friendlist = (req, res, next) => { 
    var activeUser = getUid(req)
    knex.friendList(activeUser.userId)
    .then((friendlist) =>{ 
        if(friendlist.length){
            res.status(200).json(friendlist);
        }
        else {
            res.send('friend not found')
        }
    })
    .catch((err) => {
        res.status(500).json({
        message: err
        })
    });

}
module.exports = {
    sendReq,
    Frirequest,
    friendlist
  };