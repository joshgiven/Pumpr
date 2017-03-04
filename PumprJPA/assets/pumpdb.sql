DROP SCHEMA IF EXISTS `pumpdb` ;
CREATE SCHEMA IF NOT EXISTS `pumpdb` ;
USE `pumpdb` ;


DROP TABLE IF EXISTS `fillup` ;

CREATE TABLE IF NOT EXISTS `fillup` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `date` DATE,
  `gallons` DECIMAL(10,2),
  `dollarsPerGallon` DECIMAL(10,3),
  `odometer` DECIMAL(10,1),
  `comments` VARCHAR(255),
  PRIMARY KEY (`id`) );
-- ENGINE = InnoDB;

-- SET SQL_MODE = '';
GRANT USAGE ON *.* TO pumpr@localhost;
 DROP USER pumpr@localhost;
-- SET SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
CREATE USER 'pumpr'@'localhost' IDENTIFIED BY 'pumpr';

GRANT SELECT, INSERT, TRIGGER ON TABLE * TO 'pumpr'@'localhost';
GRANT SELECT, INSERT, TRIGGER, UPDATE, DELETE ON TABLE * TO 'pumpr'@'localhost';
