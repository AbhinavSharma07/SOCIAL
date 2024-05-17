const knex=require("./connection")

let register = (data)=>{
    return knex('users').insert(data)
}

let IsUser = (email)=>{
    return knex.select('user_id','email','password').from('users').where('email',email)
}

let me = (username)=>{
    return knex.select('username','first_name','last_name', 'email', 'city','state','country', 'profile_picture_url', 'birth_date').from('users').where('username',username)
}
 
let enter_token = (token, email) => {
    return knex('users').update({"reset_token":token}).where('email',email)
}

let isToken = (token) => {
    return knex('users').select('user_id','email').where("reset_token",token)
}

let updatePassword = (password,user_id) => {
    return knex('users').update('password',password).where('user_id',user_id)
}

let updateTokenNull = (user_id) => {
    return knex('users').update('reset_token',null).where('user_id',user_id)
}

let updateProfile = (data, user_id) => {
    return knex('users').update(data).where('user_id',user_id)
}
module.exports = {
    updateTokenNull,
    updatePassword,
    updateProfile,
    enter_token,
    register, 
    isToken,
    IsUser, 
    me
};