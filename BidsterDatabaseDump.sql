-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 28, 2024 at 11:18 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `BidmasterV1.1`
--

-- --------------------------------------------------------

--
-- Table structure for table `Auctions`
--

CREATE TABLE `Auctions` (
  `auction_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `min_price` decimal(10,2) NOT NULL,
  `Status` enum('pending','active','completed') NOT NULL,
  `ClearingPrice` decimal(10,0) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Auctions`
--

INSERT INTO `Auctions` (`auction_id`, `event_id`, `start_time`, `end_time`, `min_price`, `Status`, `ClearingPrice`) VALUES
(19, 36, '2024-03-05 20:15:00', '2024-03-27 22:51:00', 30.00, 'completed', 268),
(20, 37, '2024-02-26 18:46:00', '2024-03-09 15:38:00', 100.00, 'completed', 15),
(21, 38, '2024-02-26 18:48:00', '2024-03-09 15:42:00', 100.00, 'completed', 0),
(22, 39, '2024-02-20 18:50:00', '2024-03-30 18:50:00', 30.00, 'pending', 0),
(23, 40, '2024-02-27 18:55:00', '2024-03-07 20:13:00', 102.00, 'completed', 3000),
(26, 44, '2024-03-03 18:34:00', '2024-03-21 18:06:00', 123.00, 'completed', 32),
(30, 49, '2024-03-11 22:03:00', '2024-03-12 22:03:00', 1.00, 'completed', 0),
(31, 50, '2024-03-11 22:06:00', '2024-03-14 22:06:00', 22.00, 'completed', 0),
(39, 58, '2024-04-08 22:46:00', '2024-04-03 22:46:00', 35.00, 'pending', 0);

-- --------------------------------------------------------

--
-- Table structure for table `Bids`
--

CREATE TABLE `Bids` (
  `auction_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `bid_amount` decimal(10,2) DEFAULT NULL,
  `bid_quantity` int(11) NOT NULL,
  `bid_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `result` tinyint(1) DEFAULT NULL,
  `quantity_received` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Bids`
--

INSERT INTO `Bids` (`auction_id`, `user_id`, `event_id`, `bid_amount`, `bid_quantity`, `bid_time`, `result`, `quantity_received`) VALUES
(23, 11, 44, 300.00, 1, '2024-03-01 17:48:50', 1, 1),
(24, 5, 44, 45.00, 1, '2024-03-01 17:49:12', 1, 1),
(25, 12, 44, 87.00, 1, '2024-03-01 17:49:31', 1, 1),
(27, 13, 44, 32.00, 1, '2024-03-01 17:50:47', 1, 1),
(31, 12, 44, 20.00, 1, '2024-03-03 15:01:44', 0, NULL),
(83, 5, 40, 3000.00, 1, '2024-03-07 18:55:49', 1, 1),
(87, 10, 37, 15.00, 1, '2024-03-09 15:32:52', 1, 1),
(136, 1, 44, 40.00, 1, '2024-03-21 18:04:09', 1, 1),
(137, 1, 36, 422.00, 1, '2024-03-21 20:11:33', 1, 1),
(138, 5, 36, 364.00, 1, '2024-03-21 20:12:02', 1, 1),
(139, 10, 36, 183.00, 1, '2024-03-21 20:12:19', 0, NULL),
(140, 11, 36, 384.00, 1, '2024-03-21 20:12:38', 1, 1),
(141, 12, 36, 55.00, 1, '2024-03-21 20:12:52', 0, NULL),
(142, 13, 36, 268.00, 1, '2024-03-21 20:13:12', 1, 1),
(143, 14, 36, 464.00, 1, '2024-03-21 20:13:31', 1, 1),
(144, 24, 36, 157.00, 1, '2024-03-21 20:13:45', 0, NULL),
(145, 1, 39, 33.00, 1, '2024-03-22 00:57:01', NULL, 0),
(146, 1, 39, 55.00, 1, '2024-03-22 00:59:28', NULL, 0),
(147, 13, 39, 99.00, 1, '2024-03-22 01:04:49', NULL, 0),
(148, 13, 39, 33.00, 3, '2024-03-22 01:05:37', NULL, 0),
(149, 27, 39, 97.00, 1, '2024-03-22 01:22:14', NULL, 0),
(150, 29, 39, 50.00, 1, '2024-03-27 22:31:30', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `Events`
--

CREATE TABLE `Events` (
  `event_id` int(11) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `event_location` varchar(225) NOT NULL,
  `event_date` datetime NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `event_capacity` int(11) DEFAULT NULL,
  `event_type` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Events`
--

INSERT INTO `Events` (`event_id`, `event_name`, `description`, `event_location`, `event_date`, `image_url`, `event_capacity`, `event_type`) VALUES
(36, 'Coldplay : A Head Full of Dreams Tour', 'Coldplay in Concert', 'Madison Square Garden, New York', '2024-03-29 00:00:00', 'https://media.ticketmaster.co.uk/tm/en-gb/dam/a/c4e/ab17d60d-c675-4003-ba0b-759456390c4e_CUSTOM.jpg', 5, 'music'),
(37, 'Taylor Swift | The Eras Tour', 'Taylor Swift in Concert', 'Aviva Stadium, Dublin', '2024-04-25 00:00:00', 'https://media.ticketmaster.co.uk/tm/en-gb/dam/a/477/955a0c60-463c-442a-a3bb-d10aa68dc477_EVENT_DETAIL_PAGE_16_9.jpg', 10, 'music'),
(38, 'The Killers', 'The Killers in Concert', '3Arena, Dublin', '2024-08-02 00:00:00', 'https://media.ticketmaster.co.uk/tm/en-gb/dam/a/da6/b272c53e-c04d-4c1c-aa17-6bf0b618fda6_EVENT_DETAIL_PAGE_16_9.jpg', 10, 'music'),
(39, 'Hozier', 'Hozier in Concert', 'Limerick', '2024-08-01 00:00:00', 'https://i.scdn.co/image/ab6761610000e5ebad85a585103dfc2f3439119a', 10, 'music'),
(40, 'Noah Kahan', 'Noah Kahan in Concert', '3Arena, Dublin', '2024-04-25 00:00:00', 'https://media.ticketmaster.co.uk/tm/en-gb/dam/a/432/05ce67f8-3019-4906-bb90-cef427c87432_CUSTOM.jpg', 3, 'music'),
(44, 'Lewis Capaldi ', 'Lewis Capaldi Comeback Tour', 'Glasgow', '2024-03-16 00:00:00', 'https://i.ytimg.com/vi/qjjaWEhUP9Y/maxresdefault.jpg', 5, 'music'),
(49, 'Kung Fu Panda 4', 'Po must train a new warrior when he\'s chosen to become the spiritual leader of the Valley of Peace. However, when a powerful shape-shifting sorceress sets her eyes on his Staff of Wisdom, he suddenly realizes he\'s going to need some help. Teaming up with a quick-witted corsac fox, Po soon discovers that heroes can be found in the most unexpected places.\n', 'Savoy Cinema Dublin', '2024-03-21 00:00:00', 'https://dx35vtwkllhj9.cloudfront.net/universalstudios/kung-fu-panda-4/images/regions/us/onesheet.jpg', 100, 'cinema'),
(50, 'Spider Man Homecoming', 'Peter Parker tries to stop Adrian \'The Vulture\' Toomes from selling weapons made with advanced Chitauri technology while trying to balance his life as an ordinary high school student.', 'Sav]', '2024-03-26 00:00:00', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3qMMRn-cQjaV4yLdDu-8DwFjDPcslkpW442272zBQq70aORhc', 100, 'cinema'),
(58, 'The 1975', 'The 1975 are an English pop rock band formed in Wilmslow, Cheshire in 2002. The band consists of Matty Healy, Adam Hann, Ross MacDonald, and George Daniel. The name of the band was inspired by a page of scribblings found in Healy\'s copy of On the Road by Jack Kerouac that was dated \"1 June, The 1975\".', 'Madison Square Garden, New York', '2024-08-22 00:00:00', 'https://variety.com/wp-content/uploads/2022/06/ed690c6f-ebac-4c01-a43d-95df22958a01-1.jpg?w=1000', 10, 'music');

-- --------------------------------------------------------

--
-- Table structure for table `Notifications`
--

CREATE TABLE `Notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Notifications`
--

INSERT INTO `Notifications` (`notification_id`, `user_id`, `title`, `message`, `type`, `status`, `created_at`, `updated_at`) VALUES
(1901, 14, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'read', '2024-03-21 20:19:00', '2024-03-22 01:24:40'),
(1902, 1, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'read', '2024-03-21 20:19:00', '2024-03-21 20:19:58'),
(1903, 11, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'unread', '2024-03-21 20:19:00', '2024-03-21 20:19:00'),
(1904, 5, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'unread', '2024-03-21 20:19:00', '2024-03-21 20:19:00'),
(1905, 13, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'read', '2024-03-21 20:19:00', '2024-03-21 20:58:39'),
(1906, 10, 'Unfortunetly', 'Your Bid for event 36 was Lost ', 'bid_lost', 'unread', '2024-03-21 20:19:00', '2024-03-21 20:19:00'),
(1907, 24, 'Unfortunetly', 'Your Bid for event 36 was Lost ', 'bid_lost', 'read', '2024-03-21 20:19:00', '2024-03-21 20:20:22'),
(1908, 12, 'Unfortunetly', 'Your Bid for event 36 was Lost ', 'bid_lost', 'read', '2024-03-21 20:19:00', '2024-03-21 20:28:39'),
(1909, 14, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'read', '2024-03-22 01:16:00', '2024-03-22 01:24:40'),
(1910, 1, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'read', '2024-03-22 01:16:00', '2024-03-22 01:16:58'),
(1911, 11, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'unread', '2024-03-22 01:16:00', '2024-03-22 01:16:00'),
(1912, 5, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'unread', '2024-03-22 01:16:00', '2024-03-22 01:16:00'),
(1913, 13, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'read', '2024-03-22 01:16:00', '2024-03-27 22:52:50'),
(1914, 10, 'Unfortunetly', 'Your Bid for event 36 was Lost ', 'bid_lost', 'unread', '2024-03-22 01:16:00', '2024-03-22 01:16:00'),
(1915, 24, 'Unfortunetly', 'Your Bid for event 36 was Lost ', 'bid_lost', 'unread', '2024-03-22 01:16:00', '2024-03-22 01:16:00'),
(1916, 12, 'Unfortunetly', 'Your Bid for event 36 was Lost ', 'bid_lost', 'read', '2024-03-22 01:16:00', '2024-03-22 01:28:25'),
(1917, 14, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'read', '2024-03-22 01:20:00', '2024-03-22 01:24:40'),
(1918, 1, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'read', '2024-03-22 01:20:00', '2024-03-22 01:20:31'),
(1919, 11, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'unread', '2024-03-22 01:20:00', '2024-03-22 01:20:00'),
(1920, 5, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'unread', '2024-03-22 01:20:00', '2024-03-22 01:20:00'),
(1921, 13, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'read', '2024-03-22 01:20:00', '2024-03-27 22:52:50'),
(1922, 10, 'Unfortunetly', 'Your Bid for event 36 was Lost ', 'bid_lost', 'unread', '2024-03-22 01:20:00', '2024-03-22 01:20:00'),
(1923, 24, 'Unfortunetly', 'Your Bid for event 36 was Lost ', 'bid_lost', 'unread', '2024-03-22 01:20:00', '2024-03-22 01:20:00'),
(1924, 12, 'Unfortunetly', 'Your Bid for event 36 was Lost ', 'bid_lost', 'read', '2024-03-22 01:20:00', '2024-03-22 01:28:25'),
(1925, 14, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'unread', '2024-03-27 22:51:00', '2024-03-27 22:51:00'),
(1926, 1, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'unread', '2024-03-27 22:51:00', '2024-03-27 22:51:00'),
(1927, 11, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'unread', '2024-03-27 22:51:00', '2024-03-27 22:51:00'),
(1928, 5, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'unread', '2024-03-27 22:51:00', '2024-03-27 22:51:00'),
(1929, 13, 'Congratulations!', 'Your Bid for event 36 was Won! ', 'bid_won', 'read', '2024-03-27 22:51:00', '2024-03-27 22:52:50'),
(1930, 10, 'Unfortunetly', 'Your Bid for event 36 was Lost ', 'bid_lost', 'unread', '2024-03-27 22:51:00', '2024-03-27 22:51:00'),
(1931, 24, 'Unfortunetly', 'Your Bid for event 36 was Lost ', 'bid_lost', 'unread', '2024-03-27 22:51:00', '2024-03-27 22:51:00'),
(1932, 12, 'Unfortunetly', 'Your Bid for event 36 was Lost ', 'bid_lost', 'unread', '2024-03-27 22:51:00', '2024-03-27 22:51:00');

-- --------------------------------------------------------

--
-- Table structure for table `Tickets`
--

CREATE TABLE `Tickets` (
  `ticket_id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `price_paid` decimal(10,2) DEFAULT NULL,
  `seat_number` varchar(50) DEFAULT NULL,
  `status` enum('available','paid','reserved') DEFAULT NULL,
  `QRCODE` varchar(255) DEFAULT NULL,
  `event_name` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Tickets`
--

INSERT INTO `Tickets` (`ticket_id`, `event_id`, `user_id`, `price_paid`, `seat_number`, `status`, `QRCODE`, `event_name`, `first_name`, `last_name`) VALUES
(1163, 44, 11, 32.00, 'A59', 'paid', '/An-example-of-QR-code.png', 'Lewis Capaldi ', 'Jane', 'Doe'),
(1164, 44, 12, 32.00, 'A72', 'paid', '/An-example-of-QR-code.png', 'Lewis Capaldi ', 'Admin', 'Admin'),
(1165, 44, 5, 32.00, 'A70', 'paid', '/An-example-of-QR-code.png', 'Lewis Capaldi ', 'Cillian', 'Deegan'),
(1166, 44, 1, 32.00, 'A52', 'paid', '/An-example-of-QR-code.png', 'Lewis Capaldi ', 'Ciaran', 'Doherty'),
(1167, 44, 13, 32.00, 'A40', 'paid', '/An-example-of-QR-code.png', 'Lewis Capaldi ', 'Jack', 'Malone'),
(1183, 36, 14, 268.00, 'A32', 'paid', '/An-example-of-QR-code.png', 'Coldplay : A Head Full of Dreams Tour', 'Matthew', 'Kenny'),
(1184, 36, 1, 268.00, 'A57', 'paid', '/An-example-of-QR-code.png', 'Coldplay : A Head Full of Dreams Tour', 'Ciaran', 'Doherty'),
(1185, 36, 11, 268.00, 'A25', 'paid', '/An-example-of-QR-code.png', 'Coldplay : A Head Full of Dreams Tour', 'Jane', 'Doe'),
(1186, 36, 5, 268.00, 'A5', 'paid', '/An-example-of-QR-code.png', 'Coldplay : A Head Full of Dreams Tour', 'Cillian', 'Deegan'),
(1187, 36, 13, 268.00, 'A9', 'paid', '/An-example-of-QR-code.png', 'Coldplay : A Head Full of Dreams Tour', 'Jack', 'Malone');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `PasswordHash` varbinary(64) NOT NULL,
  `FirstName` varchar(100) DEFAULT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `Role` enum('user','admin') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`UserID`, `Username`, `Email`, `PasswordHash`, `FirstName`, `LastName`, `CreatedAt`, `UpdatedAt`, `IsActive`, `Role`) VALUES
(1, 'ciaran.doherty.2021@mumail.ie', 'ciaran.doherty.2021@mumail.ie', 0x243262243130247350422e45524d3643326770446f7772496d503331753078733047334d314e556b513976664864323865525265486b6b7555766271, 'Ciaran', 'Doherty', '2024-02-11 17:05:38', '2024-03-23 18:37:48', 1, 'admin'),
(5, 'Dego@gmail', 'Dego@gmail', 0x2432622431302452476969303139712f75786a783967436c6c506d6f4f306c5a396a58354445434476676f2f35353954376d6a314857574938523369, 'Cillian', 'Deegan', '2024-02-12 13:18:58', '2024-02-20 14:17:25', 1, 'user'),
(10, 'JohnDoe@gmail.com', 'JohnDoe@gmail.com', 0x243262243130246258396159794d5042643162484167593045717a354f7955354b2f6e664659764a6f646b64754a5a2e41674f4b4374665961636653, 'John', 'Doe', '2024-02-12 16:31:46', '2024-02-12 16:31:46', 1, 'user'),
(11, 'JaneDoe@gmail.com', 'JaneDoe@gmail.com', 0x243262243130244c53374147333055316a416839774c32364137374a2e586c43784c4f50576b4a6747466f58516e6977426339704b4e494b52496d61, 'Jane', 'Doe', '2024-02-12 18:48:29', '2024-02-12 18:48:29', 1, 'user'),
(12, 'admin@admin.com', 'admin@admin.com', 0x243262243130246e5152636b314b6872304a31412e2f69486e6243592e64616d577958764f72747431386a447878704544536f314a58433536624947, 'Admin', 'Admin', '2024-02-20 14:21:06', '2024-02-20 14:21:28', 1, 'admin'),
(13, 'Jack@gmail.com', 'Jack@gmail.com', 0x243262243130247a447772524f7563432e38782f4d6b4b5a3165512e2e634d4663422e474e686d426145454b713969754f626b5578706a6571364136, 'Jack', 'Malone', '2024-02-22 15:31:30', '2024-02-22 15:31:30', 1, 'user'),
(14, 'Matty@gmail.com', 'Matty@gmail.com', 0x2432622431302473703275456d38747338653441676f774535636e314f32636e6a4c3237682e5a37465964726e74487542443446694f446c734b344f, 'Matthew', 'Kenny', '2024-03-01 18:42:10', '2024-03-01 18:42:10', 1, 'user'),
(24, 'Aidan@gmail.com', 'Aidan@gmail.com', 0x24326224313024774748452f496c2f6f655a74673147793769314966655735484959394f3653343965664b6274656852743451692e4c584b6755786d, 'Aidan', 'Mcgee', '2024-03-21 19:15:59', '2024-03-21 19:15:59', 1, 'user'),
(26, 'Niall@eir.com', 'Niall@eir.com', 0x2432622431302442647144453069335530355667704f4331654436444f3347584d6e4b736444696a5872464c5237414a4130544e4156346d652e314f, 'Niall', 'James', '2024-03-21 22:32:33', '2024-03-21 22:32:33', 1, 'user'),
(27, 'Liam@gmail.com', 'Liam@gmail.com', 0x243262243130244767785977666152636d37555955553375477237312e685069724a727734624b673865374c56694f4d6d566165674b786958655561, 'Liam', 'Gallagher', '2024-03-22 01:21:44', '2024-03-22 01:21:44', 1, 'user'),
(28, 'Demo@demo', 'Demo@demo', 0x243262243130244569693153384337356b6d562e6c4b73416f462e416531304a6c384d4a42624e6d364a67546f4f666b6561425643667953364c726d, 'Demo', 'Demo', '2024-03-23 16:19:02', '2024-03-23 16:19:02', 1, 'user'),
(29, 'Barak@mu.ie', 'Barak@mu.ie', 0x24326224313024616653454d5663646f66795a66344c63796575336a656971546b645a3366777a6950664b7631614a766962582f312e473154635275, 'Barak', 'A.Pearlmutter', '2024-03-27 22:30:16', '2024-03-27 22:41:17', 1, 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Auctions`
--
ALTER TABLE `Auctions`
  ADD PRIMARY KEY (`auction_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `Bids`
--
ALTER TABLE `Bids`
  ADD PRIMARY KEY (`auction_id`),
  ADD KEY `userID` (`user_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `Events`
--
ALTER TABLE `Events`
  ADD PRIMARY KEY (`event_id`);

--
-- Indexes for table `Notifications`
--
ALTER TABLE `Notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `Tickets`
--
ALTER TABLE `Tickets`
  ADD PRIMARY KEY (`ticket_id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Auctions`
--
ALTER TABLE `Auctions`
  MODIFY `auction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `Bids`
--
ALTER TABLE `Bids`
  MODIFY `auction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- AUTO_INCREMENT for table `Events`
--
ALTER TABLE `Events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `Notifications`
--
ALTER TABLE `Notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1933;

--
-- AUTO_INCREMENT for table `Tickets`
--
ALTER TABLE `Tickets`
  MODIFY `ticket_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1188;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Auctions`
--
ALTER TABLE `Auctions`
  ADD CONSTRAINT `auctions_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `Events` (`event_id`);

--
-- Constraints for table `Bids`
--
ALTER TABLE `Bids`
  ADD CONSTRAINT `bids_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`UserID`),
  ADD CONSTRAINT `bids_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `Events` (`event_id`);

--
-- Constraints for table `Notifications`
--
ALTER TABLE `Notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`UserID`);

--
-- Constraints for table `Tickets`
--
ALTER TABLE `Tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `Events` (`event_id`),
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`UserID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
