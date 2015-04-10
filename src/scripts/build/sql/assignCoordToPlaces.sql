-- Assign Coordinates to places in bgbPlaces

-- Load amh_location.csv

DROP TABLE IF EXISTS "amhPlaces";
CREATE TABLE "amhPlaces" (
	title varchar(255),
	record_type varchar(255),
	latitude varchar(255),
	longitude varchar(255)
);

COPY "amhPlaces" FROM '/Users/Robert-Jan/Desktop/HDAT/src/data/amh_location.csv' DELIMITER ',' CSV;

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











-- Add 30 regios to bgbPlaceGeo

-- INSERT INTO "bgbPlaceGeo" 
-- SELECT 	"id", "naam"
-- FROM "bgbRegio";