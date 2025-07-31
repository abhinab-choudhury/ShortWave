# URL Shortener - System Design

### Features:
1. **Authentication (Auth):**
- OAuth (Google, GitHub) or email only.
- session-based Authentication.
2. **URL Shortening:**
- Convert long URLs into short, unique slugs (e.g., abc123).
- Fast redirection via key lookup.
3. **Analytics:**
- Track clicks, geolocation, device type, timestamp, etc.
- View stats per shortened URL.

Things which we need to consider is first and formost minimizing the redirecting latency and high avilibility. Lets assume total active user which we can support i.e 100 Millio Daily active users. So if we thing we will have arounf 1B reads per day which will case around 10 Thousand Requests per Seconds, so we need to do some advance stuff with our database. And the last part to consider is how may user are we goinging to accepts let is be around 5 Billion Users.

Backend Routes:
[POST, GET, PUT, DELETE] /api/auth : this will handle the auth state and logi for our user lets it be a session-based auth strategy with google and github OAuth why because this app if for browsers only and the backend and the frontend are closely tied together but as we are useing session based auth and we are assepeint about 10K Active user we will have to take special care of auth as the auth is session based and is the only single point of trust for the Authenticated user.

[POST] /api/url/create-shorturl: accepts a long URL which gets shortened.

[GET] /api/url/{shorturl}: we need to add analytics without comprimising on the speed and realibality of our service. which we will be a redirect [301, 302, 307, and 308] we will be using 302. to the orginal URL as is it a redirect this will cause cacheing which will cause the request to not to hit the backend, which will cause proples with the analytics side.

Why we will user 302 instead becase if we user 301 which is is feault redirect if we send 301 the browser will cache the request due to which the browser woll not calll the backend hence the analytics will not work.


We will be using a NoSQL DB why becauser it is fast why is a indetpth reason why??



Lets discuss about the shorturl logic we can user a base62, so what is base62?? we have a character set of [0-9][A-Z][a-z] which makesup to 62 chracters.

WE will make creaing an shortlink auto 6 characters to the total possible shortlinks we can support i.e 52 Billion => 62 x 62 x 62 x 62 x 62 x 62 = (62)^6

why we user base62 beacuse it is simple and human readable.

The database we design will have around 1kb for each record about 1 Trillion to 5 Trillion to date which is fine with database beacuse it is good enouught to handel i.e


How do we generate shorturl???
Counter approach -
Randomly/hashing i.e MD5, sha256 conflict not that scary chop lat 6-7 character is we have collision we retry to generate a new one.


Latency??
we index the short_url in our db becauser 10k RPS with be too much for a DB but we can scale them vertically, we can user read_replicaa we about multiread/write db but what if we use cacheing with redish which is better than read_only replica so we will have a a bigger thoughtput why not sharding what is overcommplicated in this sineario.

Analytics??
So every time when the user hits the shorturl we make a counter update or data updated realted to the anlaytics to the DB this is bad why?? we add a cache into the DB in the first place to reduce the read for in the databases. so if we user the write operation we will have a worst time then read so what we can do is user something like redish or a in-memeory cache solution which have a bigger thoughtput and thus  we will add a chrone job which will do the write in after every min into the DB.


to add click analytics date wise we can extend the click-model with a sub-document but they don't scale well beacuse MongoDB subdocuments can't be filtered efficiently by date.
```json
click_logs: [
  {
    date: {
      type: Date,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      default: 1,
    },
  },
],
```
