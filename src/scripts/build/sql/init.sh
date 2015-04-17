#!/bin/bash

echo "Delete table"
psql -d bgb -c "drop schema public cascade;"
psql -d bgb -c "create schema public;"

echo "Import bgb"
psql -d bgb -f /Users/$USER/Desktop/HDAT/src/data/bgb.psql

echo "1,2,3"
psql -d bgb -c "create extension postgis;"
psql -d bgb -c "create extension pgrouting;"
psql -d bgb -c "create extension postgis_topology;"
psql -d bgb -c "create extension fuzzystrmatch;"
psql -d bgb -c "create extension postgis_tiger_geocoder;"