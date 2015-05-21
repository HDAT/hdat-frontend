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

-- CREATE TEMPORARY TABLE "bgbCargoMinard" AS TABLE "bgbCargo";

-- ALTER TABLE "bgbCargoMinard" 
-- 	ADD COLUMN "line" geometry(linestring, 4326);

-- Add lines from another table

-- UPDATE "bgbCargoMinard" SET 
-- 	"line"	= "route"
-- FROM "bgbVoyageRoute"
-- WHERE "voyId" = "carVoyageId";

-- DROP TABLE IF EXISTS "bgbCargoMinardExport";
-- CREATE TABLE "bgbCargoMinardExport" AS
-- 	SELECT 	"carProductId", 
-- 			ST_AsGeoJSON("line")::json AS geometry, 
-- 			count("carProductId") AS "numberVoyages", 
-- 			sum("carValueGuldens") AS "totalGuldens", 
-- 			sum("carValueLichtGuldens") AS "totalLichteGuldens"
-- 	FROM "bgbCargoMinard" 
-- 		GROUP BY "carProductId", "line" 
-- 		ORDER BY "carProductId";

-- ALTER TABLE "bgbCargoMinardExport"
-- 	ADD COLUMN "type" varchar(255) DEFAULT 'Feature';


-- Fill route with json
DROP TABLE IF EXISTS "bgbCargoMinardJSON";
CREATE TABLE "bgbCargoMinardJSON" (
	type	varchar(255),
	carproductid	integer,
	properties 	json,
	geometry	json
);

DROP TABLE IF EXISTS "bgbCargoMinardJSONBla";
CREATE TABLE "bgbCargoMinardJSONBla" (
	json json
);

INSERT INTO "bgbCargoMinardJSON" 
		(SELECT "type", "carProductId", (SELECT row_to_json(d) FROM (SELECT "numberVoyages", "carProductId") d) AS properties, "geometry" 
	  	FROM "bgbCargoMinardExport" LIMIT 250);


INSERT INTO "bgbCargoMinardJSONBla" 

select json_object(array_agg(carProductId)::text[],array_agg(rw)::text[])
	FROM ( SELECT carProductId, 
			( SELECT to_json(array_agg(row_to_json(t)))
               FROM ( SELECT type, properties, geometry FROM "bgbCargoMinardJSON" WHERE carProductId=b.carProductId) t ) rw
      FROM "bgbCargoMinardJSON" b
      GROUP BY carProductId ) z;


-- SELECT json_object(array_agg(carProductId)::text[],array_agg(rw)::text[])
-- from( SELECT carProductId
--            , ( SELECT to_json(array_agg(row_to_json(t)))
--                FROM (SELECT type, properties, geometry FROM "bgbCargoMinardJSON" WHERE carProductId=b.carProductId) t ) rw
--       FROM "bgbCargoMinardJSON" b
--       GROUP BY carProductId ) z;

-- psql -d bgb -c "copy (SELECT json_agg(carProductId)::json,json_agg(rw)::json FROM ( SELECT carProductId, ( SELECT to_json(array_agg(row_to_json(t))) FROM ( SELECT type, properties, geometry FROM \"bgbCargoMinardJSON\" WHERE carProductId=b.carProductId) t ) rw FROM \"bgbCargoMinardJSON\" b GROUP BY carProductId ) z) to '/Users/$USER/Desktop/HDAT/src/data/json/minard.json';"




-- psql -d bgb -c "copy (SELECT array_to_json(array_agg(route::json)) from \"bgbCargoMinardJSON\") to '/Users/$USER/Desktop/HDAT/src/data/json/minard.json';"


-- Remove temporary type column 
-- ALTER TABLE "bgbCargoMinardExport" DROP COLUMN "type";	
