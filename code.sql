CREATE TABLE IF NOT EXISTS `users`(
`user_id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT,
`email` VARCHAR(255) NOT NULL,
`username` VARCHAR(25) NOT NULL,
`password` VARCHAR(255) NOT NULL,
`first_name` VARCHAR(255) NOT NULL,
`last_name` VARCHAR(255) NOT NULL,
`gender` ENUM('M', 'F'),
`city` VARCHAR(255),
`state` VARCHAR(255),
`country` VARCHAR(255),
`profile_picture_url` VARCHAR(255),
`birth_date` VARCHAR(255),
`date_created` DATE NOT NULL,
`date_updated` DATE,
`reset_token` TEXT,
`active` ENUM('yes','no') NOT NULL DEFAULT 'no',
PRIMARY KEY (`user_id`),
UNIQUE KEY `email` (`email`)
);

CREATE TABLE IF NOT EXISTS `relationship` (
  `user_one_id` INT(10) UNSIGNED NOT NULL,
  `user_two_id` INT(10) UNSIGNED NOT NULL,
  `status` TINYINT(3) UNSIGNED NOT NULL DEFAULT '0',
  `action_user_id` INT(10) UNSIGNED NOT NULL,
  FOREIGN KEY (`user_one_id`) REFERENCES users(`user_id`),
  FOREIGN KEY (`user_two_id`) REFERENCES users(`user_id`),
  FOREIGN KEY (`action_user_id`) REFERENCES users(`user_id`)
);

ALTER TABLE `relationship`
ADD UNIQUE KEY `unique_users_id` (`user_one_id`,`user_two_id`);

INSERT INTO `users` (`user_id`, `username`, `email`, `password`) VALUES
(1, 'user1', 'user1@gmail.com', sha2('password', 256)),
(2, 'user2', 'user2@gmail.com', sha2('password', 256)),
(3, 'user3', 'user3@gmail.com', sha2('password', 256)),
(4, 'user4', 'user4@gmail.com', sha2('password', 256)),
(5, 'user5', 'user5@gmail.com', sha2('password', 256)),
(6, 'user6', 'user6@gmail.com', sha2('password', 256));

INSERT INTO `relationship` (`user_one_id`, `user_two_id`, `status`, `action_user_id`) VALUES
(1, 2, 1, 1),
(1, 3, 1, 3),
(1, 4, 1, 4),
(1, 5, 0, 5),
(1, 6, 3, 1),
(2, 3, 1, 2),
(2, 4, 1, 4),
(3, 5, 1, 3),
(1, 7, 0, 1);


CREATE  TABLE IF NOT EXISTS `mypost` (
  `post_id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT,
 `user_id` INT(10) UNSIGNED NOT NULL,
  `caption` VARCHAR(255) ,
  `img_url` VARCHAR(255) ,
  FOREIGN KEY (`user_id`) REFERENCES users(`user_id`),
  PRIMARY KEY (`post_id`)
);