-- phpMyAdmin SQL Dump
-- version 4.0.4.1
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Ven 22 Novembre 2013 à 07:03
-- Version du serveur: 5.6.12
-- Version de PHP: 5.4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `stimboard`
--
CREATE DATABASE IF NOT EXISTS `stimboard` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `stimboard`;

-- --------------------------------------------------------

--
-- Structure de la table `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stdnum` int(60) NOT NULL,
  `name` varchar(255) NOT NULL,
  `level` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Contenu de la table `students`
--

INSERT INTO `students` (`id`, `stdnum`, `name`, `level`) VALUES
(1, 29000022, 'Romain Virama', 'ESIROI-I3'),
(2, 29000628, 'Emmanuel Leveneur', 'ESIROI-I3'),
(3, 29000073, 'Ludovic Maillot', 'ESIROI-I3');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
