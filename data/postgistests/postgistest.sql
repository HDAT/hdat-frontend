-- psql -d template_postgis -f postgistest.sql

DROP TABLE IF EXISTS testlines;
CREATE TABLE testlines (
   ID INT PRIMARY KEY   NOT NULL,
   TimeOfDeparture      timestamp,
   TimeOfArrival        timestamp,
   PlaceOfArrival       CHAR(50),
   PlaceOfDeparture     CHAR(50),
   LatDep            float,
   LonDep            float,
   LatArr            float,
   LonArr            float
);

INSERT INTO testlines VALUES
    ('1', '11-01-1601 00:00:00', NULL, 'Amsterdam', 'Batavia', '52.370215700000000000', '4.895167899999933000', '-6.208763400000000000', '106.845598999999990000');

ALTER TABLE testlines ADD COLUMN DepCood geometry(POINT,4326);
UPDATE testlines SET DepCood = ST_SetSRID(ST_MakePoint(LonDep, LatDep),4326);

ALTER TABLE testlines ADD COLUMN ArrCood geometry(POINT,4326);
UPDATE testlines SET ArrCood = ST_SetSRID(ST_MakePoint(LonArr, LatArr),4326);

ALTER TABLE testlines ADD COLUMN lineline geometry(GEOMETRY,4326);
UPDATE testlines SET lineline = ST_SetSRID(ST_MakeLine(DepCood,ArrCood),4326);

-- Lengte van een lijn
-- SELECT ST_Length(
--    ST_Transform(
--       ST_GeomFromEWKT(lineline),
--       26986
--    )
-- )
-- FROM testlines;

-- Pak punt uit lijn
-- SELECT ST_AsEWKT(ST_Line_Interpolate_Point(lineline, 0.20))
--    FROM testlines As linelinetwnet;

-- http://postgis.net/docs/manual-1.5/ST_Line_Interpolate_Point.html

