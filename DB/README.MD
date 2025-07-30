cd DB
docker compose up --build -d 

docker exec -it sql-db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Str0ng_Passw0rd!" -d InventoryDB   -Q "SELECT TOP 5 * FROM Productos"


