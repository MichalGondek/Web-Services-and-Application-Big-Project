from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)
DATABASE = 'expenses.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            expense_data TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/add_expenses', methods=['GET'])
def add_expenses():
    conn = get_db_connection()
    expenses = conn.execute('SELECT * FROM expenses ORDER BY expense_data DESC, id DESC').fetchall()
    conn.close()
    expense_list = [dict(expense) for expense in expenses]
    return jsonify(expense_list)

@app.route('/api/expenses/<int:expense_id>', methods=['GET'])
def get_expense(expense_id):
    conn = get_db_connection()
    expense = conn.execute('SELECT * FROM expenses WHERE id = ?', (expense_id,)).fetchone()
    conn.close()

    expense_list = [dict(expense) for expense in expenses]
    return jsonify(expense_list)

@app.route('/api/expenses/<int:expense_id>', methods=['GET'])
def get_expense(expense_id):
    conn = get_db_connection()
    expense = conn.execute('Select * FROM expenses WHERE id = ?', (expense_id,)).fetchone()
    conn.close()

    if expense is None:
        return jsonify({'error': 'Expense not found'}), 404
    
    return jsonify(dict(expense))

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    title = data.get('title','').strip()
    amount = data.get('amount')
    category = data.get('category','').strip()
    expense_data = data.get('expense_data','').strip()

    if not title or amount is None or not category or not expense_data:
        return jsonify({'error': ' All fields are required'}), 400  
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO expenses (title, amount, category, expense_data) VALUES (?, ?, ?, ?)',
                   (title, amount, category, expense_data))
    conn.commit()

    new_id = cursor.lastrowid
    conn.close()

    return jsonify({'message': 'Expense added successfully', 
                    'id': new_id}), 201

@app.route('/api/expenses/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    data = request.get_json()

    title = data.get('title','').strip()
    amount = data.get('amount')
    category = data.get('category','').strip()
    expense_data = data.get('expense_data','').strip()

    if not title or amount is None or not category or not expense_data:
        return jsonify({'error': 'All fields are required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE Expenses
        SET title = ?, amount = ?, category = ?, expense_data = ?
        WHERE id = ?
    ''', (title, amount, category, expense_data, expense_id))
    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Expense not found'}), 404
    
    conn.close()
    return jsonify({'message': 'Expense deleted successfully'})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
            
