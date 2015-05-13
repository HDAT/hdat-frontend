ALTER TABLE "bgbVoyageRoute" 
	ADD COLUMN "voyDepartureNode" 	int,
	ADD COLUMN "voyArrivalNode" 	int,
	ADD COLUMN "routeTemp" 			geometry(linestring, 4326),
	ADD COLUMN "route" 				geometry(linestring, 4326),
	ADD COLUMN "geometry" 			json,
	ADD COLUMN "placeregio" 		varchar(255);

-- Determine whether it goes from a place to regio, regio to regio etc.
UPDATE "bgbVoyageRoute"
SET "placeregio" = 	CASE 
						WHEN "voyDeparturePlaceId" IS NOT NULL AND "voyArrivalPlaceId" IS NOT NULL THEN
							'placeplace'
						WHEN "voyDeparturePlaceId" IS NOT NULL AND "voyArrivalPlaceId" IS NULL AND "voyArrivalRegioId" IS NOT NULL THEN
							'placeregio'
						WHEN "voyDeparturePlaceId" IS NULL AND "voyArrivalPlaceId" IS NOT NULL AND "voyDepartureRegioId" IS NOT NULL THEN
							'regioplace'
						WHEN "voyDeparturePlaceId" IS NULL AND "voyArrivalPlaceId" IS NULL AND "voyDepartureRegioId" IS NOT NULL AND "voyArrivalRegioId" IS NOT NULL THEN
							'regioregio'
					END;

-- Add route to places

UPDATE "bgbVoyageRoute" 
SET
	"voyDepartureNode" = "node"
FROM "bgbPlaceGeo" AS geo
WHERE "voyDeparturePlaceId" = geo.id;

UPDATE "bgbVoyageRoute" 
SET
	"voyArrivalNode" = "node"
FROM "bgbPlaceGeo" AS geo
WHERE "voyArrivalPlaceId" = geo.id;

-- Attach route
		
UPDATE "bgbVoyageRoute" 
SET 
	"routeTemp" = 	CASE 
						WHEN "voyDepartureNode" IS NOT NULL OR "voyArrivalNode" IS NOT NULL THEN
						(SELECT 
							-- ST_asText(
								ST_SetSRID(
									ST_LineMerge(
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
						FROM determineRoute('routingMod',"voyDepartureNode","voyArrivalNode"))
					END;

-- Make sure the directionality of the route is correct

UPDATE "bgbVoyageRoute" 
SET
	"route" = CASE
		WHEN (ST_EndPoint("routeTemp") = (SELECT the_geom FROM "routingMod_vertices_pgr" WHERE "voyDepartureNode" = "id")) THEN
		 	ST_Reverse("routeTemp")
		ELSE
			"routeTemp"
		END;

ALTER TABLE "bgbVoyageRoute" DROP COLUMN "routeTemp";


-- Transform the route to valid GeoJSON

UPDATE "bgbVoyageRoute" 
SET
	geometry = regexp_replace((ST_AsGeoJSON("route")), 'LineString', 'MultiPoint')::json;




