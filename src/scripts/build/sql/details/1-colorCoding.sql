-- Insert aggregation of the cargo into bgbCargoMod table

INSERT INTO "bgbCargoMod" (carvoyageid, carinventory)
SELECT "carVoyageId", json_agg("carProductId") AS carinventory
FROM "bgbCargo"
GROUP BY 1;

-- Prepare bgbVoyageRoute

ALTER TABLE "bgbVoyageRoute" 
ADD COLUMN "inventory" json;

UPDATE "bgbVoyageRoute" SET 	
inventory = carinventory
FROM "bgbCargoMod" AS cargo
WHERE "voyId" = cargo.carvoyageid;
