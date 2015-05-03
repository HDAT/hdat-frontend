psql -d bgb -c "copy (SELECT array_to_json(array_agg(route::json)) from \"bgbVoyageRouteJSON\") to '/Users/$USER/Desktop/HDAT/src/data/json/voyages.json';"

# awk '{filename = sprintf("/Users/'$USER'/Desktop/HDAT/src/data/json/split/voyage_%d.json", NR); print >filename; close(filename)}' /Users/$USER/Desktop/HDAT/src/data/json/voyages.json

# awk '{filename = sprintf("/Users/$USER/Desktop/HDAT/src/data/json/split/voyage_%d.json", NR); print >filename; close(filename)}' voyage.json
