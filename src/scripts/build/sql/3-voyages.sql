-- Create table for use by Torque
DROP TABLE IF EXISTS "bgbVoyageRoute";
CREATE TABLE "bgbVoyageRoute" (
	"id" SERIAL PRIMARY KEY,
	"voyId" integer,
	"voyDeparturePlaceId" integer,
	"voyArrivalPlaceId" integer,
	"voyDepartureRegioId" integer,
	"voyArrivalRegioId" integer,
	"voyArrivalPlaceNode" int,
	"voyDeparturePlaceNode" int,
	"voyArrivalRegioNode" int,
	"voyDepartureRegioNode" int,
	"routeTemp" geometry(linestring, 4326),
	"route" geometry(linestring, 4326),
	"routeGeoJSON" text,
	"voyArrTimeStamp" timeStamp,
	"voyDepTimeStamp" timeStamp
);

-- Selecting the required data

INSERT INTO "bgbVoyageRoute" (
		"voyId", 
		"voyDeparturePlaceId",
		"voyArrivalPlaceId",
		"voyDepartureRegioId",
		"voyArrivalRegioId",		
		"voyArrTimeStamp", 
		"voyDepTimeStamp"
	)
SELECT 
	"voyId",
	"voyDeparturePlaceId",
	"voyArrivalPlaceId",
	"voyDepartureRegioId",
	"voyArrivalRegioId",
	CASE 
		WHEN "voyArrivalYear" IS NOT NULL THEN to_timestamp(CONCAT_WS(' ', "voyArrivalDay", "voyArrivalMonth", "voyArrivalYear"),  'DD MM YYYY')
	END,
	CASE 
		WHEN "voyDepartureYear" IS NOT NULL THEN to_timestamp(CONCAT_WS(' ', "voyDepartureDay", "voyDepartureMonth", "voyDepartureYear"),  'DD MM YYYY')
	END
FROM "bgbVoyage";

-- Add route to places

UPDATE "bgbVoyageRoute" 
SET
	"voyDeparturePlaceNode" = "node"
FROM "bgbPlaceGeo" AS geo
WHERE "voyDeparturePlaceId" = geo.id;

UPDATE "bgbVoyageRoute" 
SET
	"voyArrivalPlaceNode" = "node"
FROM "bgbPlaceGeo" AS geo
WHERE "voyArrivalPlaceId" = geo.id;

-- Add nodes to region

UPDATE "bgbVoyageRoute" 
SET
	"voyDepartureRegioNode" = "node"
FROM "bgbRegioGeo" AS geo
WHERE "voyDepartureRegioId" = geo.id;

UPDATE "bgbVoyageRoute" 
SET
	"voyArrivalRegioNode" = "node"
FROM "bgbRegioGeo" AS geo
WHERE "voyArrivalRegioId" = geo.id;

-- Attach route
		
UPDATE "bgbVoyageRoute" 
SET 
	"routeTemp" = 	CASE 
						WHEN "voyDeparturePlaceNode" IS NOT NULL OR "voyArrivalPlaceNode" IS NOT NULL THEN
						(SELECT 
							-- ST_asText(
								ST_LineMerge(
									ST_CollectionExtract(
										ST_Collect(pgr_dijkstra_hdat)::geometry(geometryCollection, 4326)
									, 2)
								)
							-- ) 
						FROM pgr_dijkstra_hdat('routingMod',"voyDeparturePlaceNode","voyArrivalPlaceNode"))
					END;

UPDATE "bgbVoyageRoute" 
SET
	"route" = CASE
		WHEN (ST_EndPoint("routeTemp") = (SELECT the_geom FROM "routingMod_vertices_pgr" WHERE "voyDeparturePlaceNode" = "id")) THEN
		 	ST_Reverse("routeTemp")
		ELSE
			"routeTemp"
		END;

ALTER TABLE "bgbVoyageRoute" DROP COLUMN "routeTemp";

UPDATE "bgbVoyageRoute" 
SET
	"routeGeoJSON" = ST_AsGeoJSON("route")









