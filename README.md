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

# Fontos!

Legelső indítás után, amikor már fut az adatbázis, akkor le kell futtatni a következő script-et a server-en belül az admin user és néhány kvíz létrehozásához:

	npm run init

### Megjegyzés \#1

Előfordulhat, hogy valamiért nem engedi egyből belépni az admin felhasználót. Ha jól néztem dob egy `user is serialized.` üzenetet, majd egyből két vagy három `user is deserialized.` üzenetet. De csak az admin-nál jön ez elő, és ez is véletlenszerű esetekben.

### Megjegyzés \#2

Az admin felületen rengeteg **warning**-ot dob, hogy ütközés van két vagy több komponens `selector`-jában. De ezeket a komponenseket nem én hoztam létre, hanem az Angular Material-lal jöttek. Nem tudom pontosan minek következtében jelentkeztek a figyelmeztetések, de szerintem hazudnék, ha azt mondanám, hogy kevés időt szántam a kijavításuk megpróbálkozásával... Mivel csak **warning**-ok, így végül, hosszas szenvedés után ráhagytam.

### Megjegyzés \#3

Esetenként, ha ultra-gyorsan kattint a felhasználó a bejelentkezésre, akkor valamiért nem menti el az app, hogy be lenne lépve a felhasználó, így nem tölti be az adatokat rendesen. Erre se tudtam rájönni, hogy mi miatt történhet. De egy gyors `f5` megoldja a problémát!