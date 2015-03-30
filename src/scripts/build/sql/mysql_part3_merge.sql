-- Tijdelijke oplossing: separeer rows zonder DAS ID
CREATE TABLE bgbVoyageReformatMinusDAS 
SELECT * 
FROM bgbVoyageReformat 
WHERE `voyDASNumber` IS NULL OR `voyDASNumber` = '';

-- Merge DAS en BGB
CREATE TABLE bgbdasVoyageMerge
AS SELECT * FROM tempTableDASTimestamp
UNION SELECT * FROM bgbVoyageReformatMinusDAS;

ALTER TABLE bgbdasVoyageMerge
ADD PRIMARY KEY (voyId);


-- Creeer routes, gewoon om te kijken wat we hebben
-- Dit is verder niet bruikbaar voor de SQL-API/Torque whatever
-- Maar meer voor ons
CREATE TABLE bgbdasVoyageMergeRoute
SELECT 	*,
		CONCAT_WS("-", `PlaceOfDeparture`, `PlaceofArrival`) AS `voyRoute`
FROM bgbdasVoyageMerge;

-- Nieuwe tabel met routes
CREATE TABLE hdatRoutes
SELECT DISTINCT `voyRoute`
FROM bgbdasVoyageMergeRoute;

ALTER TABLE hdatRoutes
ADD routeId MEDIUMINT NOT NULL AUTO_INCREMENT KEY;
ALTER TABLE hdatRoutes
CHANGE COLUMN voyRoute voyRoute varchar(511) AFTER routeId;


-- Vervang strings met ids
CREATE TABLE bgbdasVoyageMergeRouteId
SELECT 	e.*,
		d.routeId
FROM bgbdasVoyageMergeRoute e 
INNER JOIN hdatRoutes d 
ON e.voyRoute = d.voyRoute;

ALTER TABLE bgbdasVoyageMergeRouteId
ADD PRIMARY KEY (voyId);

-- Drop loze tabellen
DROP TABLE 	tempTableDASTimestamp,
			bgbdasVoyageMerge,
			bgbdasVoyageMergeRoute;
