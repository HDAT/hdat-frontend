ALTER TABLE "bgbVoyageRoute" 
	ADD COLUMN "voyDeparturePlaceNode" int,
	ADD COLUMN "voyArrivalPlaceNode" int,
	ADD COLUMN "routeTemp" geometry(linestring, 4326),
	ADD COLUMN "route" geometry(linestring, 4326),
	ADD COLUMN "routeGeoJSON" text;

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
								ST_SetSRID(
									ST_LineMerge(
										-- DIRTY AS HELL THIS IS A SIMPLE SRID // TRANSFORM ISSUE // THIS SHIT COST AT LEAST 400 BUCKS, PLUS COFFEE
										ST_geomfromtext(
											ST_AsText(
												ST_CollectionExtract(
														ST_Collect(
															determineRoute
														)::geometry(geometryCollection, 4326)
												, 2)
											)
										)
									)
								,4326)
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
	"routeGeoJSON" = regexp_replace((ST_AsGeoJSON("route")), 'LineString', 'MultiPoint');




