-- Assign Coordinates to places in bgbPlaces

-- Load id geodata.csv

DROP TABLE IF EXISTS "cliwocPlacesAtlas";
CREATE TABLE "cliwocPlacesAtlas" (
  place varchar(255),
  coordinated varchar(255)
);

COPY "cliwocPlacesAtlas" FROM '/Users/Robert-Jan/Desktop/HDAT/src/data/geodataAtlas.html' DELIMITER ',' CSV;

-- Patternmatch a single place

-- Create testing table - to be removed soon

-- DROP TABLE IF EXISTS "testTable";
-- CREATE TABLE "testTable" (
--   place varchar(255),
--   "placeBGB" varchar(255)
-- );

DROP TABLE IF EXISTS "bgbPlaceGeo";
CREATE TABLE "bgbPlaceGeo" AS
  TABLE "bgbPlace";
ALTER TABLE "bgbPlaceGeo" ADD COLUMN "coordinate" varchar;

-- INNER JOIN approach

-- INSERT INTO "testTable" (place, "placeBGB")
-- SELECT 
-- 	place,
-- 	naam
-- FROM "cliwocPlacesAtlas", "bgbPlace"
-- WHERE naam = place;

UPDATE "bgbPlaceGeo"
SET coordinate = coordinated
FROM "cliwocPlacesAtlas"
WHERE naam = place;



-- FROM "cliwocPlacesAtlas", "bgbPlace"
-- WHERE naam = place;
