


docker build -t transactionservice:dev .

docker run -d --name transactionservice -p 5152:5152 transactionservice:dev