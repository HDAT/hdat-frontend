



-- Functie

CREATE OR REPLACE FUNCTION insertPoints(route geometry,"voyArrTimeStamp" timestamp) RETURNS SETOF "allVoyagePoints" AS
$BODY$
DECLARE
   iterator float4 := 1; 

BEGIN
   WHILE iterator < 5
   LOOP
      iterator := iterator + 1;
      INSERT INTO "allVoyagePoints" ("route","voyArrTimeStamp") 
      VALUES (quote_literal($1), iterator/5),$2);
   END LOOP;
   RETURN;
END
$BODY$
LANGUAGE 'plpgsql' ;



SELECT *, insertPoints("route","voyArrTimeStamp")
FROM "allVoyagePoints";






CREATE OR REPLACE FUNCTION insertPoints(route geometry,"voyArrTimeStamp" timestamp) RETURNS void AS
$BODY$
DECLARE
   iterator float4 := 1; 

BEGIN
   WHILE iterator < 5
   LOOP
      iterator := iterator + 1;
      INSERT INTO "allVoyagePoints" ("route","voyArrTimeStamp") 
      VALUES (ST_Line_Interpolate_Point($1, iterator/5),$2);
   END LOOP;
   RETURN;
END
$BODY$
LANGUAGE 'plpgsql' ;


