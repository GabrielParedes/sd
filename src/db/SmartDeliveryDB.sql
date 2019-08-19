/*
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `SmartDeliveryDB` DEFAULT CHARACTER SET utf8 ;
USE `SmartDeliveryDB` ;

-- -----------------------------------------------------
-- Table `SmartDeliveryDB`.`AdminUsers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `SmartDeliveryDB`.`AdminUsers` (
  `idAdminUser` INT(11) NOT NULL AUTO_INCREMENT,
  `fullName` VARCHAR(100) NOT NULL,
  `username` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `profileImage` VARCHAR(255) NULL DEFAULT NULL,
  `headerImage` VARCHAR(255) NULL DEFAULT NULL,
  `code_password` VARCHAR(10) NULL DEFAULT NULL,
  `code_created` BIGINT(20) NULL DEFAULT NULL,
  PRIMARY KEY (`idAdminUser`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 21
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `SmartDeliveryDB`.`Areas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `SmartDeliveryDB`.`Areas` (
  `idArea` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` LONGTEXT NOT NULL,
  PRIMARY KEY (`idArea`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `SmartDeliveryDB`.`DriverUsers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `SmartDeliveryDB`.`DriverUsers` (
  `idDriverUser` INT(11) NOT NULL AUTO_INCREMENT,
  `fullName` VARCHAR(100) NOT NULL,
  `username` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `idCar` VARCHAR(45) NOT NULL,
  `brand` VARCHAR(45) NOT NULL,
  `vehicleType` VARCHAR(45) NOT NULL,
  `model` VARCHAR(45) NOT NULL,
  `color` VARCHAR(45) NOT NULL,
  `profileImage` VARCHAR(255) NULL DEFAULT NULL,
  `headerImage` VARCHAR(255) NULL DEFAULT NULL,
  `code_password` VARCHAR(10) NULL DEFAULT NULL,
  `code_created` BIGINT(20) NULL DEFAULT NULL,
  `Areas_idArea` INT(11) NOT NULL,
  PRIMARY KEY (`idDriverUser`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `idCar_UNIQUE` (`idCar` ASC),
  INDEX `fk_DriverUsers_Areas1_idx` (`Areas_idArea` ASC),
  CONSTRAINT `fk_DriverUsers_Areas1`
    FOREIGN KEY (`Areas_idArea`)
    REFERENCES `SmartDeliveryDB`.`Areas` (`idArea`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `SmartDeliveryDB`.`DriverStatus`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `SmartDeliveryDB`.`DriverStatus` (
  `idStatus` INT(11) NOT NULL AUTO_INCREMENT,
  `startDate` DATE NOT NULL,
  `startTime` VARCHAR(15) NOT NULL,
  `endDate` DATE NOT NULL,
  `endTime` TIME NOT NULL,
  `status` VARCHAR(20) NOT NULL,
  `authorized` VARCHAR(5) NULL,
  `dateCreated` DATE NULL,
  `timeCreated` TIME NULL,
  `DriverUsers_idDriverUser` INT(11) NOT NULL,
  `Restaurants_idRestaurant` INT(11) NULL,
  `reviewedBy` VARCHAR(50) NULL,
  `dateReviewed` DATE NULL,
  `timeReviewed` TIME NULL,
  PRIMARY KEY (`idStatus`),
  INDEX `fk_DriverStatus_DriverUsers1_idx` (`DriverUsers_idDriverUser` ASC),
  CONSTRAINT `fk_DriverStatus_DriverUsers1`
    FOREIGN KEY (`DriverUsers_idDriverUser`)
    REFERENCES `SmartDeliveryDB`.`DriverUsers` (`idDriverUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `SmartDeliveryDB`.`Orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `SmartDeliveryDB`.`Orders` (
  `idOrder` INT(11) NOT NULL AUTO_INCREMENT,
  `numOrder` VARCHAR(45) NOT NULL,
  `phoneNumber` VARCHAR(45) NOT NULL,
  `deliveryAddress` VARCHAR(45) NOT NULL,
  `askFor` VARCHAR(45) NOT NULL,
  `status` VARCHAR(45) NULL,
  `DriverUsers_idDriverUser` INT(11) NOT NULL,
  PRIMARY KEY (`idOrder`),
  INDEX `fk_Orders_DriverUsers1_idx` (`DriverUsers_idDriverUser` ASC),
  CONSTRAINT `fk_Orders_DriverUsers1`
    FOREIGN KEY (`DriverUsers_idDriverUser`)
    REFERENCES `SmartDeliveryDB`.`DriverUsers` (`idDriverUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `SmartDeliveryDB`.`RestaurantUsers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `SmartDeliveryDB`.`RestaurantUsers` (
  `idRestaurantUser` INT(11) NOT NULL AUTO_INCREMENT,
  `fullName` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `profileImage` VARCHAR(255) NULL DEFAULT NULL,
  `headerImage` VARCHAR(255) NULL DEFAULT NULL,
  `code_password` VARCHAR(10) NULL DEFAULT NULL,
  `code_created` BIGINT(20) NULL DEFAULT NULL,
  PRIMARY KEY (`idRestaurantUser`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `SmartDeliveryDB`.`notes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `SmartDeliveryDB`.`notes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `note` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SmartDeliveryDB`.`Restaurants`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `SmartDeliveryDB`.`Restaurants` (
  `idRestaurant` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NULL,
  `askFor` VARCHAR(150) NOT NULL,
  `logo` VARCHAR(255) NULL,
  `Areas_idArea` INT(11) NOT NULL,
  PRIMARY KEY (`idRestaurant`),
  INDEX `fk_Restaurants_Areas1_idx` (`Areas_idArea` ASC),
  CONSTRAINT `fk_Restaurants_Areas1`
    FOREIGN KEY (`Areas_idArea`)
    REFERENCES `SmartDeliveryDB`.`Areas` (`idArea`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SmartDeliveryDB`.`Notifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `SmartDeliveryDB`.`Notifications` (
  `idNotification` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`idNotification`))
ENGINE = InnoDB;

USE `SmartDeliveryDB` ;

-- -----------------------------------------------------
-- procedure deleteCode
-- -----------------------------------------------------

DELIMITER $$
USE `SmartDeliveryDB`$$
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `deleteCode`(IN code_password2 VARCHAR(100))
BEGIN
	DECLARE typeUser varchar(25);
	
	if (SELECT AdminUsers.idAdminUser FROM AdminUsers WHERE  code_password = code_password2) is not null then
	UPDATE AdminUsers SET code_password = null, code_created =null WHERE code_password = code_password2;

	elseif (SELECT RestaurantUsers.idRestaurantUser FROM RestaurantUsers WHERE  code_password = code_password2) is not null then
	UPDATE RestaurantUsers SET code_password = null, code_created =null WHERE code_password = code_password2;

	elseif (SELECT DriverUsers.idDriverUser FROM DriverUsers WHERE  code_password = code_password2) is not null then
	UPDATE DriverUsers SET code_password = null, code_created =null WHERE code_password = code_password2;
	end if;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure searchCode
-- -----------------------------------------------------

DELIMITER $$
USE `SmartDeliveryDB`$$
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `searchCode`(IN code_password2 VARCHAR(10),email2 VARCHAR(100))
BEGIN
	
	if (SELECT AdminUsers.idAdminUser FROM AdminUsers WHERE  code_password = code_password2) is not null then
	SELECT * FROM AdminUsers WHERE code_password = code_password2 AND email = email2;

	elseif (SELECT RestaurantUsers.idRestaurantUser FROM RestaurantUsers WHERE  code_password = code_password2) is not null then
	SELECT * FROM RestaurantUsers WHERE code_password = code_password2 AND email = email2;

	elseif (SELECT DriverUsers.idDriverUser FROM DriverUsers WHERE  code_password = code_password2) is not null then
	SELECT * FROM DriverUsers WHERE code_password = code_password2 AND email = email2;
	end if;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure searchEmail
-- -----------------------------------------------------

DELIMITER $$
USE `SmartDeliveryDB`$$
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `searchEmail`(IN email2 VARCHAR(100))
BEGIN
	
	if (SELECT AdminUsers.idAdminUser FROM AdminUsers WHERE  email = email2) is not null then
	SELECT *,CONCAT("Admin") as typeUser, idAdminUser as id FROM AdminUsers WHERE  email = email2;

	elseif (SELECT RestaurantUsers.idRestaurantUser FROM RestaurantUsers WHERE  email = email2) is not null then
	SELECT *,CONCAT("Restaurant") as typeUser, idRestaurantUser as id FROM RestaurantUsers WHERE  email = email2;

	elseif (SELECT DriverUsers.idDriverUser FROM DriverUsers WHERE  email = email2) is not null then
	SELECT *,CONCAT("Driver") as typeUser, idDriverUser as id FROM DriverUsers WHERE  email = email2;
	end if;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure searchUsername
-- -----------------------------------------------------

DELIMITER $$
USE `SmartDeliveryDB`$$
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `searchUsername`(IN username2 VARCHAR(100))
BEGIN
	
	if (SELECT AdminUsers.idAdminUser FROM AdminUsers WHERE BINARY username = username2) is not null then
	SELECT *, CONCAT("Admin") as typeUser, idAdminUser as id FROM AdminUsers WHERE BINARY username = username2;

	elseif (SELECT DriverUsers.idDriverUser FROM DriverUsers WHERE BINARY username = username2) is not null then
	SELECT *, CONCAT("Driver") as typeUser, idDriverUser as id FROM DriverUsers WHERE BINARY username = username2;

	elseif (SELECT RestaurantUsers.idRestaurantUser FROM RestaurantUsers WHERE BINARY username = username2 is not null) then
	SELECT *, CONCAT("Restaurant") as typeUser, idRestaurantUser as id FROM RestaurantUsers WHERE BINARY username = username2;

	end if;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure searchUsers
-- -----------------------------------------------------

DELIMITER $$
USE `SmartDeliveryDB`$$
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `searchUsers`(IN username2 VARCHAR(100), email2 VARCHAR(100))
BEGIN
	
	if (SELECT AdminUsers.idAdminUser FROM AdminUsers WHERE username = username2 OR email = email2) is not null then
	SELECT *, CONCAT("Admin") as typeUser FROM AdminUsers WHERE username = username2 OR email = email2;

    elseif (SELECT DriverUsers.idDriverUser FROM DriverUsers WHERE username = username2 OR email = email2) is not null then
	SELECT *, CONCAT("Driver") as typeUser FROM DriverUsers WHERE username = username2 OR email = email2;

	elseif (SELECT RestaurantUsers.idRestaurantUser FROM RestaurantUsers WHERE username = username2 OR email = email2) is not null then
	SELECT *, CONCAT("Restaurant") as typeUser FROM RestaurantUsers WHERE username = username2 OR email = email2;

	end if;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure updateCode
-- -----------------------------------------------------

DELIMITER $$
USE `SmartDeliveryDB`$$
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `updateCode`(IN code_password2 VARCHAR(150), code_created2 BIGINT, email2 VARCHAR(100))
BEGIN

	if (SELECT AdminUsers.idAdminUser FROM AdminUsers WHERE  email = email2) is not null then
		UPDATE AdminUsers SET  code_password = code_password2, code_created = code_created2  WHERE email = email2;
	

	elseif (SELECT RestaurantUsers.idRestaurantUser FROM RestaurantUsers WHERE  email = email2) is not null then
		UPDATE RestaurantUsers SET code_password = code_password2, code_created = code_created2 WHERE email = email2;

	elseif (SELECT DriverUsers.idDriverUser FROM DriverUsers WHERE  email = email2) is not null then
		UPDATE DriverUsers SET code_password = code_password2, code_created = code_created2 WHERE email = email2;
	end if;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure updatePassword
-- -----------------------------------------------------

DELIMITER $$
USE `SmartDeliveryDB`$$
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `updatePassword`(IN newPassword2 VARCHAR(255), email2 VARCHAR(100))
BEGIN

	if (SELECT AdminUsers.idAdminUser FROM AdminUsers WHERE  email = email2 AND  code_password is not null) is not null then
		UPDATE AdminUsers SET password = newPassword2, code_password = null, code_created = null WHERE email = email2;
	

	elseif (SELECT RestaurantUsers.idRestaurantUser FROM RestaurantUsers WHERE  email = email2 AND code_password is not null) is not null then
		UPDATE RestaurantUsers SET password = newPassword2, code_password = null, code_created = null WHERE email = email2;

	elseif (SELECT DriverUsers.idDriverUser FROM DriverUsers WHERE  email = email2 AND  code_password is not null) is not null then
		UPDATE DriverUsers SET password = newPassword2, code_password = null, code_created = null WHERE email = email2;
	end if;
END$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
*/
