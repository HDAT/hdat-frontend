ALTER TABLE "bgbVoyageRoute" 
	ADD COLUMN "voyDepTimeStamp" timeStamp,
	ADD COLUMN "voyArrTimeStamp" timeStamp,
	ADD COLUMN "speed" integer, -- km/h
	ADD COLUMN "length" float, -- km
	ADD COLUMN "timeArray" json;

UPDATE "bgbVoyageRoute" SET 
	"voyDepTimeStamp" 	= CASE WHEN "voyDepartureYear" IS NOT NULL AND "voyDepartureMonth" IS NOT NULL AND "voyDepartureDay" IS NOT NULL THEN to_timestamp(CONCAT_WS(' ', "voyDepartureDay", "voyDepartureMonth", "voyDepartureYear"),  'DD MM YYYY') END,
	"voyArrTimeStamp" 	= CASE WHEN "voyArrivalYear" IS NOT NULL AND "voyArrivalMonth" IS NOT NULL AND "voyArrivalDay" IS NOT NULL THEN to_timestamp(CONCAT_WS(' ', "voyArrivalDay", "voyArrivalMonth", "voyArrivalYear"),  'DD MM YYYY') END,
	"speed" 			= '5', --km/h
	"length" 			= (ST_Length_Spheroid("route",'SPHEROID["WGS84",6378137,298.257223563]')/1000); --km

-- Generate missing departure times by using the arrival time
UPDATE "bgbVoyageRoute" SET 
	"voyDepTimeStamp"	= 	CASE WHEN "voyArrTimeStamp" IS NOT NULL AND "voyDepTimeStamp" IS NULL 
								THEN ("voyArrTimeStamp"::timestamp - interval '1h' * ("length"/"speed"))
							ELSE "voyDepTimeStamp" END;

-- Create array around the generate time array function
UPDATE "bgbVoyageRoute" SET
	"timeArray"			= 	CASE WHEN "voyDepTimeStamp" IS NOT NULL
								THEN (SELECT json_agg(times) FROM genTimeArray("voyDepTimeStamp","route","speed"))
							END;


-- TEMPORAL CONCATENATION

-- UPDATE "bgbVoyageRoute" 
-- SET
-- 	"voyDeparturePlaceNode" = "node"
-- FROM "bgbPlaceGeo" AS geo
-- WHERE "voyDeparturePlaceId" = geo.id;

