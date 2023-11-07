# Converge Project Repository


## Installation
Make sure your `node` version >= 18 and you have `yarn` installed.

1. Install all packages in backend directory
```
cd backend
yarn
```

2. Run the backend
```
yarn run dev:watch
```

The above command copies all your frontend files into `backend/public`. Note that these files won't reflect changes if the changes are done in `frontend`.

The server runs `nodemon` which has a live monitoring on any changes in `backend` files. However, for any changes in `frontend` files, you will have to re-run the `dev:watch` command.

Please make sure you make your changes in `frontend` as the files in `backend/public` won't be reflected in your git history.

We might move the `frontend` directory to `backend/public` later on.

