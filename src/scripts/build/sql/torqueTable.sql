-- Create table for use by Torque
DROP TABLE IF EXISTS "voyagePoints" CASCADE;
CREATE TABLE "voyagePoints" (
	"id" SERIAL PRIMARY KEY,
	"voyId" integer,
	"voyArrivalPlaceId" integer,
	"voyDeparturePlaceId" integer,
	"voyArrivalPlaceCoord" geometry(POINT,4326),
	"voyDeparturePlaceCoord" geometry(POINT,4326),
	"route" geometry(GEOMETRY,4326),
	"voyArrTimeStamp" timeStamp,
	"voyDepTimeStamp" timeStamp
);

-- Selecting the required data

INSERT INTO "voyagePoints" (
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

UPDATE "voyagePoints"
SET "voyDeparturePlaceCoord" = ST_SetSRID(ST_MakePoint(geo.lat, geo.lng),4326)
FROM "bgbPlaceGeo" geo
WHERE "voyDeparturePlaceId" = geo.id; 

UPDATE "voyagePoints"
SET "voyArrivalPlaceCoord" = ST_SetSRID(ST_MakePoint(geo.lat, geo.lng),4326)
FROM "bgbPlaceGeo" geo
WHERE "voyArrivalPlaceId" = geo.id;

-- Coverting coordinate to line

UPDATE "voyagePoints"
SET "route" = ST_SetSRID(ST_MakeLine("voyDeparturePlaceCoord", "voyArrivalPlaceCoord"),4326);

-- Loop function

DROP TABLE "allVoyagePoints";
CREATE TABLE "allVoyagePoints" (
	"id" SERIAL PRIMARY KEY,
	"voyId" integer,
	"the_geom" geometry(POINT,4326),
	"date" timeStamp
);

DROP FUNCTION IF EXISTS insertpoints(integer, geometry, timestamp, timestamp);
CREATE OR REPLACE FUNCTION insertPoints(integer, geometry, timestamp, timestamp) RETURNS void AS 
$$
DECLARE
   	iterator 	float 	:= 1; 
   	steps    	float	:= round(((ST_Length_Spheroid($2,'SPHEROID["WGS 84",6378137,298.257223563]'))/1000)/50); -- iedere 50 km een stap
   	speed			integer	:= 10; -- km/h
	increment		float 	:= 0;

BEGIN
   	WHILE iterator < steps
   	LOOP
	
		increment := iterator*((((ST_Length_Spheroid($2,'SPHEROID["WGS 84",6378137,298.257223563]'))/1000)/speed)/steps);
		-- RAISE NOTICE 'check %', steps;

      INSERT INTO "allVoyagePoints" (
      	"voyId",
      	"the_geom",
      	"date"
      ) 
      VALUES (
      	$1,
      	ST_Line_Interpolate_Point($2, iterator/steps),
      	CASE WHEN $3 IS NOT NULL THEN $3 + interval '1h' * increment
				WHEN $4 IS NOT NULL THEN $4 - interval '1h' * increment
		END
      );

      iterator := iterator + 1;
   END LOOP;
   RETURN;
END 
$$ LANGUAGE 'plpgsql' ;

-- Run function
SELECT 
	insertPoints("voyId", "route", "voyDepTimeStamp", "voyArrTimeStamp")
FROM "voyagePoints";
