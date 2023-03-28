# Monopoly Machine

An application that helps us to do all the Monopoly financial interactions with no need to use the paper money or to buy the transactions machine. Wait.. actually, that's the transaction machine! :o

![image](https://img.shields.io/tokei/lines/github/richardqcarvalho/monopoly-machine)
![image](https://img.shields.io/badge/status-under%20development-yellow)
![image](https://img.shields.io/github/last-commit/richardqcarvalho/monopoly-machine)
![image](https://img.shields.io/website?down_color=red&down_message=down&up_color=green&up_message=up&url=https%3A%2F%2Fweb.monopolymachine.app)

## Summary

- [Main libs used](#main-libs-used)
- [Project goals](#project-goals)

## Main libs used

- Back
  - [Express]()
  - [Postgres]()
  - [TypeORM]()
- Front
  - [React](https://react.dev/)
  - [Framer Motion]()
  - [Axios]()
  - [Styled Components]()
- General
  - [Socket.io]()
  - [Wait-on](https://github.com/jeffbski/wait-on)
  - [Concurrently](https://github.com/open-cli-tools/concurrently)
  - [Prettier](https://prettier.io/)

## Project goals

- [x] Create a home page that allows the user to type a name and enter the game page with it
- [x] Create a game page that receives the name chosen and provides informations about the own user and the others and interactions about the game financial processes
- [x] Implement websocket to syncronize all the interactions
- [x] Create a leave button to allows user to leave the game and syncronize this info to all players
- [x] Create a transfer log that show to all players the transfers that has been doing
- [x] Allow banker player to pass his position to another player to leave the game
- [x] Dockerize the project to make possible to upload that to AWS
- [ ] Redesign game page to decrease the code amount and to unify banker and common player pages to just one
- [ ] Allow a player to create a room instead of just enter it (and perhaps provide him a link to send to someone to enter the room created by him)
