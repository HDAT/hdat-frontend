psql -d bgb -c "copy (select to_json(route::json) from \"bgbVoyageRouteJSON\") to '/Users/$USER/Desktop/HDAT/src/data/json/voyages.json';"

awk '{filename = sprintf("/Users/'$USER'/Desktop/HDAT/src/data/json/split/voyage_%d.json", NR); print >filename; close(filename)}' /Users/$USER/Desktop/HDAT/src/data/json/voyages.json

# awk '{filename = sprintf("/Users/$USER/Desktop/HDAT/src/data/json/split/voyage_%d.json", NR); print >filename; close(filename)}' voyage.json
