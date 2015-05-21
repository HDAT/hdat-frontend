echo ""
echo ""
echo "Running Details: SQL 1"
echo ""
echo ""

psql -d bgb -f details/1-colorCoding.sql

echo ""
echo ""
echo "Running Details: SQL 2"
echo ""
echo ""
psql -d bgb -f details/2-minard.sql

echo ""
echo ""
echo "Export Minard JSON"
echo ""
echo ""
psql -d bgb -c "copy (select json from \"bgbCargoMinardJSONExport\") to '/Users/$USER/Desktop/HDAT/src/data/json/minard.json';"
