# Web-Services-and-Application-Big-Project
# Personal Expense Tracker
# Author: Michal Gondek

## Hosted Application
https://web-services-and-application-big-project.onrender.com

## Description
This project is a simple web appliction build using flask, SQLite, HTML, CSS, and Javascript.

It allows a user to perform CRUD operations on a database if expenses:
- Create a new expense
- Read/View all expenses
- Update an existing expense
- Delete an expense


This project was created for the Web Services and Applications assignment,

## Technologies Used
- Python
- Flask
- SQLite
- HTML
- CSS
- JavaScript

## Features
- Add expenses
- View expenses
- Edit expenses
- Delete expenses
- REST API with Flask
- Web interface connected to the API using fetch()

## Database
The application uses one SQLite table called 'expenses'.

Fields:
- id
- title
- amount
- category
- expense_data

## API Endpoints

### Get all expenses
'GET /api/expenses'

### Get one expense
'GET /api/expenses<id>'

### Add new expense
'POST / api/expenses'

### Update an expense
'PUT /api/expenses/<id>'

### Delete an expense
'DELETE / api/expenses/<id>'

# How to Run

1. Clone the repository
2. Open the project folder
3. Install Flask:

'''bash
pip install -r requirements.txt


