DROP FUNCTION findNearestNode(geometry);

CREATE OR REPLACE FUNCTION findNearestNode(
        geom geometry(geometry, 4326) 
    )
    RETURNS integer AS
$func$

DECLARE
    returnValue integer; 

BEGIN
    IF (geom IS NOT NULL) THEN
        SELECT id 
        INTO returnValue
        FROM "routingMod_vertices_pgr"
        ORDER BY CAST(
                ST_Distance(the_geom, geom) 
            AS integer)
        LIMIT 1;
    END IF;

    -- RAISE NOTICE 'the value is %', returnValue;
    
    RETURN returnValue;
END
$func$  LANGUAGE plpgsql;