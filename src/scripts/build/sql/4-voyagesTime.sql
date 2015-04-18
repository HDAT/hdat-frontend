ALTER TABLE "bgbVoyageRoute" 
	ADD COLUMN "voyDepTimeStamp" timeStamp,
	ADD COLUMN "voyArrTimeStamp" timeStamp,
	ADD COLUMN "speed" integer, -- km/h
	ADD COLUMN "length" float; -- km

UPDATE "bgbVoyageRoute" SET 
	"voyDepTimeStamp" 	= CASE WHEN "voyDepartureYear" IS NOT NULL AND "voyDepartureMonth" IS NOT NULL AND "voyDepartureDay" IS NOT NULL THEN to_timestamp(CONCAT_WS(' ', "voyDepartureDay", "voyDepartureMonth", "voyDepartureYear"),  'DD MM YYYY') END,
	"voyArrTimeStamp" 	= CASE WHEN "voyArrivalYear" IS NOT NULL AND "voyArrivalMonth" IS NOT NULL AND "voyArrivalDay" IS NOT NULL THEN to_timestamp(CONCAT_WS(' ', "voyArrivalDay", "voyArrivalMonth", "voyArrivalYear"),  'DD MM YYYY') END,
	"speed" 			= '10', --km/h
	"length" 			= (ST_Length_Spheroid("route",'SPHEROID["WGS84",6378137,298.257223563]')/1000); --km

-- TEMPORAL CONCATENATION

-- UPDATE "bgbVoyageRoute" 
-- SET
-- 	"voyDeparturePlaceNode" = "node"
-- FROM "bgbPlaceGeo" AS geo
-- WHERE "voyDeparturePlaceId" = geo.id;

