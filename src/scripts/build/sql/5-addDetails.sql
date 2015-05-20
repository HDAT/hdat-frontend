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

CREATE TEMPORARY TABLE "bgbCargoMinard" AS TABLE "bgbCargo";

ALTER TABLE "bgbCargoMinard" 
	ADD COLUMN "line" geometry(linestring, 4326);

-- Add lines from another table

UPDATE "bgbCargoMinard" SET 
	"line"	= "route"
FROM "bgbVoyageRoute"
WHERE "voyId" = "carVoyageId";

DROP TABLE IF EXISTS "bgbCargoMinardExport";
CREATE TABLE "bgbCargoMinardExport" AS
	SELECT 	"carProductId", 
			ST_AsGeoJSON("line")::json AS geometry, 
			count("carProductId") AS "numberVoyages", 
			sum("carValueGuldens") AS "totalGuldens", 
			sum("carValueLichtGuldens") AS "totalLichteGuldens"
	FROM "bgbCargoMinard" 
		GROUP BY "carProductId", "line" 
		ORDER BY "carProductId";

ALTER TABLE "bgbCargoMinardExport"
	ADD COLUMN "type" varchar(255) DEFAULT 'Feature',
	ADD COLUMN id SERIAL PRIMARY KEY,
	ADD COLUMN "blaat" json;

-- Fill route with json
DROP TABLE IF EXISTS "bgbCargoMinardJSON";
CREATE TABLE "bgbCargoMinardJSON" (
	route 	json 
);

INSERT INTO "bgbCargoMinardExport" (id, blaat)
SELECT id, (row_to_json(t) FROM "numberVoyages", "totalGuldens", "totalLichteGuldens" AS properties)
  	FROM "bgbCargoMinardExport"

SELECT json_build_object('type', 'Feature'), json_build_object('numberVoyages',"numberVoyages",'totalGuldens',"totalGuldens",'totalLichteGuldens',"totalLichteGuldens") FROM "bgbCargoMinardExport"

-- SELECT
-- 	"carProductId",
--     array_agg("geometry")
-- FROM
-- 	"bgbCargoMinardExport"
-- GROUP BY
-- 	"carProductId"

-- psql -d bgb -c "copy (SELECT array_to_json(array_agg(route::json)) from \"bgbCargoMinardJSON\") to '/Users/$USER/Desktop/HDAT/src/data/json/minard.json';"


-- Remove temporary type column 
-- ALTER TABLE "bgbCargoMinardExport" DROP COLUMN "type";	
