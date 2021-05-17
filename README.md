# 🍊 habitat

A simple browser app for tracking habits! ✨

<img src="https://i.imgur.com/tkZGkq0.png" alt="habitat home screen" style="display: inline-block; width: calc(50% - 10px); margin-right: 10px;" />
<img src="https://i.imgur.com/7HVKy2c.png" alt="habitat dashboard" style="display: inline-block; width: calc(50% - 10px);" />


Built with:
- [Next.js](https://nextjs.org/)
- GraphQL using [Apollo Server](https://github.com/apollographql/apollo-server)
- [Prisma](http://prisma.io/) ORM for Postgres
- [Chart.js](https://www.chartjs.org/)
- [next-iron-session](https://github.com/vvo/next-iron-session) for authorization

## how to use

Habitat is live at [https://habi.vercel.app/](https://habi.vercel.app/?demo)! Registration is currently closed as I don't want to inadvertently become responsible for a bunch of strangers' habit data, but you can use the username **demo** and password **habitat** to log in with a special account I set up for people interested in demoing the app.

If you like Habitat and you actually want to use it, feel free to [contact me](mailto:contact@ngw.dev).

## overview

### general functionality

<img src="https://i.imgur.com/ju4CzVM.png" style="float: right; width: 20%; margin: 0 0 20px 20px;" />
<img src="https://i.imgur.com/6hPbfd9.png" style="float: right; width: 20%; margin: 0 0 20px 20px;" />

- Authenticate users using `next-iron-session`, which creates a signed and encrypted cookie to store session data

- Create/read/update/delete habit data
  * Display habit data for a given calendar period (month and year) on either a timeline, calendar, or line graph
  * Add, edit, or delete habit data for a given day
- Create/read/update/delete habits
  * Display habits either as a list or on a grid
  * Configure habit display information: name, label, icon, and color
  * Configure habit type: complex/scalar ("I practiced music for this many hours today") vs. simple ("I practiced music today"/"I didn't practice music today"), active vs. inactive/retired (retired habits will no longer show up when creating/editing records, but existing data for those habits will be preserved)
- Allow users logged on to the [demo account](#how-to-use) to generate a set of sample habits and at least a month's worth of randomized habit data to play around with. I have this set up so that any data (sample or otherwise) created by a demo user is bound to a unique string or `demoTokenId` stored in that user's browser session, so that multiple users can be logged on to the same demo account simultaneously without interfering with anyone else's experience of the app.
- Allow users to set preferences for how the app should behave
  * Set a default view type for habit data (timeline, calendar, or line graph) and for habits (list or grid)
  * Toggle view options for the clock in the top right corner of the app: display or hide clock, 12- or 24-hour clock, show or hide clock seconds
- Edit account details (name, email address, and password)

### api breakdown

- Apollo Server for GraphQL (in [/pages/api/server](/pages/api/server))
  * [index.js](/pages/api/server/index.js): Creates an instance of `ApolloServer`
  * [schemas/index.js](/pages/api/server/schemas/index.js): Defines my GraphQL schema
  * [resolvers/index.js](/pages/api/server/resolvers/index.js): Defines my resolvers, which tell Apollo Server how to fetch data for each type defined in the schema
- Prisma ORM for Postgres
  * [/prisma/schema.prisma](/prisma/schema.prisma): Prisma schema file, the main configuration file for my Prisma setup
  * [/lib/prisma.js](/lib/prisma.js): Creates an instance of `PrismaClient`, which is used by my [resolvers](/pages/api/server/resolvers/index.js) to send database queries

- All non-auth-related API routes are restricted to one file, [/pages/api/index.js](/pages/api/index.js), whose exports are objects that correspond to resource types - User, Habit, and Entry. Each of these objects comes with a set of CRUD functions that use the `handleQuery` fetch wrapper (see [/pages/api/handleRequest.js](/pages/api/handleRequest.js)) to call the GraphQL server with a pre-defined mutation/query string and optional query variables.

- Auth-related API logic is located inside the [/pages/api/auth](/pages/api/auth) directory:
  - [index.js](/pages/api/auth/index.js): Checks if there is user data stored in session. The data returned from this function, fetched at request time via `getServerSideProps`, is used on all protected pages to redirect to the login page if no valid session is found.
  - [getSession.js](/pages/api/auth/getSession.js): Gets the session data. The only time this is used is when retrieving the `demoTokenId` unique to each demo account session (this is explained in more detail above, under [general functionality](#general-functionality)).
  - [login.js](/pages/api/auth/login.js): Uses `next-iron-session` to create a signed and encrypted cookie to store session data
  - [logout.js](/pages/api/auth/logout.js): Destroys the session

## notes to self

### todo

- [x] add delete account feature
- [x] password recovery!
- [x] cuter 404 page
- [x] add option to rearrange habits!
- [x] rearrange habits needs to work on mobile
- [x] when rearranging habits create a little clone to drag around or at least the habit icon + name, especially needed on mobile
- [x] add screenshots to readme
- [x] figure out situation with dash panel calendar, are you doing that or not
- [ ] dash panel idea - 'help'/tutorial section for dashboard and habit pages, togglable in settings
- [x] fix habit graph when only tracking simple habits, something weird is happening
- [x] graph should adjust when page resizes but make it performant
- [x] better explanation of demo data for demo visitors
- [x] demo settings should follow the same pattern as habits, entries, and records
- [x] popup when visiting homepage with /?demo like with pianopet portfolio link
- [x] clear demo data on logout
- [x] like 1 hour cookie for demo sessions but since that looks surprisingly difficult to implement using next iron session, if demo && cookie is older than 1hour (or whatever), then log out
- [x] cuter "wipe demo account" message, maybe a corner button?
- [x] add explanation of demo stuff to readme
- [x] let users configure "create new habit" emoji in settings (currently 🐛)
- [x] prevent duplicate entries (more than one for a given date)
- [x] better unhandledFormError message
- [x] instead of just blocking duplicate entries, warn and ask permission to overwrite
- [x] clock date should change at midnight exactly
- [x] if cookie is invalid user, log out
- [x] emoji picker for habit icons ([use this maybe?](https://github.com/iamcal/emoji-data))
- [x] instructions for label template for complex habits + regex validation error if no handlebars are found in string
- [ ] figure out switching from simple -> complex habits - should maybe prompt the user for an amount to put in for entries that record that habit as completed
- [x] figure out better system for demo habits/data - unlikely scenario but what if someone logs into the demo account when someone else is already in there, don't want their data to suddenly get deleted - maybe demo flag should be a unique string for each session/logged in user, rather than a bool, and instead of getting cleared on login, they're deleted after 24 hours? bummer that prisma doesn't let you add a ttl index though