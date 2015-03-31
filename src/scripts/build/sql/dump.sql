DROP TABLE IF EXISTS "lotOfPoints";

CREATE TABLE "lotOfPoints" (
	"id" SERIAL PRIMARY KEY,
	"points" geometry(POINT,4326)
);

SELECT edge_id, (dp).path[1] As index, ST_AsText((dp).geom) As wktnode
FROM (

	SELECT 1 As edge_id, ST_DumpPoints("segmentisedRoute") AS dp

    UNION ALL
    
    SELECT 2 As edge_id, ST_DumpPoints(ST_GeomFromText('LINESTRING(3 5, 5 6, 9 10)')) AS dp
   
   )

As foo;