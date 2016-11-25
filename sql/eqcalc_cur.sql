-- MySQL dump 10.13  Distrib 5.5.53, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: eqcalc_db
-- ------------------------------------------------------
-- Server version	5.5.53-0+deb8u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `object_chassis`
--

DROP TABLE IF EXISTS `object_chassis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `object_chassis` (
  `code` bigint(20) unsigned NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `units_count` enum('1U','2U','4U') COLLATE utf8_bin NOT NULL DEFAULT '1U',
  `socket` enum('Socket 1150','Socket 1151','Socket 2011') COLLATE utf8_bin DEFAULT NULL,
  `cpu_count` enum('1','2') COLLATE utf8_bin NOT NULL DEFAULT '1',
  `ram_type` enum('DDR2','DDR3','DDR4') COLLATE utf8_bin NOT NULL DEFAULT 'DDR2',
  `ram_q` enum('4','8','16') COLLATE utf8_bin NOT NULL DEFAULT '4',
  `hdd_qty` enum('2','4','8') COLLATE utf8_bin NOT NULL DEFAULT '2',
  `ssd_qty` enum('2','4','8') COLLATE utf8_bin NOT NULL DEFAULT '2',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`,`code`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `object_chassis`
--

LOCK TABLES `object_chassis` WRITE;
/*!40000 ALTER TABLE `object_chassis` DISABLE KEYS */;
INSERT INTO `object_chassis` VALUES (200879344,1,'5019S-ML (2-bay)','1U','Socket 1151','1','DDR4','4','2','4','2016-11-21 08:07:53'),(578762110,2,'5019S-M (4-bay)','1U','Socket 1151','1','DDR4','4','4','4','2016-11-21 08:08:07');
/*!40000 ALTER TABLE `object_chassis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `object_cpu`
--

DROP TABLE IF EXISTS `object_cpu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `object_cpu` (
  `code` bigint(20) unsigned NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `socket` enum('Socket 1150','Socket 1151','Socket 2011') COLLATE utf8_bin DEFAULT NULL,
  `core_count` enum('1','2','4','8') COLLATE utf8_bin NOT NULL DEFAULT '1',
  `frequency` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`,`code`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `object_cpu`
--

LOCK TABLES `object_cpu` WRITE;
/*!40000 ALTER TABLE `object_cpu` DISABLE KEYS */;
INSERT INTO `object_cpu` VALUES (990151243,1,'Core i3-6100','Socket 1151','2','3,7 GHz','2016-11-21 07:50:19'),(654839761,2,'Xeon E3-1230v5','Socket 1151','4','3.4 GHz','2016-11-21 07:51:09'),(527162958,3,'Celeron G3900','Socket 1151','2','2.8 GHz','2016-11-21 07:52:01');
/*!40000 ALTER TABLE `object_cpu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `object_hdd`
--

DROP TABLE IF EXISTS `object_hdd`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `object_hdd` (
  `code` bigint(20) unsigned NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `capacity` enum('250GB','500GB','1TB','2TB','4TB') COLLATE utf8_bin DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`,`code`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `object_hdd`
--

LOCK TABLES `object_hdd` WRITE;
/*!40000 ALTER TABLE `object_hdd` DISABLE KEYS */;
INSERT INTO `object_hdd` VALUES (871617355,1,'Western Digital WD1003FBYZ','1TB','2016-11-21 07:54:37'),(849898704,2,'Western Digital WD2000FYYZ','2TB','2016-11-21 07:54:50'),(986032845,3,'Western Digital WD4000FYYZ','4TB','2016-11-21 07:55:02');
/*!40000 ALTER TABLE `object_hdd` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `object_price`
--

DROP TABLE IF EXISTS `object_price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `object_price` (
  `code` bigint(20) unsigned NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `price` float NOT NULL DEFAULT '0',
  `country_code` enum('UA','NL') COLLATE utf8_bin NOT NULL DEFAULT 'UA',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`,`code`)
) ENGINE=MyISAM AUTO_INCREMENT=33 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `object_price`
--

LOCK TABLES `object_price` WRITE;
/*!40000 ALTER TABLE `object_price` DISABLE KEYS */;
INSERT INTO `object_price` VALUES (200879344,1,430,'UA','2016-11-21 07:47:59'),(200879344,2,550,'NL','2016-11-21 07:47:59'),(578762110,3,670,'UA','2016-11-21 07:48:38'),(578762110,4,670,'NL','2016-11-21 07:48:38'),(990151243,5,125,'UA','2016-11-21 07:50:34'),(990151243,6,125,'NL','2016-11-21 07:50:34'),(654839761,7,340,'UA','2016-11-21 07:51:15'),(654839761,8,340,'NL','2016-11-21 07:51:15'),(527162958,9,40,'UA','2016-11-21 07:52:09'),(527162958,10,40,'NL','2016-11-21 07:52:09'),(397620919,11,100,'UA','2016-11-21 07:52:57'),(397620919,12,100,'NL','2016-11-21 07:52:57'),(642647188,13,300,'UA','2016-11-21 08:11:54'),(642647188,14,300,'NL','2016-11-21 08:11:54'),(871617355,15,110,'UA','2016-11-21 07:57:37'),(871617355,16,110,'NL','2016-11-21 07:57:37'),(849898704,17,120,'UA','2016-11-21 07:57:05'),(849898704,18,120,'NL','2016-11-21 07:57:05'),(986032845,19,300,'UA','2016-11-21 07:56:07'),(986032845,20,300,'NL','2016-11-21 07:56:07'),(388082045,21,240,'UA','2016-11-21 08:03:54'),(388082045,22,240,'NL','2016-11-21 08:03:54'),(367006881,23,135,'UA','2016-11-21 08:03:54'),(367006881,24,135,'NL','2016-11-21 08:03:54'),(797407796,25,460,'UA','2016-11-21 08:03:54'),(797407796,26,460,'NL','2016-11-21 08:03:54'),(672323380,27,188,'UA','2016-11-21 08:03:54'),(672323380,28,188,'NL','2016-11-21 08:03:54'),(894277517,29,115,'UA','2016-11-21 08:03:54'),(894277517,30,115,'NL','2016-11-21 08:03:54'),(814292401,31,360,'UA','2016-11-21 08:03:54'),(814292401,32,360,'NL','2016-11-21 08:03:54');
/*!40000 ALTER TABLE `object_price` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `object_raid`
--

DROP TABLE IF EXISTS `object_raid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `object_raid` (
  `code` bigint(20) unsigned NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`,`code`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `object_raid`
--

LOCK TABLES `object_raid` WRITE;
/*!40000 ALTER TABLE `object_raid` DISABLE KEYS */;
INSERT INTO `object_raid` VALUES (642647188,1,'LSI 9260-4i','2016-11-22 11:56:33');
/*!40000 ALTER TABLE `object_raid` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `object_ram`
--

DROP TABLE IF EXISTS `object_ram`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `object_ram` (
  `code` bigint(20) unsigned NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `ram_type` enum('DDR2','DDR3','DDR4') COLLATE utf8_bin NOT NULL DEFAULT 'DDR2',
  `capacity` enum('1GB','2GB','4GB','8GB','16GB') COLLATE utf8_bin NOT NULL DEFAULT '2GB',
  `frequency` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`,`code`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `object_ram`
--

LOCK TABLES `object_ram` WRITE;
/*!40000 ALTER TABLE `object_ram` DISABLE KEYS */;
INSERT INTO `object_ram` VALUES (397620919,1,'Samsung (M391A2K43BB1-CPB)','DDR4','16GB','2133 MHz','2016-11-21 07:52:52');
/*!40000 ALTER TABLE `object_ram` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `object_ssd`
--

DROP TABLE IF EXISTS `object_ssd`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `object_ssd` (
  `code` bigint(20) unsigned NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `capacity` enum('250GB','500GB','1TB','2TB','4TB') COLLATE utf8_bin DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`,`code`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `object_ssd`
--

LOCK TABLES `object_ssd` WRITE;
/*!40000 ALTER TABLE `object_ssd` DISABLE KEYS */;
INSERT INTO `object_ssd` VALUES (388082045,1,'Samsung 850 PRO 512GB','500GB','2016-11-22 12:13:16'),(367006881,2,'Samsung 850 PRO 256GB','250GB','2016-11-22 12:13:00'),(797407796,3,'Samsung 850 PRO 1TB','1TB','2016-11-22 12:14:00'),(672323380,4,'Samsung 850 EVO 500GB','500GB','2016-11-22 12:13:38'),(894277517,5,'Samsung 850 EVO 250GB','250GB','2016-11-22 12:14:23'),(814292401,6,'Samsung 850 EVO 1TB','1TB','2016-11-22 12:14:09');
/*!40000 ALTER TABLE `object_ssd` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payback`
--

DROP TABLE IF EXISTS `payback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `months` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`,`months`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payback`
--

LOCK TABLES `payback` WRITE;
/*!40000 ALTER TABLE `payback` DISABLE KEYS */;
INSERT INTO `payback` VALUES (1,15),(2,18),(3,20);
/*!40000 ALTER TABLE `payback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `primeprice`
--

DROP TABLE IF EXISTS `primeprice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `primeprice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `price` float NOT NULL DEFAULT '0',
  `country_code` enum('UA','NL') COLLATE utf8_bin NOT NULL DEFAULT 'UA',
  PRIMARY KEY (`id`,`country_code`,`price`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `primeprice`
--

LOCK TABLES `primeprice` WRITE;
/*!40000 ALTER TABLE `primeprice` DISABLE KEYS */;
INSERT INTO `primeprice` VALUES (1,20,'UA'),(2,25,'NL');
/*!40000 ALTER TABLE `primeprice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_reports`
--

DROP TABLE IF EXISTS `saved_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `saved_reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `UA_price1` float NOT NULL DEFAULT '0',
  `UA_price2` float NOT NULL DEFAULT '0',
  `UA_price3` float NOT NULL DEFAULT '0',
  `UA_hwprice` float NOT NULL DEFAULT '0',
  `NL_price1` float NOT NULL DEFAULT '0',
  `NL_price2` float NOT NULL DEFAULT '0',
  `NL_price3` float NOT NULL DEFAULT '0',
  `NL_hwprice` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_reports`
--

LOCK TABLES `saved_reports` WRITE;
/*!40000 ALTER TABLE `saved_reports` DISABLE KEYS */;
INSERT INTO `saved_reports` VALUES (1,'Xeon E3-1230v5/64GB RAM/LSI 9260-4i/ 2x500GB SSD',143.1,122.6,112.3,1846,156.1,134.2,123.3,1966);
/*!40000 ALTER TABLE `saved_reports` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-11-22 14:18:29
