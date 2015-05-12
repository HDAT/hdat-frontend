#!/bin/bash
echo ""
echo ""
echo "Importing route network"
echo ""
echo ""

psql -d bgb -c "drop table if exists routing;"
shp2pgsql -c -D -s 4326 -I /Users/$USER/Desktop/HDAT/src/data/map/mapmay.shp routing | psql bgb

echo ""
echo ""
echo "Creating functions"
echo ""
echo ""

psql -d bgb -f functions/determineRoute.sql
psql -d bgb -f functions/findNearestNode.sql
psql -d bgb -f functions/generateTimeArray.sql

echo ""
echo ""
echo "Importing data"
echo ""
echo ""

psql -d bgb -f 0-createTables.sql
psql -d bgb -c "COPY \"amhPlaces\" FROM '/Users/$USER/Desktop/HDAT/src/data/amh_location_mod.csv' DELIMITER ',' CSV;"

echo ""
echo ""
echo "Running SQL 1"
echo ""
echo ""

psql -d bgb -f 1-routing.sql

echo ""
echo ""
echo "Running SQL 2"
echo ""
echo ""
psql -d bgb -f 2-coordinates.sql

echo ""
echo ""
echo "Running SQL 3"
echo ""
echo ""

psql -d bgb -f 3-voyagesGeo.sql

echo ""
echo ""
echo "Running SQL 4"
echo ""
echo ""
psql -d bgb -f 4-voyagesTime.sql

echo ""
echo ""
echo "Running SQL 5"
echo ""
echo ""
psql -d bgb -f 5-exportJSON.sql