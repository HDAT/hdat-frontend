echo ""
echo ""
echo "Running Details: SQL 1 Color Coding"
echo ""
echo ""

psql -d bgb -f details/1-colorCoding.sql

echo ""
echo ""
echo "Running Details: SQL 2 Minard"
echo ""
echo ""
psql -d bgb -f details/2-minard.sql

echo ""
echo ""
echo "Running Details: SQL 3 Places"
echo ""
echo ""
psql -d bgb -f details/3-places.sql

echo ""
echo ""
echo "Export Minard JSON"
echo ""
echo ""
psql -d bgb -c "copy (select json from \"bgbCargoMinardJSONExport\") to '/Users/$USER/Desktop/HDAT/src/data/json/minard.json';"

echo ""
echo ""
echo "Export Places"
echo ""
echo ""
psql -d bgb -c "copy (SELECT concat('{ \"type\": \"FeatureCollection\", \"features\":', array_to_json(array_agg(json)), NULL, '}') FROM \"bgbPlaceGeoJSON\") to '/Users/$USER/Desktop/HDAT/src/data/json/places.json';"

