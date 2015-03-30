-- Assign Coordinates to places in bgbPlaces

-- Load id geodata.csv

DROP TABLE IF EXISTS "placesAtlas";
CREATE TABLE "placesAtlas" (
  place varchar(255),
  coordinated varchar(255)
);

COPY "placesAtlas" FROM '/Users/Robert-Jan/Desktop/HDAT/src/data/geodataAtlas.html' DELIMITER ',' CSV;

-- Create table bgbPlaceGEO

DROP TABLE IF EXISTS "bgbPlaceGeo";
CREATE TABLE "bgbPlaceGeo" AS
  TABLE "bgbPlace";
ALTER TABLE "bgbPlaceGeo" ADD COLUMN "lng" float;
ALTER TABLE "bgbPlaceGeo" ADD COLUMN "lat" float;
-- Patternmatch places

UPDATE "bgbPlaceGeo"
SET 
	lng = to_number(split_part('-3.55,128.3', ',', 1),'MI9.9'),
	lat = to_number(split_part('-3.55,128.3', ',', 2),'MI9.9')
FROM "placesAtlas"
WHERE naam = place;