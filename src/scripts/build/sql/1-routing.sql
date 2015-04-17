-- Feed the routing-segments table to pgRouting

-- Create required columns
ALTER TABLE "routingMod" 
    ADD COLUMN source integer, 
    ADD COLUMN target integer,
    ADD COLUMN cost double precision, 
    ADD COLUMN rcost double precision,
    ADD PRIMARY KEY (gid);


-- Creation of the nodes from the linesegments
SELECT pgr_createTopology('routingMod', 0.000001, 'geom', 'gid');

-- Add costs to travel on routes
UPDATE "routingMod" SET 
    cost = ST_Length_Spheroid(geom,'SPHEROID["WGS84",6378137,298.257223563]'), 
    rcost = ST_Length_Spheroid(geom,'SPHEROID["WGS84",6378137,298.257223563]');

DELETE FROM "routingMod"
WHERE gid = 43;

DELETE FROM "routingMod"
WHERE gid = 44;