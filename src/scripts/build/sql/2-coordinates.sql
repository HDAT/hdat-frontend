ALTER TABLE "bgbPlaceGeo" 
	ADD COLUMN "geom" geometry(geometry, 4326),
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

-- Connect the place to the nearest node in the route system. 

UPDATE "bgbPlaceGeo" SET node = findNearestNode("geom");

