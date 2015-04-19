-- Generate timearray from! depature time AND arrival time. 
-- Were going to get cases where this is true by comparison with DAS
-- This function is more or less academically sound like this
-- The bad things happen in determineMissingDate (speed calulation things)

-- INPUT -> Depature time / Arrival time
-- OUTPUT -> Timearray (sting or array, but should fit the single field that the voyage offers it)

DROP FUNCTION genTimeArray(timestamp, geometry, integer);
CREATE OR REPLACE FUNCTION genTimeArray(
		IN voyDepTimeStamp timestamp,
        IN route geometry(geometry, 4326),
        IN speed integer,
        OUT times timestamp
    )
    RETURNS SETOF timestamp AS
$$

DECLARE
	iterator	integer 	:= 1;
	points 		integer		:= (ST_NPoints(ST_setSRID($2,4326))+1);
	time 		timestamp 	:= $1; 

BEGIN
	WHILE iterator < points
	LOOP	
		IF (iterator = 1) THEN
			RETURN QUERY
			SELECT  ($1);
		ELSE
			RETURN QUERY
			SELECT 	(time + interval '1h' * 
						((ST_Length_Spheroid(
							(ST_Makeline(
								ST_PointN(ST_setSRID($2,4326), iterator-1), 
								ST_PointN(ST_setSRID($2,4326), (iterator))))
						,'SPHEROID["WGS84",6378137,298.257223563]')/1000)/$3));
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