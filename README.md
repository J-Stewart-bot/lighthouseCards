# A Great Place to Waste Time!
=========

This is a web server for hosting various card games! (Currently supports Goofspiel, War and Speed). It uses a combination of HTML5, jQuery, AJAX and Socket.io to host and track multiple games for multiple users and record the results of those games. it also provides some statistics about games and players.

## Final Product



## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`


## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- Pg-native 3.x or above
- Body-parser 1.19.x or above
- Chalk 2.4.x or above
- Cookie-sessopn 1.3.x or above
- Dotenv 2.x or above
- Ejs 2.6.x or above
- Express 4.17.x or above
- Morgan 1.9.x or above
- Node-sass-middleware 0.11.x or above
- Socket.io 2.3.x or above
