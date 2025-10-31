# Assement_module2
##
Open your terminal and make sure you have node js and npm installed.
This can be done by running:
    node -v

which should return some thing like: v24.11.0
if node is installed, and:
    npm -v

which should return something like: 11.6.1
if npm is installed.
Else download nodeJS from : (https://nodejs.org/en/download) and follow the setup.
###
go into directory 'client':
    cd ./client

install all dependencies:
    npm install

####
go into directory 'server':
    cd ./server

install all dependences:
    npm install

generate prisma client:
    npx generate prisma

#####
inside the directory:
./server/prisma
crate a file named .env
request the database URL from author
paste DATABASE_URL="URLfromAuthor" into the .env file
######
start client and server by running:
    npm run dev

in both the client and server directories separatly
You can now access the client via http://localhost:5173/
If you wish to interact with the backend directly go to: http://localhost:3000


If you wish to view the database if you can (from the server directory):
    npx prisma studio

To view the ERD by opening the ERD.PNG file located in client/src/assets/ERD.PNG