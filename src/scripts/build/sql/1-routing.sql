-- Load in Dijkstra HDAT function

DROP FUNCTION IF EXISTS pgr_dijkstra_hdat(varchar, integer, integer);
CREATE OR REPLACE FUNCTION pgr_dijkstra_hdat(
        IN tbl varchar,
        IN source integer,
        IN target integer,
        OUT geom geometry
    )
    RETURNS SETOF geometry AS
$BODY$
DECLARE
    SQL     text;
    rec     record;
BEGIN
    SQL     := 'SELECT gid,geom FROM ' ||
                    'pgr_dijkstra(''SELECT gid as id, source::int, target::int, '
                                    || 'cost, rcost AS reverse_cost FROM '
                                    || quote_ident(tbl) || ''', '
                                    || quote_literal(source) || ', '
                                    || quote_literal(target) || ' , true, true), '
                            || quote_ident(tbl) || ' WHERE id2 = gid ORDER BY seq';

    FOR rec IN EXECUTE SQL
    LOOP
        -- seq     := seq + 1;
        -- gid     := rec.gid;
        geom    := rec.geom;
        RETURN NEXT;
    END LOOP;
    RETURN;
END;
$BODY$
LANGUAGE 'plpgsql' VOLATILE STRICT;

-- Create changed Routing table

DROP TABLE IF EXISTS "routingMod";
CREATE TABLE "routingMod" AS
  TABLE "routing";

-- Feed it to pgRouting

ALTER TABLE "routingMod" 
    ADD COLUMN source integer, 
    ADD COLUMN target integer;
SELECT pgr_createTopology('routingMod', 0.000001, 'geom', 'gid');

-- Add costs to travel on routes

ALTER TABLE "routingMod" 
    ADD COLUMN cost double precision, 
    ADD COLUMN rcost double precision;
UPDATE "routingMod" SET 
    cost = st_length(geom), 
    rcost = st_length(geom);

-- Create Nearestnode Function

DROP FUNCTION findNearestNode(double precision, double precision);
CREATE OR REPLACE FUNCTION findNearestNode(
        lat double precision, 
        long double precision
    )
    RETURNS integer AS
$func$

DECLARE
    returnValue    integer; 

BEGIN
    IF (lat IS NOT NULL OR long IS NOT NULL) THEN
        SELECT id 
        INTO returnValue
        FROM "routingMod_vertices_pgr"
        ORDER BY CAST(ST_Distance(the_geom, ST_SetSrid(ST_Makepoint(lat, long),4326)) AS integer)
        LIMIT 1;
    END IF;

    RAISE NOTICE 'the value is %', returnValue;
    
    RETURN returnValue;
END
$func$  LANGUAGE plpgsql;

-- KRIJG DE ROUTE
-- SELECT ST_Linemerge(ST_Union(pgr_dijkstra_hdat)) AS route
-- FROM pgr_dijkstra_hdat('routingMod',9,23);

