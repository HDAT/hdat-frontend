-- Add a column type with the value feature

ALTER TABLE "bgbVoyageRoute" 
	ADD COLUMN "type" varchar(255) DEFAULT 'Feature';

-- Create new table for JSON

DROP TABLE IF EXISTS "bgbVoyageRouteJSON";
CREATE TABLE "bgbVoyageRouteJSON" (
	route 	json 
);

-- Fill route with json

INSERT INTO "bgbVoyageRouteJSON" 
	SELECT row_to_json(t) FROM 
		(SELECT "type", "geometry",
		    (
		      SELECT row_to_json(d)
		      FROM (
		        SELECT time
		      ) d
		    ) AS properties
	  	FROM "bgbVoyageRoute" WHERE "geometry" IS NOT NULL) 
	AS t;

-- Eventueel nog de type = Feature weghalen in bgbVoyageRoute