prisma commands
---------------
npx prisma migrate reset    --> delete data from db

npx prisma studio           --> open db in local host

npx prisma migrate dev      --> update & push the new model to the db ,it will ask you for the migration name also (update name)

npx prisma generate         --> to retrive the migrations to the codebase (very important after the migration)

npx inngest-cli@latest dev  --> install inngest

npm run inngest:dev         --> run inngest in local host

npm run all                 --> run all the processes in one terminal


----
remember to add error state
share my id with friends via whatsapp
share locations with others ( menu wil pop up when sharing the location with other)

add sharing locations with other (enter the user id to share the location with , or choose from friends)

make each and every new user have an id, and give the ability to have share button for sharing the id via whatsapp or using the airdrop which will pop up the user profile on the other device and show all the locations he saved

for account Id regex -> GEM@12345678
for location ID regex -> LOC@123456789