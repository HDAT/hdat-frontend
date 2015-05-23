ALTER TABLE "bgbPlaceGeo" 
	ADD COLUMN "geom" geometry(geometry, 4326),
	ADD COLUMN "type" varchar(255) DEFAULT 'Feature',
	ADD COLUMN "geometry" text,
	ADD COLUMN "node" int;

-- Match places to AMHplaces

UPDATE "bgbPlaceGeo"
SET 
	geom = 	St_SetSRID(	
				ST_MakePoint(
					CAST("longitude" as FLOAT), 
					CAST("latitude" as FLOAT)
				),
				4326
			)
FROM "amhPlaces"
WHERE naam = title;

-- Get GeoJSON
UPDATE "bgbPlaceGeo"
SET geometry = ST_AsGeoJSON(geom);

-- ST_AsGeoJSON doesn't support the data type json
-- So therefore we still have to convert it to valid json

ALTER TABLE "bgbPlaceGeo" 
	-- http://baudehlo.com/2014/04/28/postgresql-converting-text-columns-to-json/
	ALTER COLUMN geometry TYPE JSON USING geometry::JSON;




-- Connect the place to the nearest node in the route system. 

UPDATE "bgbPlaceGeo" SET node = findNearestNode("geom");

-- Doing the same stuff for the regio
-- ...

ALTER TABLE "bgbRegioGeo" 
	ADD COLUMN "geom" geometry(geometry, 4326),
	ADD COLUMN "node" int;

-- Match places to AMHplaces

UPDATE "bgbRegioGeo"
SET 
	geom = 	St_SetSRID(	
				ST_MakePoint(
					CAST("longitude" as FLOAT), 
					CAST("latitude" as FLOAT)
				),
				4326
			)
FROM "amhPlaces"
WHERE naam = title;

-- Connect the place to the nearest node in the route system. 

UPDATE "bgbRegioGeo" SET node = findNearestNode("geom");

