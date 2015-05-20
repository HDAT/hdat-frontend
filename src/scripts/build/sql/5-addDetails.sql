-- Insert aggregation of the cargo into bgbCargoMod table

-- INSERT INTO "bgbCargoMod" (carvoyageid, carinventory)
-- SELECT "carVoyageId", json_agg("carProductId") AS carinventory
-- FROM "bgbCargo"
-- GROUP BY 1;

-- Prepare bgbVoyageRoute

-- ALTER TABLE "bgbVoyageRoute" 
-- ADD COLUMN "inventory" json;

-- UPDATE "bgbVoyageRoute" SET 	
-- inventory = carinventory
-- FROM "bgbCargoMod" AS cargo
-- WHERE "voyId" = cargo.carvoyageid;

-- Stuff for the Minard Diagram

DROP TABLE IF EXISTS "bgbCargoMinard";
CREATE TEMPORARY TABLE "bgbCargoMinard" AS
  TABLE "bgbCargo";

ALTER TABLE "bgbCargoMinard" 
	ADD COLUMN "line" geometry(linestring, 4326);

UPDATE "bgbCargoMinard" SET 
	"line"	= "route"
FROM "bgbVoyageRoute"
WHERE "voyId" = "carVoyageId";

DROP TABLE IF EXISTS "bgbCargoMinardExport";
CREATE TABLE "bgbCargoMinardExport" AS
SELECT "carProductId", ST_AsGeoJSON("line"), count("carProductId") AS novoyages, sum("carValueGuldens") AS guldenstotaal, sum("carValueLichtGuldens") AS lichtguldenstotaal
FROM "bgbCargoMinard" GROUP BY "carProductId", "line" ORDER BY "carProductId";