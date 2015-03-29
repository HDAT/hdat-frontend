select 'Still looking for a solution that includes headers' AS ' ';
select 'This might be one solution: https://snipt.net/tayhimself/mysql-csv-export-with-headers/' AS ' ';

SELECT * INTO OUTFILE '/Users/erik/Desktop/hdat/data/cargoexport.csv'
    FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
FROM tempCargoSumYear;
