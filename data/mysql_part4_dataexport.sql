SELECT * INTO OUTFILE '/Users/erik/Desktop/hdat/data/mysqlexport.csv'
    FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
FROM bgbdasVoyageMergeRouteId;
