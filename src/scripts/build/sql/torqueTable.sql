-- Create table for use by Torque

DROP TABLE IF EXISTS "allVoyagePoints";
CREATE TABLE "allVoyagePoints" (
	"id" SERIAL PRIMARY KEY,
	"voyId" integer,
	"voyArrivalPlaceId" integer,
	"voyDeparturePlaceId" integer,
	"voyArrivalPlaceCoord" float,
	"voyDeparturePlaceCoord" float,
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
SET "voyDeparturePlaceCoord" = '1';
-- FROM "bgbPlaceGeo" geo
-- WHERE "voyDeparturePlaceId" = geo.id; 




-- ST_SetSRID(ST_MakeLine(ST_MakePoint(geo.lat, geo.lng), ST_MakePoint(geo.lat, geo.lng)),4326)