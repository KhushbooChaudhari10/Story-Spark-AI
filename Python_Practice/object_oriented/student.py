class Student:
    def __init__(self, name, maths, science, english):
        self.name = name
        self.maths = maths
        self.science = science
        self.english = english

    def avg(self):
        avg_marks = (self.maths + self.science + self.english) / 3
        return avg_marks
    

S1 = Student("khush", 60, 75, 80)
print(S1.name)
print(S1.avg())
