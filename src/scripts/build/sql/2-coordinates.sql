-- Assign Coordinates to places in bgbPlaces

-- Load amh_location.csv

DROP TABLE IF EXISTS "amhPlaces";
CREATE TABLE "amhPlaces" (
	title varchar(255),
	record_type varchar(255),
	latitude varchar(255),
	longitude varchar(255)
);

COPY "amhPlaces" FROM '/Users/Robert-Jan/Desktop/HDAT/src/data/amh_location_mod.csv' DELIMITER ',' CSV;

-- PLACES
-- Create table bgbPlaceGeo

DROP TABLE IF EXISTS "bgbPlaceGeo";
CREATE TABLE "bgbPlaceGeo" AS
  TABLE "bgbPlace";
ALTER TABLE "bgbPlaceGeo" ADD COLUMN "lat" float;
ALTER TABLE "bgbPlaceGeo" ADD COLUMN "lng" float;

-- Patternmatch places

UPDATE "bgbPlaceGeo"
SET 
	lat = CAST(latitude as FLOAT),
	lng = CAST(longitude as FLOAT)
FROM "amhPlaces"
WHERE naam = title;

-- Run Nearest Node

ALTER TABLE "bgbPlaceGeo" 
    ADD COLUMN node int; 

UPDATE "bgbPlaceGeo" SET node = findNearestNode(lat, lng);

-- REGIONS
-- Create table bgbRegionsGeo

DROP TABLE IF EXISTS "bgbRegioGeo";
CREATE TABLE "bgbRegioGeo" AS
  TABLE "bgbRegio";
ALTER TABLE "bgbRegioGeo" ADD COLUMN "lat" float;
ALTER TABLE "bgbRegioGeo" ADD COLUMN "lng" float;

-- Patternmatch regio

UPDATE "bgbRegioGeo"
SET 
	lat = CAST(latitude as FLOAT),
	lng = CAST(longitude as FLOAT)
FROM "amhPlaces"
WHERE naam = title;

-- Run Nearest Node

ALTER TABLE "bgbRegioGeo" 
    ADD COLUMN node int; 

UPDATE "bgbRegioGeo" SET node = findNearestNode(lat, lng);

