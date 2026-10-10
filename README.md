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

Google Maps locations
---------------------
To save a Google Maps place, open the place in Google Maps, choose Share, copy its link, and paste the link into Gemezy. No Google Maps API key is required.

Location image uploads
----------------------
Optional location images are stored in Cloudinary. Configure these server-side environment variables:

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Keep the API secret server-side and never prefix it with NEXT_PUBLIC_.

Location sharing
----------------
Locations are private by default. Change an individual location to **Unlisted** to share it by a private link, or **Public** to include it in Explore. Public share pages expose only the location name, photos, and Google Maps link; notes, tags, and exact coordinates remain private. Unlisted pages are excluded from search indexing. Share links can be copied, sent through WhatsApp, or displayed as a locally generated QR code.


TODOS
------
- Improve Explore as it grows. Add search, sorting, and pagination rather than loading every public location at once.

- enhance the searching methodology

- add notifaction center to the navbar and red dot when new netofification is here
imagine your friend added a new location to thier list , it will pop up

- add the functionality of sending the location to my friends

- add friend page to the pages
