-- Create table for use by Torque
DROP TABLE IF EXISTS "voyagePoints" CASCADE;
CREATE TABLE "voyagePoints" (
	"id" SERIAL PRIMARY KEY,
	"voyId" integer,
	"voyArrivalId" integer,
	"voyDepartureId" integer,
	"voyarrivalnode" bigint,
	"voydeparturenode" bigint,
	"route" geometry(linestring, 4326),
	"voyArrTimeStamp" timeStamp,
	"voyDepTimeStamp" timeStamp
);

-- Selecting the required data

INSERT INTO "voyagePoints" (
		"voyId", 
		"voyDepartureId", 
		"voyArrivalId", 
		"voyArrTimeStamp", 
		"voyDepTimeStamp"
	)
SELECT 
	"voyId",
	CASE 	
		WHEN "voyDeparturePlaceId" IS NOT NULL THEN "voyDeparturePlaceId"
		WHEN "voyDeparturePlaceId" IS NULL THEN "voyDepartureRegioId"
	END,
	CASE 	
		WHEN "voyArrivalPlaceId" IS NOT NULL THEN "voyArrivalPlaceId"
		WHEN "voyArrivalPlaceId" IS NULL THEN "voyArrivalRegioId"
	END,
	CASE 
		WHEN "voyArrivalYear" IS NOT NULL THEN to_timestamp(CONCAT_WS(' ', "voyArrivalDay", "voyArrivalMonth", "voyArrivalYear"),  'DD MM YYYY')
	END,
	CASE 
		WHEN "voyDepartureYear" IS NOT NULL THEN to_timestamp(CONCAT_WS(' ', "voyDepartureDay", "voyDepartureMonth", "voyDepartureYear"),  'DD MM YYYY')
	END
FROM "bgbVoyage";

-- Converting places to points

UPDATE "voyagePoints"
SET "voydeparturenode" = findNearestNode(geo.lng, geo.lat)
FROM "bgbPlaceGeo" geo
WHERE "voyDepartureId" = geo.id; 

UPDATE "voyagePoints"
SET "voyarrivalnode" = findNearestNode(geo.lng, geo.lat)
FROM "bgbPlaceGeo" geo
WHERE "voyArrivalId" = geo.id;

-- Attach route

INSERT INTO "voyagePoints" (
	"route"
	)
SELECT ST_Linemerge(ST_Union(pgr_dijkstra_hdat('dasbgbroute',"voydeparturenode","voyarrivalnode")))
FROM "voyagePoints";



