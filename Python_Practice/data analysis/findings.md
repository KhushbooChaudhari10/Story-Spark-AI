# Findings from Children's Book Data Analysis

This document summarizes the key findings from the analysis of the children's book dataset. The analysis involved data cleaning, exploratory data analysis, and topic modeling to uncover insights into the themes and characteristics of children's literature.

## 1. Data Cleaning and Preprocessing

The initial dataset required several cleaning and preprocessing steps to prepare it for analysis:

- **Column Renaming:** The columns 'Inerest_age' and 'Desc' were renamed to 'interest_age' and 'description' respectively for clarity and consistency.
- **Handling Missing Values:** Rows with missing values in the 'Author' column were removed to ensure data quality.
- **Age Range Standardization:** The 'interest_age' and 'Reading_age' columns, which contained varied formats (e.g., '10+', '10-12'), were standardized into a consistent range format (e.g., '10-12'). This allows for more straightforward age-based analysis.
- **Text Cleaning:** The 'description' column was cleaned by removing punctuation and numerical characters, and the text was converted to lowercase. This prepared the text for natural language processing.

## 2. Exploratory Data Analysis (EDA)

To understand the common character roles and archetypes in children's books, an analysis of the most frequent nouns in the book descriptions was conducted.

The bar chart below illustrates the frequency of the top 15 nouns, which represent the most common character roles and archetypes.

The most prominent nouns are:
- **life**
- **school**
- **story**
- **book**
- **time**

This suggests that many children's books revolve around school life, personal journeys, and the power of stories.

## 3. Topic Modeling with Non-negative Matrix Factorization (NMF)

To identify the underlying themes in the book descriptions, Term Frequency-Inverse Document Frequency (TF-IDF) and Non-negative Matrix Factorization (NMF) were used. This analysis revealed 8 distinct topics:

- **Theme 1: Life, Friendship, and Grief:** Keywords include 'year', 'feels', 'amy', 'ambers', 'life', 'roger', 'grief', 'bennett', 'fall', 'friend'.
- **Theme 2: School Life and Social Dynamics:** Keywords include 'people', 'strange', 'frank', 'school', 'bullied', 'fun', 'huge', 'nick', 'families', 'genre'.
- **Theme 3: Classic Literature (Frankenstein):** Keywords include 'frankenstein', 'human', 'dramatic', 'version', 'new', 'victor', 'creature', 'monster', 'monstrous', 'man'.
- **Theme 4: Historical Fiction (Mary Queen of Scots):** Keywords include 'mary', 'meg', 'queen', 'scots', 'jenny', 'court', 'historical', 'young', 'intrigue', 'french'.
- **Theme 5: Adventure and Exploration:** Keywords include 'london', 'cole', 'vividly', 'rory', 'away', 'play', 'shakespeare', 'new', 'series', 'east'.
- **Theme 6: Family and Personal Challenges:** Keywords include 'ro', 'time', 'charley', 'way', 'hawke', 'book', 'robyn', 'doesnt', 'mother', 'just'.
- **Theme 7: Fantasy and Sibling Relationships:** Keywords include 'father', 'dory', 'novel', 'zan', 'ben', 'oppel', 'bens', 'cassandra', 'sister', 'existence'.
- **Theme 8: Mystery and Suspense:** Keywords include 'caz', 'lake', 'feeling', 'frozen', 'district', 'spirit', 'local', 'end', 'landscape', 'grief'.

These themes provide a comprehensive overview of the genres and topics prevalent in the dataset, from contemporary stories about school and family to historical fiction and classic literature.
