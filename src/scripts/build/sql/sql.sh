#!/bin/bash

echo "Import map"
shp2pgsql -c -D -s 4326 -I /Users/$USER/Desktop/HDAT/src/data/map/map.shp routing | psql bgb

echo "Create functions"
psql -d bgb -f functions/determineRoute.sql
psql -d bgb -f functions/findNearestNode.sql

echo "Import data"
psql -d bgb -f 0-importData.sql

psql -d bgb -c "COPY \"amhPlaces\" FROM '/Users/$USER/Desktop/HDAT/src/data/amh_location_mod.csv' DELIMITER ',' CSV;"

echo "1,2,3"
psql -d bgb -f 1-routing.sql
psql -d bgb -f 2-coordinates.sql
psql -d bgb -f 3-voyagesGeo.sql
psql -d bgb -f 4-voyagesTime.sql
