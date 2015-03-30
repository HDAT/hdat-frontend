CREATE TABLE cliwoccood (
  ID INT,
  Place VARCHAR(255),
  DecLatitude float,
  DecLongitude float,
  ModernName VARCHAR(255),
  Dutch VARCHAR(255), 
  PRIMARY KEY (ID)
);

LOAD DATA LOCAL INFILE 'Geodata.csv'
INTO TABLE cliwoccood
FIELDS TERMINATED BY ';'
    ENCLOSED BY '"'
LINES TERMINATED BY '\n';
