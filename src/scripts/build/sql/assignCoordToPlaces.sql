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
ALTER TABLE "bgbPlaceGeo" ADD COLUMN "coordinate" varchar;

-- Patternmatch places

UPDATE "bgbPlaceGeo"
SET coordinate = coordinated
FROM "placesAtlas"
WHERE naam = place;
