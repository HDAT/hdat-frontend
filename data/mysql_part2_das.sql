CREATE TABLE tempTableDAS
SELECT 	voyId, 
		VoyNumber, 
		voyDeparture, 
		voyArrivalDate,
		voyDeparturePlace,
		voyArrivalPlace
FROM `voyage`;

select '✓ 1) Made a temporary DAS table' AS ' ';

-- Tijdenfix
-- Tijden worden hierbij uitelkaar getrokken
CREATE TABLE tempTableDASTimefix
SELECT 	voyId,
		voyNumber,
		SUBSTRING_INDEX(`voyDeparture`, '-', -1) AS `voyVertrekJaar`,
        SUBSTRING_INDEX(`voyDeparture`, '-', 1) AS `voyVertrekDag`,
        SUBSTRING_INDEX(`voyDeparture`, '-', 2) AS `voyVertrekTijdelijk`,
        SUBSTRING_INDEX(`voyArrivalDate`, '-', -1) AS `voyAankomstJaar`,
        SUBSTRING_INDEX(`voyArrivalDate`, '-', 1) AS `voyAankomstDag`,
        SUBSTRING_INDEX(`voyArrivalDate`, '-', 2) AS `voyAankomstTijdelijk`,
        voyDeparturePlace,
        voyArrivalPlace
FROM `voyage`;

select '✓ 2) Made a temporary table that seperates the timestamp using substrings' AS ' ';


-- Ook de maanden worden nu goedgezet
CREATE TABLE tempTableDASTimefixIncludeMonths
SELECT	*,
		SUBSTRING_INDEX(`voyVertrekTijdelijk`, '-', -1) AS `voyVertrekMaand`,
        SUBSTRING_INDEX(`voyAankomstTijdelijk`, '-', -1) AS `voyAankomstMaand`
FROM tempTableDASTimefix;

select '✓ 3) Made yet another table that fixes the timestamp (this one only does the months)' AS ' ';


-- Vervolgens samenvoeging verschillende tijden
CREATE TABLE tempTableDASTimestamp
SELECT	voyId, 
		VoyNumber,
		CONCAT(CONCAT_WS("-", `voyVertrekJaar`, `voyVertrekMaand`, `voyVertrekDag`),'T00:00:00Z') AS `voyDepartureDate`,
		CONCAT(CONCAT_WS("-", `voyAankomstJaar`, `voyAankomstMaand`, `voyAankomstDag`),'T00:00:00Z') AS `voyArrivalDate`,
		voyDeparturePlace,
		voyArrivalPlace
FROM `tempTableDASTimefixIncludeMonths`;

select '✓ 4) Made a table with concatenated timestamp' AS ' ';


-- Uniformering columnnamen
ALTER TABLE tempTableDASTimestamp
CHANGE VoyNumber voyDASNumber varchar(255),
CHANGE voyDeparturePlace PlaceOfDeparture varchar(255),
CHANGE voyArrivalPlace PlaceofArrival varchar(255);

select '✓ 5) Uniforming the different columns' AS ' ';

DROP TABLE	tempTableDASTimefixIncludeMonths,
			tempTableDASTimefix,
			tempTableDAS;
select '✓ 6) Deleted all the temporary tables. tempTableDASTimestamp is kept.' AS ' ';

