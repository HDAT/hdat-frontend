DROP TABLE IF EXISTS "bgbPlaceGeoJSON";
CREATE TABLE "bgbPlaceGeoJSON" (
	json 	json 
);

ALTER TABLE "bgbPlaceGeo" 
	ADD COLUMN "type" varchar(255) DEFAULT 'Feature',
	ADD COLUMN "geometry" text;

-- Convert geom to GeoJSON
UPDATE "bgbPlaceGeo" SET 
	geometry = ST_AsGeoJSON(geom);

-- Set data type of GeoJSON to json
ALTER TABLE "bgbPlaceGeo" 
	ALTER COLUMN geometry TYPE json USING geometry::json;

-- Create an object for every place (for places.json)

INSERT INTO "bgbPlaceGeoJSON" 
	SELECT row_to_json(t) FROM 
		(SELECT "type", "geometry",
		    (
		      SELECT row_to_json(d)
		      FROM (
		        SELECT naam
		      ) d
		    ) AS properties
	  	FROM "bgbPlaceGeo" WHERE "geometry" IS NOT NULL) 
	AS t;

-- Export can be found in details.sh