-- Create table for use by Torque

DROP TABLE IF EXISTS "allVoyagePoints";
CREATE TABLE "allVoyagePoints" (
	"id" SERIAL PRIMARY KEY,
	"voyId" integer,
	"voyArrivalPlaceId" integer,
	"voyDeparturePlaceId" integer,
	"voyArrivalPlaceCoord" geometry(POINT,4326),
	"voyDeparturePlaceCoord" geometry(POINT,4326),
	"route" geometry(GEOMETRY,4326),
	"segmentisedRoute" geometry(GEOMETRY,4326),
	"segmentisedRouteDump" geometry(GEOMETRY,4326),
	"segmentisedRouteDumpReadable" varchar(2000),
	"readableVoyArrivalPlaceCoord" varchar(255),
	"readableVoyDeparturePlaceCoord" varchar(255),
	"voyArrTimeStamp" timeStamp,
	"voyDepTimeStamp" timeStamp
);

-- Selecting the required data

INSERT INTO "allVoyagePoints" ("voyId", "voyDeparturePlaceId", "voyArrivalPlaceId", "voyArrTimeStamp", "voyDepTimeStamp")
SELECT 
	"voyId",
	"voyDeparturePlaceId",
	"voyArrivalPlaceId",
	CASE WHEN "voyArrivalYear" IS NOT NULL THEN to_timestamp(CONCAT_WS(' ', "voyArrivalDay", "voyArrivalMonth", "voyArrivalYear"),  'DD MM YYYY')
	END,
	CASE WHEN "voyDepartureYear" IS NOT NULL THEN to_timestamp(CONCAT_WS(' ', "voyDepartureDay", "voyDepartureMonth", "voyDepartureYear"),  'DD MM YYYY')
	END
FROM "bgbVoyage";

-- Converting places to points

UPDATE "allVoyagePoints"
SET "voyDeparturePlaceCoord" = ST_SetSRID(ST_MakePoint(geo.lat, geo.lng),4326)
FROM "bgbPlaceGeo" geo
WHERE "voyDeparturePlaceId" = geo.id; 

UPDATE "allVoyagePoints"
SET "voyArrivalPlaceCoord" = ST_SetSRID(ST_MakePoint(geo.lat, geo.lng),4326)
FROM "bgbPlaceGeo" geo
WHERE "voyArrivalPlaceId" = geo.id;

-- Coverting coordinate to line

UPDATE "allVoyagePoints"
SET "route" = ST_SetSRID(ST_MakeLine("voyDeparturePlaceCoord", "voyArrivalPlaceCoord"),4326);

-- Segmentising a linestring

UPDATE "allVoyagePoints"
SET "segmentisedRoute" = ST_Segmentize("route", '10');

-- Selects only one point of the geom! There are more!

UPDATE "allVoyagePoints"
SET "segmentisedRouteDump" = (ST_DumpPoints("segmentisedRoute")).geom;

-- Making readable

UPDATE "allVoyagePoints"
SET "segmentisedRouteDumpReadable" = ST_asText("segmentisedRouteDump");

UPDATE "allVoyagePoints"
SET "readableVoyArrivalPlaceCoord" = ST_asText("voyArrivalPlaceCoord");

UPDATE "allVoyagePoints"
SET "readableVoyDeparturePlaceCoord" = ST_asText("voyDeparturePlaceCoord");


-- Create function that drops points
-- Should take two arguments, the amount of points we want, and the linestring

-- DROP FUNCTION createPoints(geometry(GEOMETRY,4326), integer);

-- CREATE FUNCTION createPoints(geometry(GEOMETRY,4326), integer) RETURNS integer AS $$
-- << outerblock >>
-- DECLARE
--     quantity integer := 30;
-- BEGIN
--     RAISE NOTICE 'Quantity here is %', quantity;  -- Prints 30
--     quantity := 50;
--     --
--     -- Create a subblock
--     --
--     DECLARE
--         quantity integer := 80;
--     BEGIN
--         RAISE NOTICE 'Quantity here is %', quantity;  -- Prints 80
--         RAISE NOTICE 'Outer quantity here is %', outerblock.quantity;  -- Prints 50
--     END;

--     RAISE NOTICE 'Quantity here is %', quantity;  -- Prints 50

--     RETURN quantity;
-- END;
-- $$ LANGUAGE plpgsql;


-- Updating line to interpolated point

-- UPDATE "allVoyagePoints"
-- SET "interpolatedPoint" = ST_SetSRID(ST_Line_Interpolate_Point("route", '0.5'), 4326);


