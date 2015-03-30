-- Assign Coordinates to places in bgbPlaces

-- Load id geodata.csv

DROP TABLE IF EXISTS "cliwocPlacesAtlas";
CREATE TABLE "cliwocPlacesAtlas" (
  place varchar(255),
  coordinated varchar(255)
);

COPY "cliwocPlacesAtlas" FROM '/Users/Robert-Jan/Desktop/HDAT/src/data/geodataAtlas.html' DELIMITER ',' CSV;

-- Create table bgbPlaceGEO

DROP TABLE IF EXISTS "bgbPlaceGeo";
CREATE TABLE "bgbPlaceGeo" AS
  TABLE "bgbPlace";
ALTER TABLE "bgbPlaceGeo" ADD COLUMN "coordinate" varchar;

-- Patternmatch places

UPDATE "bgbPlaceGeo"
SET coordinate = coordinated
FROM "cliwocPlacesAtlas"
WHERE naam = place;
