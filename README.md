# demo1
this is the readme for the customer service functionality group.

here are the http calls and their formats

localhost and 127.0.0.1 are interchangeable
UserId of -1 is admin.
same user and admin can access sa

To create a ticket
http://localhost:3000/tickets/create
{
  "userId": "39",
  "subject": "demo test 1",
  "description": "This is a test for demo 1"
}

To reply to a ticket
http://127.0.0.1:3000/tickets/reply
{
    "ticketId": "10",
    "userId": "1",
    "message": "This is a reply"
}

To get a detailed list of a ticket
http://127.0.0.1:3000/tickets/details/10?userId=39
no body needed

To close a ticket
http://127.0.0.1:3000/tickets/close/8
{
    "userId": "-1"
}

To open a ticket
http://127.0.0.1:3000/tickets/open/8
{
    "userId": "-1"
}