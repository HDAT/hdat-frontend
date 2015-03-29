-- Tijdelijke oplossing: separeer rows zonder DAS ID
CREATE TABLE bgbVoyageReformatMinusDAS 
SELECT * 
FROM bgbVoyageReformat 
WHERE `voyDASNumber` IS NULL OR `voyDASNumber` = '';
select '✓ 1) Seperates rows without a DAS ID' AS ' ';

-- Merge DAS en BGB
CREATE TABLE bgbdasVoyageMerge
AS SELECT * FROM tempTableDASTimestamp
UNION SELECT * FROM bgbVoyageReformatMinusDAS;
select '✓ 2) Two tables are being merged' AS ' ';

ALTER TABLE bgbdasVoyageMerge
ADD PRIMARY KEY (voyId);
select '✓ 3) VoyId became the primary key' AS ' ';


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
select '✓ 4) Made a table that contains all the routes, just for information purposes' AS ' ';


-- Vervang strings met ids
CREATE TABLE bgbdasVoyageMergeRouteId
SELECT 	e.*,
		d.routeId
FROM bgbdasVoyageMergeRoute e 
INNER JOIN hdatRoutes d 
ON e.voyRoute = d.voyRoute;

ALTER TABLE bgbdasVoyageMergeRouteId
ADD PRIMARY KEY (voyId);
select '✓ 5) IDs just got replaced for strings' AS ' ';


-- Drop loze tabellen
DROP TABLE 	tempTableDASTimestamp,
			bgbdasVoyageMerge,
			bgbdasVoyageMergeRoute;
select '✓ 6) Deleted all the temporary tables. hdatRoutes, bgbdasVoyageRouteId, bgbVoyageReformat, bgbVoyageReformatMinusDAS are kept' AS ' ';
