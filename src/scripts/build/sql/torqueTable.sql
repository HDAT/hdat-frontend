-- Create table for use by Torque

DROP TABLE IF EXISTS "allVoyagePoints";
CREATE TABLE "allVoyagePoints" (
	id SERIAL PRIMARY KEY,
	voyId integer,
	lat float,
	lng float,
	voyArrTimeStamp timeStamp,
	voyDepTimeStamp timeStamp
);

-- Selecting the required data

INSERT INTO "allVoyagePoints" (voyId, lat, lng, voyArrTimeStamp, voyDepTimeStamp)
SELECT 
	"voyId",
	geo.lat,
	geo.lng,
	CASE WHEN "voyArrivalYear" IS NOT NULL THEN to_timestamp(CONCAT_WS(' ', "voyArrivalDay", "voyArrivalMonth", "voyArrivalYear"),  'DD MM YYYY')
	END,
	CASE WHEN "voyDepartureYear" IS NOT NULL THEN to_timestamp(CONCAT_WS(' ', "voyDepartureDay", "voyDepartureMonth", "voyDepartureYear"),  'DD MM YYYY')
	END
FROM "bgbVoyage" voyage, "bgbPlaceGeo" geo
WHERE "voyDeparturePlaceId" = geo.id;
