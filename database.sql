-- Adminer 4.8.1 MySQL 10.6.7-MariaDB-log dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `news_id` int(11) DEFAULT NULL,
  `author` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment_text` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `news_id` (`news_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `comments` (`id`, `news_id`, `author`, `comment_text`, `created_at`) VALUES
(1, 1, 'John', 'This is a great news post!', '2025-05-05 10:00:00'),
(2, 1, 'Sara', 'Looking forward to it!', '2025-05-05 10:15:00'),
(3, 2, 'Alex', 'I am excited to join this event!', '2025-05-05 11:00:00'),
(4, 3, 'Lily', 'Definitely attending this!', '2025-05-05 11:30:00'),
(5, 4, 'Tom', 'Can’t wait to join the club!', '2025-05-05 12:00:00'),
(6, 5, 'Maya', 'Great initiative!', '2025-05-05 12:30:00');

DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `news` (`id`, `title`, `content`, `category`, `author`, `image`, `published_at`) VALUES
  (1, 'Library Opening Hours Extended', 'The library will be open late this weekend for students to study for exams.', 'announcements', 'University Admin', 'library_extended.jpg', '2025-05-05 09:00:00'),
  (2, 'Tech Conference on Artificial Intelligence', 'Join the tech conference this weekend to learn about the latest in AI.', 'events', 'Tech Team', 'ai_conference.jpg', '2025-05-05 09:15:00'),
  (3, 'Cybersecurity Club Meeting', 'If you’re interested in cybersecurity, attend our next club meeting!', 'announcements', 'Cyber Club', 'cyber_meeting.jpg', '2025-05-05 09:30:00'),
  (4, 'Spring Club Registration Open', 'The Spring Club registration is now open! Join to explore various activities.', 'announcements', 'Spring Club', 'spring_club.jpg', '2025-05-05 09:45:00'),
  (5, 'No Classes Due to Weather Conditions', 'Classes are canceled due to heavy rain and traffic conditions.', 'alerts', 'University Admin', 'no_classes.jpg', '2025-05-05 10:00:00'),
  (6, 'Exam Schedule Released', 'The official exam schedule is now available. Please check the notice board.', 'alerts', 'Examination Office', 'exam_schedule.jpg', '2025-05-05 10:15:00');

-- 2025-05-03 09:48:18