-- Create table for use by Torque
DROP TABLE IF EXISTS "allVoyagePoints" CASCADE;
CREATE TABLE "allVoyagePoints" (
	"id" SERIAL PRIMARY KEY,
	"voyId" integer,
	"voyArrivalPlaceId" integer,
	"voyDeparturePlaceId" integer,
	"voyArrivalPlaceCoord" geometry(POINT,4326),
	"voyDeparturePlaceCoord" geometry(POINT,4326),
	"route" geometry(GEOMETRY,4326),
	"segmentisedRoute" geometry(GEOMETRY,4326),
	"segmentisedRouteDump" geometry_dump,
	"segmentisedRouteDumpReadable" varchar(2000),
	"readableVoyArrivalPlaceCoord" varchar(255),
	"readableVoyDeparturePlaceCoord" varchar(255),
	"voyArrTimeStamp" timeStamp,
	"voyDepTimeStamp" timeStamp
);

-- Selecting the required data

INSERT INTO "allVoyagePoints" (
		"voyId", 
		"voyDeparturePlaceId", 
		"voyArrivalPlaceId", 
		"voyArrTimeStamp", 
		"voyDepTimeStamp"
	)
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

-- UPDATE "allVoyagePoints"
-- SET "route" = ST_SetSRID(ST_Line_Interpolate_Point("route", '0.5'), 4326);
-- UPDATE "allVoyagePoints"
-- SET "segmentisedRoute" = ST_Segmentize("route", '10');

-- -- CREATE Dump

-- UPDATE "allVoyagePoints"
-- SET "segmentisedRouteDump" = ST_DumpPoints("segmentisedRoute");

-- Making readable

-- UPDATE "allVoyagePoints"
-- SET "segmentisedRouteDumpReadable" = ST_asText("segmentisedRouteDump");

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



-- Loop function
DROP FUNCTION IF EXISTS insertpoints(geometry,timestamp without time zone);

CREATE OR REPLACE FUNCTION insertPoints(geometry,timestamp) RETURNS void AS 
$$
DECLARE
   iterator 	float4 := 1; 
   steps 		integer:= 5;
   -- steps		float4:= ST_Length_Spheroid($1,'SPHEROID["WGS 84",6378137,298.257223563]')/40; -- iedere 40 km een stap
   speed		integer:= 10; -- km/h
   -- increment	integer:= 0;

BEGIN
   WHILE iterator < steps
   LOOP
      -- increment := (iterator*((((ST_Length_Spheroid($1,'SPHEROID["WGS 84",6378137,298.257223563]'))/1000)/speed)/steps));
      INSERT INTO "allVoyagePoints" (
      	"route",
      	"readableVoyInterpolatedPlaceCoord",
      	"readableVoyArrivalPlaceCoord"
      	-- "voyDepTimeStamp"
      ) 
      VALUES (
      	ST_Line_Interpolate_Point($1, iterator/steps),
      	(ST_Length_Spheroid($1,'SPHEROID["WGS 84",6378137,298.257223563]'))/1000,
      	iterator*((((ST_Length_Spheroid($1,'SPHEROID["WGS 84",6378137,298.257223563]'))/1000)/speed)/steps)
      	-- date $2 + interval increment hour
      );
      iterator := iterator + 1;
   END LOOP;
   RETURN;
END 
$$ LANGUAGE 'plpgsql' ;

