-- Assign Coordinates to places in bgbPlaces

DROP TABLE IF EXISTS "amhPlaces";
CREATE TABLE "amhPlaces" (
	title varchar(255),
	record_type varchar(255),
	latitude varchar(255),
	longitude varchar(255)
);

DROP TABLE IF EXISTS "routingMod";
CREATE TABLE "routingMod" AS
  TABLE "routing";

DROP TABLE IF EXISTS "bgbPlaceGeo";
CREATE TABLE "bgbPlaceGeo" AS
  TABLE "bgbPlace";

DROP TABLE IF EXISTS "bgbVoyageRoute";
CREATE TABLE "bgbVoyageRoute" AS
  TABLE "bgbVoyage";
