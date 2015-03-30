-- Assign Coordinates to places in bgbPlaces

-- Load id geodata.csv

DROP TABLE IF EXISTS "cliwocPlaces";
CREATE TABLE "cliwocPlaces" (
  id integer PRIMARY KEY,
  place varchar(255),
  decLatitude float,
  decLongitude float,
  modernName varchar(255),
  dutch varchar(255)
);

COPY "cliwocPlaces" FROM '/Users/Robert-Jan/Desktop/HDAT/src/data/geodata.csv' DELIMITER ';' CSV;

-- Patternmatch a single place

-- Create testing table - to be removed soon

DROP TABLE IF EXISTS "testTable";
CREATE TABLE "testTable" (
  place varchar(255),
  "placeBGB" varchar(255)
);

-- Patternmatch

-- INSERT INTO "testTable" (id, place)
-- SELECT
-- 	id,
-- 	place LIKE 'Muscat'
-- FROM "cliwocPlaces";


-- WHEN "place" IS "Muscat"


-- INNER JOIN approach

INSERT INTO "testTable" (place, "placeBGB")
SELECT 
	place,
	naam
FROM "cliwocPlaces", "bgbPlace"
WHERE place = naam;


