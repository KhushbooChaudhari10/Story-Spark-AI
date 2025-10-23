class StoryCharacter:
    """
    A class representing a character in a story.

    Attributes
    ----------
    story_type : str
        A class-level attribute representing the type of story.
    name : str
        The name of the story character.
    description : str
        A short description of the character.
    is_hero : bool
        Indicates whether the character is a hero (True) or a villain (False).
    """

    # Class Attribute
    story_type = "Childhood_Story"

    def __init__(self, name, description, is_hero):
        """
        Initialize a new StoryCharacter instance.

        Parameters
        ----------
        name : str
            The name of the story character.
        description : str
            A brief description of the character.
        is_hero : bool
            True if the character is a hero, False if a villain.
        """
        print(f"Information About Story character {name}")
        self.name = name
        self.description = description
        self.is_hero = is_hero

    def show_details(self):
        """
        Display the details of the story character.

        Prints the character's name, description, hero/villain status,
        and the story type.
        """
        print(f"Name: {self.name}")
        print(f"Description: {self.description}")
        print(f"Hero Status: {'Hero' if self.is_hero else 'Villain'}")
        print(f"Story Type: {self.story_type}")


# Creating Objects
Story1 = StoryCharacter("Cindrella", "Poor Girl Life change", True)
Story2 = StoryCharacter("Rabbit", "Over Confidence", False)

Story1.show_details()
Story2.show_details()
