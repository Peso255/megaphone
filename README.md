[logo]: https://d3vv6lp55qjaqc.cloudfront.net/items/1E0j240a1P3m2X210W1S/speaker%20(1).png

# megaphone
![megaphone][logo]

An intuitive, web-based SMS gateway. Leverages Twilio Programmable SMS.

Initially built during a hackathon by myself and the following fine people:
- Zufeng ([@ZufengW](https://github.com/ZufengW))
- Pierre ([@Doubledge](https://github.com/Doubledge))
- Armaan ([@OpticGenius](https://github.com/OpticGenius))
- Daniel ([@skydans](https://github.com/skydans))

## Requirements/Setup

- A Twilio project (trials are fine for testing purposes, since Twilio concatenates a trial notice to every sent message).
  - An SMS-capable Twilio number.
- MongoDB database and account with `create`, `find`, and `remove` access.
- nodemon (`npm install nodemon`)
- `npm install`

## Run
```
ACCOUNT_SID="[Twilio Account SID]" \
AUTH_TOKEN="[Twilio Auth Token]" \
PHONE_NUMBER="[Twilio Phone Number]" \
DB_URI="mongodb://[DB Username]:[DB Password]@[DB Address]" \
nodemon bin/www
```
