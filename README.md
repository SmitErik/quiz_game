# Quiz Game
A beüzemelés és az elindítás ugyanúgy működik, mint ahogyan gyakorlaton is csináltuk:

##### docker:
	docker build -t my_mongo_image .
	docker run -it -p 6000:27017 --name my_mongo_container my_mongo_image

##### client:
	npm install
	ng serve

##### server:
	npm install
	npm run build
	npm run start

Legelső indítás után, amikor már fut az adatbázis, akkor le kell futtatni a következő script-et az admin user létrehozásához:

	npm run create-admin