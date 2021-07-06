# Thunberg | Backend

To start the project, just run `make build` then `make start`. If need to install any new library, make sure you run `Make Build` to create the most updated image. Below are the instructions:

``` Terminal Command
cd /backend
npm i <newLibrary>
cd .. 
make build
make start
```

## Makefile Commands

`build`: Build development server without running the server

`start`: Start development server at port `5000`

`stop`: Stop the running server