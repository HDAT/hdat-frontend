ALTER TABLE personnel 
	ADD COLUMN geom text;

UPDATE personnel
SET 
	geom = 	ST_AsGeoJSON(
				St_SetSRID(	
					ST_MakePoint(
						CAST("longitude" as FLOAT), 
						CAST("latitude" as FLOAT)
					),
					4326
				))
FROM "amhPlaces"
WHERE place = title;

ALTER TABLE personnel
	ALTER COLUMN geom TYPE json USING geom::json;