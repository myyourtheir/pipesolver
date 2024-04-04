#!/bin/bash


if [[ "$1" == kill ]]; then
  sudo kill -9 $(sudo lsof -t -i:4040)
	sudo kill -9 $(sudo lsof -t -i:8000)
else
	cd nextjs/ 
	npm run dev &
	cd ../fastApi/
	uvicorn main:app --reload
fi




# sudo kill $(sudo lsof -t -i:4040)