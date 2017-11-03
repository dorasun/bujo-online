# Online Bullet Journal 

## Overview

Bullet journals (bujo) have recently become a popular phenomenon, a way to get organized but also to express yourself. People use them as sketch books, diaries, to-do lists, and more. A quick search for bujo on Instagram reveals how diverse and widespread they have become. You can read more about bullet journals here: bulletjournal.com

For those of us who are not naturally organized, it may be difficult to adjust and update a bujo on the daily. By making a digital version, users can be reminded to use their journals with the added convenience of being having a virtual journal: no need to buy or maintain a physical journal, integration with other useful tools like Google Calendar, and daily notifications to keep you accountable.

## Data Model

This application will store Users and their Years, which will in turn contain Months, Weeks, and Days: 

* users can have multiple years (via references)
* each date-related object can have multiple items (by embedding)

An Example User:

```javascript
{
  username: "billjoebujo",
  hash: // a password hash,
  years: // an array of references to Year documents
}
```

An Example Year with Embedded Items:

```javascript
{
  user: // a reference to a User object
  year: 2017,
  items: [
    tasks: [
        {content: "Plan vacation for summer", migrated: true, scheduled: false, completed: false}
        {content: "Visit Ashley", migrated: false, scheduled: true, completed: true}
    ],
    events: [
        "5th anniversary"
    ], 
    notes: [
        "Noticed more beetles this year in the garden"
    ],
  ],
  months: // an array of references to Month documents
}
```
Months, Weeks, and Days are structured just like Year, except Months contain Weeks, Weeks contain Days, and Days do not contain any other date structure

## [Link to Commented First Draft Schema](./src/db.js) 

This is a first draft, it may need some reworking or editing.

## Wireframes

/ - page for navigation

![index view](documentation/index.png)

/year - page for showing a year view

![year view](documentation/year.png)

/year/month - page for showing a month view

![month view](documentation/year-month.png)

/year/month/week - page for showing a week view

![day view](documentation/year-month-day.png)

## Site map

![site map](documentation/site_map.jpg)

## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can view my notes for the year, month, week, or day
4. as a user, I can view my past notes
5. as a user, I can add notes to the year, month, week, or day
6. as a user, I can modify my notes to the year, month, week, or day

## Research Topics

* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
* (3 points) Use a CSS framework throughout my site
    * I'm going to create several Bootstrap themes and allow users to choose their own

8 points total out of 8 required points
I may change this in the future; I'm still fleshing out the details

## [Link to Initial Main Project File](app.js) 

Created a skeleton Express application with a package.json, app.js, views folder

## Annotations / References Used

* [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
