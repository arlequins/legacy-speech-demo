-- create user
USE mysql;
CREATE USER 'speech'@'%' IDENTIFIED BY 'rmfldna44';
GRANT ALL PRIVILEGES ON `speech`.* TO 'speech'@'%' IDENTIFIED BY 'rmfldna44';
FLUSH PRIVILEGES;

-- create default database
CREATE DATABASE /*!32312 IF NOT EXISTS*/ `speech` /*!40100 DEFAULT CHARACTER SET utf8 */;
