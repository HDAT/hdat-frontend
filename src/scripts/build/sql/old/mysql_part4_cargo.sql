-- FORMAT CARGO
CREATE TABLE tempCargo
SELECT 	d.carId, 
		f.naam,
		d.carValueGuldens,
		d.carValueLichtGuldens,
		e.voyBookingYear
FROM bgbCargo d
INNER JOIN bgbProduct f 
ON d.carProductId = f.id 
INNER JOIN bgbVoyage e 
ON d.carVoyageId = e.voyId;

-- Optellen van guldens en lichte guldens
CREATE TABLE tempCargoSumYear
SELECT
    voyBookingYear,
    naam,
    sum(carValueGuldens) as guldenstotaal,
    sum(carValueLichtGuldens) as lichttotaal
FROM tempCargo
GROUP BY voyBookingYear, naam 
ORDER BY naam, voyBookingYear;
-- Order by lijkt niet goed meer te werken, nog even checken