psql -d bgb -c "copy (SELECT row_to_json(t) FROM (select * from \"bgbVoyageRouteJSON\") t) to '/Users/$USER/Desktop/HDAT/src/data/json/voyages.json';"

awk '{filename = sprintf("/Users/'$USER'/Desktop/HDAT/src/data/json/split/voyage_%d.json", NR); print >filename; close(filename)}' /Users/$USER/Desktop/HDAT/src/data/json/voyages.json

# awk '{filename = sprintf("/Users/$USER/Desktop/HDAT/src/data/json/split/voyage_%d.json", NR); print >filename; close(filename)}' voyage.json
