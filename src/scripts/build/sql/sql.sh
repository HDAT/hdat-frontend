#!/bin/bash

echo "Create functions"
psql -d bgb -f functions/determineRoute.sql
psql -d bgb -f functions/findNearestNode.sql

echo "Import data"

echo "1,2,3"
psql -d bgb -f 1-routing.sql
psql -d bgb -f 2-coordinates.sql
psql -d bgb -f 3-voyages.sql
