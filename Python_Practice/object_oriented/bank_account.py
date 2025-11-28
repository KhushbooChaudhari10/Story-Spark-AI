class Bank:
    """
    A class representing a simple bank account with basic operations
    such as debit, credit, and balance inquiry.

    Attributes
    ----------
    balance : float
        The current balance of the account.
    account_number : int
        The unique number identifying the bank account.
    """

    def __init__(self, balance, account_number):
        """
        Initialize a new Bank account.

        Parameters
        ----------
        balance : float
            The initial balance of the account.
        account_number : int
            The account number of the user.
        """
        self.balance = balance
        self.account_number = account_number

    def debit(self, amount):
        """
        Withdraw a specified amount from the account.

        Parameters
        ----------
        amount : float
            The amount to be withdrawn from the account.

        Notes
        -----
        This method decreases the account balance by the specified amount
        and prints the updated balance.
        """
        self.balance -= amount
        print(f"""{amount} debited from your account.
              Your current Balance: {self.get_balance()}""")

    def credit(self, amount):
        """
        Deposit a specified amount into the account.

        Parameters
        ----------
        amount : float
            The amount to be added to the account.

        Notes
        -----
        This method increases the account balance by the specified amount
        and prints the updated balance.
        """
        self.balance += amount
        print(f"""{amount} credited in your account.
              Your current Balance: {self.get_balance()}""")

    def get_balance(self):
        """
        Get the current account balance.

        Returns
        -------
        float
            The current balance of the account.
        """
        return self.balance


# Example Usage
User1 = Bank(20000, 43211)
User1.credit(5000)
User1.debit(2000)
