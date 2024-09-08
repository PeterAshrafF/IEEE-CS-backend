import sqlite3

#conn = sqlite3.connect(':memory:')
conn = sqlite3.connect('customer.db')

#Create a cursor
c = conn.cursor()

#Create a table

'''
c.execute("""CREATE TABLE customers (
          first_name text,
          last_name text,
          email text
    )""")
'''

#Create 3 records
'''
many_customers = [('awe','saa','asd@dsa.com'),
                  ('asd','zxv','as@dsa.com'),
                  ('jhy','sdfgaad','aafgd@dsa.com')
                ]

c.executemany("INSERT INTO customers VALUES (?,?,?)", many_customers)
'''


#c.execute("DROP TABLE customers")

c.execute("UPDATE customers SET first_name = 'ke' WHERE rowid = 3")

#c.execute("DELETE from customers WHERE rowid > 4")

c.execute("SELECT rowid, * FROM customers")

#c.fetchone()
#c.fetchmany(3)
items = c.fetchall()

for item in items:
    print(item)

# Commit a command
conn.commit()

# Close our connection
conn.close()
