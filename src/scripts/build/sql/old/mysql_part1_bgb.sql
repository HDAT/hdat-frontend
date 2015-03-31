-- Nieuwe tijdelijke tabel, met geconcateneerde vertrek en aankomsttijd
CREATE TABLE tempTable
SELECT 	voyId, 
		VoyDASNumber,
		CONCAT(CONCAT_WS("-", `voyDepartureYear`, `voyDepartureMonth`, `voyDepartureDay`),'T00:00:00Z') AS `voyDepartureDate`,
		voyDeparturePlaceId, 
		voyDepartureRegioId,
		CONCAT(CONCAT_WS("-", `voyArrivalYear`, `voyArrivalMonth`, `voyArrivalDay`),'T00:00:00Z') AS `voyArrivalDate`,
		voyArrivalPlaceId,
		voyArrivalRegioId
FROM `bgbVoyage`;

-- Wrs niet de mooiste oplossing, maar anders werkt INNER JOIN niet
CREATE TABLE tempPlaceArrival LIKE bgbPlace;
INSERT INTO tempPlaceArrival SELECT * FROM bgbPlace;
ALTER TABLE tempPlaceArrival
CHANGE naam PlaceOfArrival varChar(255);

-- Tijdelijke tabel voor Places, omzetting ID's naar namen
CREATE TABLE tempTablePlace
SELECT 	e.voyId, 
		e.voyDASNumber, 
		e.voyDepartureDate, 
		e.voyArrivalDate,
		d.naam, 
		f.PlaceOfArrival 
FROM tempTable e 
INNER JOIN bgbPlace d 
ON e.voyDeparturePlaceId = d.id 
INNER JOIN tempPlaceArrival f 
ON e.voyArrivalPlaceId = f.id;

-- Pas columnnaam aan: naam > PlaceOfDeparture
ALTER TABLE tempTablePlace
CHANGE naam PlaceOfDeparture varChar(255);

-- Weer niet de mooiste oplossing, maar anders werkt INNER JOIN niet
CREATE TABLE tempRegioArrival LIKE bgbRegio;
INSERT INTO tempRegioArrival SELECT * FROM bgbRegio;
ALTER TABLE tempRegioArrival
CHANGE naam PlaceOfArrival varChar(255);

-- Tijdelijke tabel voor Regios, omzetting ID's naar namen
CREATE TABLE tempTableRegio
SELECT	e.voyId, 
		e.voyDASNumber, 
		e.voyDepartureDate, 
		e.voyArrivalDate,
		s.naam, 
		f.PlaceOfArrival 
FROM tempTable e 
INNER JOIN bgbRegio s
ON e.voyDepartureRegioId = s.id 
INNER JOIN tempRegioArrival f 
ON e.voyArrivalRegioId = f.id
WHERE `voyDeparturePlaceId` IS NULL OR `voyArrivalPlaceId` IS NULL;

-- Pas opnieuw columnnaam aan: naam > PlaceOfDeparture
ALTER TABLE tempTableRegio
CHANGE naam PlaceOfDeparture varChar(255);

-- Merge tijdelijke tables
CREATE TABLE bgbVoyageReformat
AS SELECT * FROM tempTablePlace
UNION SELECT * FROM tempTableRegio;

ALTER TABLE bgbVoyageReformat
ADD PRIMARY KEY (voyId);  

-- Drop alle tijdelijke tables
DROP TABLE 	tempTable,
			tempTableRegio,
			tempTablePlace,
			tempRegioArrival,
			tempPlaceArrival;
