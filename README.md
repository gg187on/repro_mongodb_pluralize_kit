# THIS IS REPRO OF ISSUE WITH PLURALIZE OPTION IN MONGOOSE

Issue: https://github.com/Automattic/mongoose/issues/11656

to run your app, do `npm i` and then `npm run dev`, website will be avaiable on `http://localhost:3000`.

## Description of files that use mongoose code and are important to reproduce issue

`./src/lib/db/sondy.js` contains schema and model.

`./src/lib/db/init.js` contains init function, we call in `.then()` after `mongoose.connect` is done, in this file we don't create collection, but instead try to read it (even bofore collection was created)

`./src/hooks.js` contains pluralize and connection code. Hooks (like handle function) are executed at every request, and are imported at first request to website

`./src/routes/todos/index.js` contains code that use model `sondy` and put some data do database. This is page endpoint file, that is executed when you call `resolve(event)` inside `./src/hooks.js` if event properties point to URL `/todos`. So whole flow is:

## How to reproduce issue

1. from browser request come to `/todos` page
2. handle function in `./src/hooks.js` is executed (and as module works, if this is first time, import cause top scope code to be executed - like mongoose.connect())
3. in handle hook, we call `resolve(event)` and it forward request to `/todos` page and endpoint
4. `get()` function is executed in `./src/routes/todos/index.js` that contains import of model for mongoose, and use it.
5. In that moment `sondy` collection is created
6. Now turn off app and drop database `repro_mongodb_pluralize_kit_issue`
7. uncomment code in `.src/lib/db/init.js`
8. again open app and visit `/todos` page
9. In that moment `sondies` collection is created
10. Now as `sondies` exist, even code in endpoint (that saves data do collection) use `sondies`.

## What actuall issue is?

Pluralize doesn't work if we touch collection (reading) before it's created, in that case, mongoose somehow automatically generate collection with pluralized name even if pluralize option is set to null.
