const knex=require("./connection")

let newpost = (user_id,caption,post_url) => {    
  return knex('mypost').insert({"user_id":user_id,"caption":caption,"img_url":post_url})
}

let get_post = () => {
  return knex ('mypost').select("users.user_id", "users.username","mypost.caption","mypost.img_url").join('users',"mypost.user_id",'=','users.user_id')
}
let getPostUid = (post_id) => {
  return knex('mypost').select('user_id').where('post_id',post_id)
}
let deletePost = (post_id) => {
  return knex('mypost').where('post_id',post_id).del()
}
module.exports={
  newpost,
  get_post,
  getPostUid,
  deletePost
};