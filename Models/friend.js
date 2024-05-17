const knex=require("./connection")

let isExistsFid = (fId)=>{
    return knex.select('user_id').from('users').where('user_id',fId)
}

let sendfriendReq = (activeUser, friendId) =>{
    return knex('relationship').insert({"user_one_id":activeUser,'user_two_id':friendId,'action_user_id':activeUser,"status":0})
}

let activeStatus = (Action) => {
    var status = 0;
    switch (Action) {
        case 'reject':
            status = 2;
            break;
        case 'addfriend':
            status =1;
            break;
        case 'block':
            status =3;
            break;
      }
    return status;
}

let friendReq = (activeUser, friendId, Action) =>{
    var status = activeStatus(Action)
    return knex('relationship').update({'action_user_id':activeUser,"status": status}).where({"user_one_id":activeUser,'user_two_id':friendId})
}

let friendList = (activeUser) =>{
    return knex('relationship').join('users', 'relationship.user_two_id', '=', 'users.user_id')
    .select('users.username')
        .where({'user_one_id': activeUser ,'status': 1}).orWhere("user_two_id",activeUser)
}

module.exports = {
    isExistsFid,
    sendfriendReq,
    friendReq,
    friendList
};