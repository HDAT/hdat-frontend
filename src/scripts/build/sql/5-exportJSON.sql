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
		    ) AS properties,
		    (
		      SELECT row_to_json(d)
		      FROM (
		        SELECT first_ship_name, placeregio
		      ) d
		    ) AS voyagedetails
	  	-- FROM "bgbVoyageRoute" WHERE "geometry" IS NOT NULL AND "time" IS NOT NULL ORDER BY "voyDepTimeStamp" ASC) 
	  	FROM "bgbVoyageRoute" WHERE "geometry" IS NOT NULL AND "time" IS NOT NULL AND "voyDepTimeStamp" BETWEEN '1760-01-01 00:00:00'::timestamp AND '1765-01-10 00:00:00'::timestamp ORDER BY "voyDepTimeStamp" ASC) 
	-- AS t LIMIT 100;
	AS t;

-- Remove temporary type column 
ALTER TABLE "bgbVoyageRoute" DROP COLUMN "type";
