DROP TABLE IF EXISTS "bgbVoyageRoute";
CREATE TABLE "bgbVoyageRoute" AS
  TABLE "bgbVoyage";

ALTER TABLE "bgbVoyageRoute" 
	ADD COLUMN "voyDeparturePlaceNode" int,
	ADD COLUMN "voyArrivalPlaceNode" int,
	ADD COLUMN "voyDepartureRegioNode" int,
	ADD COLUMN "voyArrivalRegioNode" int,
	ADD COLUMN "routeTemp" geometry(linestring, 4326),
	ADD COLUMN "route" geometry(linestring, 4326),
	ADD COLUMN "routeGeoJSON" text,
	ADD COLUMN "voyDepTimeStamp" timeStamp,
	ADD COLUMN "voyArrTimeStamp" timeStamp;

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

-- Attach route
		
UPDATE "bgbVoyageRoute" 
SET 
	"routeTemp" = 	CASE 
						WHEN "voyDeparturePlaceNode" IS NOT NULL OR "voyArrivalPlaceNode" IS NOT NULL THEN
						(SELECT 
							-- ST_asText(
								ST_LineMerge(
									ST_CollectionExtract(
										ST_Collect(determineRoute)::geometry(geometryCollection, 4326)
									, 2)
								)
							-- ) 
						FROM determineRoute('routingMod',"voyDeparturePlaceNode","voyArrivalPlaceNode"))
					END;

-- Make sure the directionality of the route is correct

UPDATE "bgbVoyageRoute" 
SET
	"route" = CASE
		WHEN (ST_EndPoint("routeTemp") = (SELECT the_geom FROM "routingMod_vertices_pgr" WHERE "voyDeparturePlaceNode" = "id")) THEN
		 	ST_Reverse("routeTemp")
		ELSE
			"routeTemp"
		END;

ALTER TABLE "bgbVoyageRoute" DROP COLUMN "routeTemp";

-- Transform the route to valid GeoJSON

UPDATE "bgbVoyageRoute" 
SET
	"routeGeoJSON" = ST_AsGeoJSON("route");


-- TEMPORAL CONCATENATION


	-- CASE 
	-- 	WHEN "voyArrivalYear" IS NOT NULL THEN to_timestamp(CONCAT_WS(' ', "voyArrivalDay", "voyArrivalMonth", "voyArrivalYear"),  'DD MM YYYY')
	-- END,
	-- CASE 
	-- 	WHEN "voyDepartureYear" IS NOT NULL THEN to_timestamp(CONCAT_WS(' ', "voyDepartureDay", "voyDepartureMonth", "voyDepartureYear"),  'DD MM YYYY')
	-- END





