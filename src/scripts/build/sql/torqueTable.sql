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
	"voyArrTimeStamp" timeStamp,
	"voyDepTimeStamp" timeStamp,
	"geom" varchar(255)
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

UPDATE "allVoyagePoints"
SET "route" = ST_SetSRID(ST_Line_Interpolate_Point("route", '0.5'), 4326);

-- Making readable

UPDATE "allVoyagePoints"
SET "geom" = ST_asText("route");

