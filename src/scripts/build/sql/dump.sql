DROP TABLE IF EXISTS "lotOfPoints";

CREATE TABLE "lotOfPoints" (
	"id" SERIAL PRIMARY KEY,
	"points" geometry(POINT,4326)
);

-- SELECT edge_id, (dp).path[1] As index, ST_AsText((dp).geom) As wktnode
-- FROM (

-- 	SELECT 1 As edge_id, "segmentisedRouteDump" AS dp FROM "allVoyagePoints"

-- 	)

-- As foo;

SELECT 1,
	"id" AS dp
FROM "allVoyagePoints";