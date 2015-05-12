-- Feed the routing-segments table to pgRouting

-- Create required columns
ALTER TABLE "routingMod" 
    ADD COLUMN source integer, 
    ADD COLUMN target integer,
    ADD COLUMN cost double precision, 
    ADD COLUMN rcost double precision;

-- Creation of the nodes from the linesegments
SELECT pgr_createTopology('routingMod', 0.000001, 'geom', 'gid');

-- Add costs to travel on routes
UPDATE "routingMod" SET 
    cost = ST_Length_Spheroid(geom,'SPHEROID["WGS84",6378137,298.257223563]'), 
    rcost = ST_Length_Spheroid(geom,'SPHEROID["WGS84",6378137,298.257223563]');

-- Set bidirectional routes, we probably have to change this everytime we update the map
UPDATE "routingMod" SET rcost = '-1'
WHERE gid = '129' OR gid = '151' OR gid = '121' OR gid = '123' OR gid = '157' OR gid = '154';