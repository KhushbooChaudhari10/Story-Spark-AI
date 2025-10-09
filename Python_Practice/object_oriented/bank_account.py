class bank:
    def __init__(self, balance, account_number):
        self.balance = balance
        self.account_number = account_number

    def debit(self, amount):
        self.balance -= amount
        print(f"""{amount} debited from your account.
              Your current Balance: {self.get_balance()}""")

    def credit(self, amount):
        self.balance += amount
        print(f"""{amount} credited in your account.
              Your current Balance: {self.get_balance()}""")

    def get_balance(self):
        return self.balance
   
        
User1 = bank(20000, 43211)
User1.credit(5000)
User1.debit(2000)



    