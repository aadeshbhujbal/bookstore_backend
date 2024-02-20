
# Book Rent Store System

Initial Story: Develop an API that receives a book name and returns the date when that book will be available.
The expected requirement is to built the backend service exposing the API required. You are expected to come up with the database schema and load the data from the csv into the database as a build step.

Scenario Question:
You are the developer of the Store system and the below stories are in your sprint. Develop the below features on top of your existing solution as per previous round. Each story will be a git commit so that we can verify the code per story. Please share the git repo link after you're done
 
Story 1: The Store wants to bring in a feature to calculate the rent charges per book. Per day rental charge is Rs 1 for all the books.
Create an API that will return the charges applicable when a customer returns his/her lended books. The charges should be only for the returned books only.

Story 2: The Store wants to change the charges on the books depending on the types of the book. There are 3 kinds : Regular, Fiction and Novel. Regular books renting per day charge is Rs. 1.5. For fiction book renting per day charge is Rs. 3. For novels the per day charge is Rs. 1.5.
Make sure to have a migration script that will update the type of the book according to the author. It is upto you to assign the type.

Story 3: The store decided to alter the calculations for Regular books and novels. Now for Regular books the first 2 days charges will be Rs 1 per day and 1.5 Rs there after. Minimum changes will be considered as Rs 2 if days rented is less than 2 days. Similarly for Novel minimum charges are introduced as 4.5 Rs if days rented is less than 3 days.





## Installation

Install booksystem  with npm

```bash
  npm install my-project
  cd my-project
```
    
#Script 
There are 2 Scripts in this file 
```bash
  1) CSV Data Loader To Load CSV Data From .csv file to Database (Mongodb)
  -- node csvDataloader.js

  2) Migration Script for changing Book Type :
  -- node migrationScript.js
```

## API Reference

#### Get all items

```http
  GET /api/books/
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `/` | `string` | this will load all your books |

#### Get item

```http
  GET /api/books/availability/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `availability`      | `string` | This Will Load All Books Which are available and can be rented |

#### Post item

```http
  Post /api/books/rent
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `rent`      | `string` | Input Book Data to See Output of story 3 |






## Screenshots
Story 1 Test Results
![Test Result 1](https://raw.githubusercontent.com/aadeshbhujbal/bookstore_backend/main/response_story1.png)

Story 2 Test Results 
![Test Result 2](https://raw.githubusercontent.com/aadeshbhujbal/bookstore_backend/main/response_story2.png)


![Test Result 2](https://raw.githubusercontent.com/aadeshbhujbal/bookstore_backend/main/response_story2.png)

![Test Result 2](https://raw.githubusercontent.com/aadeshbhujbal/bookstore_backend/main/response_story_2_1.png)

Story 3 Test Results 
![Test Result 3](https://raw.githubusercontent.com/aadeshbhujbal/bookstore_backend/main/response_story_3.png)

![Test Result 3](https://raw.githubusercontent.com/aadeshbhujbal/bookstore_backend/main/response_story_3_1.png)