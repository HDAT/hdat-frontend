#!/bin/bash
USERNAME=root
PASSWORD=secret

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

green='\033[0;32m'
red='\033[0;31m'
purple='\033[0;35m'
NC='\033[0m' # No Color



## TO DO
## MySQL Koppeling GeoCoordinates cliwoc, mogelijk nieuwe tabel importeren met csv
## MySQL Mergen huidige tabellen met coordinaten

echo "${red}-----------------------------------------------------------------------------------${NC}"
echo "${red}1) If you are getting an authentication error please enter the following line:${NC}"
echo "${red}mysql_config_editor set --login-path=hdat --host=localhost --user=root --password${NC}"
echo "${red}Use the word 'secret' as a password${NC}"
echo "${red}2) Please give $DIR writing rights${NC}"
echo "${red}-----------------------------------------------------------------------------------${NC}"


echo "${green}===============================================${NC}"
echo "${green}=========1=DATABASE=SETUP======================${NC}"
echo "${green}===============================================${NC}"

# mysql_config_editor set --login-path=hdat --host=localhost --user=root --password
lunchy start mysql
lunchy start postgres
echo "Lunchy start mysql"
echo "Lunchy start postgres"

mysqladmin --login-path=hdat drop bgb
echo "${green}✓ Database dropped${NC}"

mysqladmin --login-path=hdat create bgb
echo "${green}✓ New fresh database made${NC}"

echo "${purple}Importing mysql dump, will take a few seconds${NC}"
mysql --login-path=hdat bgb < dump_bgb_20150303.sql
echo "${green}✓ Dump imported${NC}"

mysql --login-path=hdat -e "SHOW TABLES FROM BGB"

echo "${green}===============================================${NC}"
echo "${green}=========2=DATABASE=TRANSFORMATION=============${NC}"
echo "${green}===============================================${NC}"

echo "${purple}Starting Part 1: MySQL BGB${NC}"
echo "${purple}TO DO: Write a query that repairs the small, already existing, errors${NC}"
echo "${purple}TO DO: Check whether we are using the right timestamp${NC}"

mysql --login-path=hdat bgb < mysql_part1_bgb.sql
echo "${green}✓ Part 1 complete${NC}"
echo ""


echo "${purple}Starting Part 2: MySQL DAS${NC}"
mysql --login-path=hdat bgb < mysql_part2_das.sql
echo "${green}✓ Part 2 complete${NC}"
echo ""

echo "${purple}Starting Part 3: MySQL; The Merge${NC}"
echo "${purple}TO DO: Evaluate step 1, still have my doubts on this${NC}"

mysql --login-path=hdat bgb < mysql_part3_merge.sql
echo "${green}✓ Part 3 complete${NC}"
echo "${green}✓ Basic voyage transformation complete${NC}"
echo ""

mysql --login-path=hdat -e "SHOW TABLES FROM BGB"
echo ""

echo "${purple}Starting the Cliwoc Coordinate import${NC}"
mysql --login-path=hdat bgb < mysql_part3_cliwocimport.sql
echo "${green}✓ Cliwoc import complete${NC}"


echo
echo "${purple}The Choice~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~${NC}"
echo "${purple}Enter '1' if you you want to transform the data for cargo?${NC}"
echo "${purple}Enter '2' if you want to continue and export the voyages to Postgres. This will export the table to csv and import it in postgres.${NC}"
echo "Enter 1 or 2, or 0 for exit: "
read choice

case $choice in
     1)
	 echo "${purple}1) Transform cargo data~~~~~~~${NC}"
	 mysql --login-path=hdat bgb < mysql_part4_cargo.sql
	 echo
	 echo "Please make sure that the first line of $DIR/mysql_part4_cargoexport.sql has been changed to:"
	 echo "SELECT * INTO OUTFILE '$DIR/cargoexport.csv'"
	 echo "Also make sure that this directory has writing rights"
	 echo "Once done please press Y to continue"
	 read input
	 if [ $input == "Y" -o $input == "y" ]; then
	 echo "${purple}Cool, starting the export${NC}"
	 fi
	 echo "${purple}Deleting existing cargoexport.csv${NC}"
	 rm -rf $DIR/cargoexport.csv
	 echo "${green}✓ Cargoexport.csv deleted${NC}"

	 mysql --login-path=hdat bgb < mysql_part4_cargoexport.sql
	 echo "${green}✓ Export done > File can be found at $DIR/cargoexport.csv${NC}"
     ;;
     2)

	 echo "${purple}2) Exporting to Postgres: Two more things~~~~~~~${NC}"
	 echo "Please make sure that the first line of $DIR/mysql_part4_dataexport.sql has been changed to:"
	 echo "SELECT * INTO OUTFILE '$DIR/mysqlexport.csv'"
	 echo "Also make sure that this directory has writing rights"
	 echo "Once done please press Y to continue"
	 read input
	 if [ $input == "Y" -o $input == "y" ]; then
	 echo "${purple}Cool, starting the export${NC}"
	 fi
	 echo "${purple}Deleting existing mysqlexport.csv${NC}"
	 rm -rf $DIR/mysqlexport.csv
	 echo "${green}✓ Mysqlexport.csv deleted${NC}"

	 mysql --login-path=hdat bgb < mysql_part4_dataexport.sql
	 echo "${green}✓ Export done > File can be found at $DIR/mysqlexport.csv${NC}"
	 echo "${purple}Lets start the Postgres import!${NC}"
     ;;
     0)
     echo "Awww!"
     break
     ;;
     *)
     echo "That is not a valid choice, try a number from 0 to 2."
     ;;
esac




