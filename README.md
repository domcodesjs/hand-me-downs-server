# Hand Me Downs Server

[Link to Live Site](https://handmedowns-client.herokuapp.com/)

## Summary

Hand Me Downs is a ficticious marketplace where you can buy and sell used clothing. When a user creates an account they'll be able to buy and sell immediately. When your account is created you automatically get a shop setup at /shop/username where users can go to purchase items from you. When a user purchases an item(s) from you you'll see them under your orders. If you purchase an item(s) you'll see the purchase under your orders.

## Technologies

The backend of Hand Me Downs uses Node, Express and Postgres and is hosted on Heroku.

## API Endpoints

### Root Routes

- **/** Simple message that shows this is a server for hand me downs

### Auth Routes

- **@POST /auth/login** Signs a user into the app and send them a JWT.
- **@GET /auth/verifyJWT** Checks to see if a user is who they say they are VIA a token sent from the client.

### Categories Routes

- **@GET /categories** Gets all categories

### Listings Routes

- **@GET /listings** Gets all listings and if given any queries returns filtered listings.
- **@POST /listings** Created a new listing.
- **@DELETE /listings/:listingId** Deletes a listing.
- **@GET /listings/user/self** Gets all listings of a signed in user.
- **/listings/:listingId** Gets details of a single listing.
- **@GET /listings/app/latest** Gets the 4 most recent listings.
- **@GET /listings/shop/:username** Gets all listings of a specific user by username.
- **@GET /listings/check/:listingId** Checks if a listing ID is valid.
- **@PATCH /listings/:listingId** Updates a listing.
- **@GET /listings/user/update/:listingId** Gets a listing that is about to be updated.

### Orders Routes

- **@GET /orders** Gets all orders of an individual user
- **@GET /orders/:orderId** Gets details of a specific order
- **@POST /orders/:orderId/fulfill'** Fulfills an order marking it as shipped
- **@POST /orders/charge'** Charges an order through Stripe then splits the order up if purchasing multiple items from different shops and send each shop its own order and then one purchase is created for the user.

### Purchases Routes

- **@GET /purchases** Gets all purchases of an individual user.
- **@GET /purchases/:purchaseId** Gets details of a single purchase.

### Users Routes

- **@POST /users** Creates a user and sends a JWT token to the client to sign the user in right away.

## How to Video

[![How to use Hand Me Down](http://img.youtube.com/vi/OQu32o0MFpQ/0.jpg)](http://www.youtube.com/watch?v=OQu32o0MFpQ 'How to use Hand Me Down')

## Screenshots

![Screenshot](https://i.postimg.cc/XYjhVcgf/Screenshot-1.png)
![Screenshot](https://i.postimg.cc/j5wmpx4B/Screenshot-2.png)
![Screenshot](https://i.postimg.cc/3N26wt6B/Screenshot-3.png)
![Screenshot](https://i.postimg.cc/qv1Fghm9/Screenshot-4.png)
![Screenshot](https://i.postimg.cc/gch140JZ/Screenshot-5.png)
![Screenshot](https://i.postimg.cc/nctgWtjw/Screenshot-6.png)
![Screenshot](https://i.postimg.cc/kXFz3hWM/Screenshot-7.png)
![Screenshot](https://i.postimg.cc/zff9kSbz/Screenshot-8.png)
![Screenshot](https://i.postimg.cc/VNH2Zrnj/Screenshot-9.png)
![Screenshot](https://i.postimg.cc/ZRG2ZGfn/Screenshot-10.png)
