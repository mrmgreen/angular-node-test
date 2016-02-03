# A little about the project
I've used jason web tokens and local storage to provide ongoing authentication for the user.

# Instructions
Please install mongodb locally and start the MongoDB service by entering the following in the terminal:

```
mongod
```

Then run the following gulp command in a separate terminal tab:

```
gulp metadata
```
This will add the usernames 'user', 'manager', 'admin', 'developer', 'tester', with the password 'password'.

All the backend is inside the app directory and the front end is inside the public directory.

You can change the database in the config.js file in the root of the project.

I ran out of time to add unit tests, make it ES6 with the Babel transpiler and concatinate the various files.

Thanks for your time,
Martin