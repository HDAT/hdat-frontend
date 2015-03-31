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
	"voyArrTimeStamp" timeStamp,
	"voyDepTimeStamp" timeStamp,
	"readableVoyDeparturePlaceCoord" varchar(255),
	"readableVoyArrivalPlaceCoord" varchar(255),
	"readableVoyInterpolatedPlaceCoord" varchar(255)
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

-- Updating line to interpolated point

-- UPDATE "allVoyagePoints"
-- SET "route" = ST_SetSRID(ST_Line_Interpolate_Point("route", '0.5'), 4326);

-- Making readable

UPDATE "allVoyagePoints"
SET "readableVoyArrivalPlaceCoord" = ST_asText("voyArrivalPlaceCoord");

UPDATE "allVoyagePoints"
SET "readableVoyDeparturePlaceCoord" = ST_asText("voyDeparturePlaceCoord");

UPDATE "allVoyagePoints"
SET "readableVoyInterpolatedPlaceCoord" = ST_asText("route");


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

