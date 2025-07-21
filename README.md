This repository consists of projects (I assume there will be multiple of them at
the end) I am making during my internship at [MAVA](https://www.mava.com.tr/).

## How to run a project

(I do not know the commands for Windows, this commands are meant for users on
Mac and Linux machines)

```bash
git clone git@github.com:srumut/internship_mava.git
cd internship_mava
cd user_and_product_management
npm i
npx prisma generate
npx prisma migrate reset
npm run start
```

Note: the command `npx prisma migrate reset` will want you to confirm the
operation, simply press **y** key

Then api will be available on port **3000** by default, this can be configured
in .env file.

Swagger UI will be available on route /swagger, by default
[localhost:3000/swagger](localhost:3000/swagger)

Most of the endpoints require authentication, in order to interact with them
you should login as admin. Project creates an admin record when it is started,
if there is none in the database. Default admin username and password can be
viewed or changed in the .env file.
