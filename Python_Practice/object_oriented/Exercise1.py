class storycharacter:
    #Class Attribute
    story_type = "Childhood_Story"

    #Constructor
    def __init__(self, name, description, is_hero):
        print(f"Information About Story character {name}")
        #Instance Attributes
        self.name = name
        self.description = description
        self.is_hero = is_hero

    def show_details(self):
        print(f"Name: {self.name}")
        print(f"Description: {self.description}")
        print(f"Hero Status: {'Hero' if self.is_hero else 'Villain'}")
        print(f"Story Type: {self.story_type}")




#Creating Objects
Story1 = storycharacter("Cindrella", "Poor Girl Life change", True)
Story2 = storycharacter("Rabbit", "Over Confidence", False)

Story1.show_details()
Story2.show_details()



