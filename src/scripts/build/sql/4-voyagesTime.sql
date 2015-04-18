ALTER TABLE "bgbVoyageRoute" 
	ADD COLUMN "voyDepTimeStamp" timeStamp,
	ADD COLUMN "voyArrTimeStamp" timeStamp;

UPDATE "bgbVoyageRoute"
SET "voyDepTimeStamp" = CASE WHEN "voyDepartureYear" IS NOT NULL AND "voyDepartureMonth" IS NOT NULL AND "voyDepartureDay" IS NOT NULL THEN to_timestamp(CONCAT_WS(' ', "voyDepartureDay", "voyDepartureMonth", "voyDepartureYear"),  'DD MM YYYY') END;
UPDATE "bgbVoyageRoute"
SET "voyArrTimeStamp" = CASE WHEN "voyArrivalYear" IS NOT NULL AND "voyArrivalMonth" IS NOT NULL AND "voyArrivalDay" IS NOT NULL THEN to_timestamp(CONCAT_WS(' ', "voyArrivalDay", "voyArrivalMonth", "voyArrivalYear"),  'DD MM YYYY') END;

-- TEMPORAL CONCATENATION

-- UPDATE "bgbVoyageRoute" 
-- SET
-- 	"voyDeparturePlaceNode" = "node"
-- FROM "bgbPlaceGeo" AS geo
-- WHERE "voyDeparturePlaceId" = geo.id;


