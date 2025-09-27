const bcrypt = require("bcrypt");
require('dotenv').config()
const knex = require("../Models/registration");
const jwt = require("jsonwebtoken");
const post_knex = require("../Models/post")
const nodemailer = require("nodemailer");
const redis = require("redis");
const redisPort = 6379
const client = redis.createClient(redisPort);

client.on("error", (err) => {
    console.log(err);
})
const userRegister = (req, res, next) => {
	knex.IsUser(req.body.email)
		.then((user) => {
			if (user.length) {
				res.status(409).json({
				message:"Email Exists"
			})
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({
							error: err,
						});
					} else {
						req.body['password'] = hash
						knex.register(req.body)
						.then(() => {
							res.status(201).json({
							"Your Account is Created": req.body.email
							})		
						})
						.catch((err) => {
							console.log(err)
							res.status(500).json({
							message: err.toString()
							})
						});
					}
				});
			}
		})
		.catch((err) => {
			console.log(err)
			res.status(500).json({
			message: err.toString()
      		})
    	});
}


const userLogin = (req, res, next) => {
	knex.IsUser(req.body.email)
		.then((user) => {
			if (user.length < 1) {
				return res.status(401).json({
					message: "Auth failed: Email not found probably",
				});
			}
			bcrypt.compare(req.body.password, user[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({
					message: "Auth failed",
					});
				}
				if (result) {
					const token = jwt.sign(
						{
              				userId: user[0].user_id,
							email: user[0].email,					
						},
						process.env.jwtSecret,
						{
							expiresIn: "1d",
						}
					  );
					
					res.clearCookie('token');
					res.cookie('token',token);
					res.status(200).json({
						message: "Auth successful",
						userDetails: {
							userId: user[0].user_id,
							email: user[0].email,
						}
					});
				}
				else {
					res.status(401).json({
						message: "Auth failed1",
					});
				}
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
}

const getMe = async (req, res) => {
	knex.me(req.params.username)
	.then((data)=>{
		res.status(200).json(data)
	})
	.catch((err)=>{
		res.status(400).json(err)
	})
};


const forgotP =  (req, res, next) => {
			var user_email = req.body.email;
			knex.IsUser(user_email)
			.then(async(user) => {
				if (!user.length) {
					return res.status(401).send({errors: [{title: 'Invalid email!', detail: 'User does not exist'}]});
				}
				else{
					var token = jwt.sign({
						userId: user.id,
						username: user.username,
					  },
					  process.env.jwtSecret 
					  , { expiresIn: '1h' });
					    await knex.enter_token(token, user_email)
						const smtpTransport = nodemailer.createTransport({
							service: 'Gmail',
							auth: {
								user: process.env.MAILUSER,
								pass: process.env.MAILPASSWORD
							}
						});
						
						const mailOptions = {
							to: user_email,
							from: process.env.MAILUSER,
							subject: 'Nodejs password reset',
							text: 'You are receiving this email. Please click on the email for password reset ' +
								  'http://' + req.headers.host + '/fb/reset/' + token + '\n\n' + 
								  'If you did not request this, please ignore this email \n\n'
								  +"this is your token" + token

						};
						console.log(mailOptions);
						smtpTransport.sendMail(mailOptions, function(err){
							console.log('mail sent');
							res.send('please check out you inbox you will get mail :)')
						});
					

				}
			})
};

// // request to update the password in database if password and confirm password is matching. Also send email to user regarding successful password change
const resetP =  (req, res) =>{
		var token = req.body.token;
		knex.isToken(token)
		.then(async (isVerify) => {
			if(isVerify.length){
				if(req.body.password === req.body.confirm){
					await knex.updatePassword(req.body.password, isVerify[0].user_id)
					knex.updateTokenNull(isVerify[0].user_id)
					.then(()=>{
						var smtpTransport = nodemailer.createTransport({
							service: 'Gmail',
							auth: {
								user: process.env.MAILUSER,
								pass: process.env.MAILPASSWORD
							}
						});
						var mailOptions = {
							to: isVerify[0].email,
							from: process.env.MAILUSER,
							subject: 'Your password has been changed',
							text: 'Hello,\n\n' + 
								'This is a confirmation that the password for your account ' + isVerify[0].email + ' has just changed'
						};
						smtpTransport.sendMail(mailOptions, function(err){
							if(!err){
								res.status(200).json({
									message: 'Your password has been changed',
								});
							}
						});
					})
					.catch((err)=>{
						res.status(400).json(err)
					})
				} else {
					return res.status(422).send({errors: [{title: 'error', detail: 'Password do not match'}]});
				}
		}
		else {
			return res.status(401).send({errors: [{title: 'Invalid token!', detail: 'token is wrong'}]});
		}
					
		})
		.catch((err)=>{
			res.status(400).json(err)
		})  
};

const getUid = (req,res) => {
	var token = req.cookies.token
	if (!token) return res.status(400).send("Access Denied!, no token entered");

	try { 
	const verified = jwt.verify(token, process.env.jwtSecret);
	return(verified);
	} catch (err) {
	res.status(400).send({ error: "auth failed, check auth-token222" });
	}
}

const newpost = (req, res) => {
	var {userId} = getUid(req)
	var  imageUrl = req.body.imageUrl
	var caption = req.body.caption     
	post_knex.newpost(userId,caption,imageUrl)
	.then((data)=>{
		res.status(200).json(data)
	})
	.catch((err)=>{
		res.status(400).json(err)
	})
}

const deletePost = (req, res)  => {
	var post_id = req.params.post_id;
	var {userId} = getUid(req);
	post_knex.getPostUid(post_id)
	.then((data)=>{
		if(data[0].user_id === userId && data.length){
			post_knex.deletePost(post_id)
			.then(()=>{
				res.status(200).json("post has Deleted ")
			})
			.catch((err)=>{
				res.status(400).json(err)
			})
		}
		else {
			res.status(401).json(
			{
				"message":"wrong post_id"
			})
		}
	})
	.catch(()=>{
		res.status(400).json({"message":"something went wrong"})
	})

}

const get_post = (req, res) => {
	try {
		client.get("allpost", async (err, all_post) => {
			if (err) throw err;
    
            if (all_post) {
                res.status(200).send({
                    posts: JSON.parse(all_post),
                    message: "data retrieved from the cache"
                });
			}  
			else {
				post_knex.get_post()
				.then((allPost) => {
					client.setex("allpost", 600, JSON.stringify(allPost));
					res.status(200).send({
						posts: allPost,
						message: "cache miss"
					});
				})
				.catch((err)=>{
					res.status(400).json(err)
				})
			}
		})
			
	  }
	  catch (e) {
		
	  }	
}
let updateProfile = (req, res) => {
	var activeUser = getUid(req)
	knex.updateProfile(req.body,activeUser.userId)
	.then(() => {
		res.status(200).json(
			{
				message:"updated your Informations"
			})
	})
	.catch((err)=>{
		res.status(400).json(err)
	})
}

module.exports = {
  userLogin,
  updateProfile,
  userRegister,
	getMe,
	forgotP,
	getUid,
	newpost,
	deletePost,
	resetP,
	get_post
};
