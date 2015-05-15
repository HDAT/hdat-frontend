DROP FUNCTION genTimeArray(timestamp, geometry, integer);
CREATE OR REPLACE FUNCTION genTimeArray(
		IN voyDepTimeStamp timestamp,
        IN route geometry(geometry, 4326),
        IN speed integer,
        OUT times double precision
    )
    RETURNS SETOF double precision AS
$$

DECLARE
	iterator	integer 	:= 1;
	points 		integer		:= (ST_NPoints(ST_setSRID($2,4326))+1);
	time 		timestamp 	:= $1; 

BEGIN
	WHILE iterator < points
	LOOP
		-- We don't need to measure the distance for the first point
		-- Because we already have it's departure timestamp
		IF (iterator = 1) THEN
			RETURN QUERY
			-- Convert to unix timestamp
			SELECT  round(extract(epoch FROM ($1))) + 15768000000;
		ELSE
			RETURN QUERY
			SELECT 	15768000000 + round(extract(epoch FROM (time + interval '1h' * 
						((ST_Length_Spheroid(
							(ST_Makeline(
								-- Iterator minus one because it got +1 in the if-block
								ST_PointN(ST_setSRID($2,4326), iterator-1), 
								ST_PointN(ST_setSRID($2,4326), (iterator))))
						,'SPHEROID["WGS84",6378137,298.257223563]')/1000)/$3))));
			-- There might be a better solution for this, something like
			-- return the previous timestamp + new timestamp, but I couldn't really find it
			-- Now I think about it, it wouldn't work anyways because the unix timestamp
			-- has the data type double precision.
			time := time + interval '1h' * ((ST_Length_Spheroid(
						(ST_Makeline(
							ST_PointN(ST_setSRID($2,4326), iterator-1), 
							ST_PointN(ST_setSRID($2,4326), (iterator))))
					,'SPHEROID["WGS84",6378137,298.257223563]')/1000)/$3);
        END IF;
        iterator := iterator + 1;

    END LOOP;
    RETURN;

END;
$$  LANGUAGE plpgsql;