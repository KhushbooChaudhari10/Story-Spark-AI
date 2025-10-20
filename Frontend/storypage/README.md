# Story Spark AI - Frontend

This is the frontend for Story Spark AI, a Next.js application that dynamically generates story illustrations on a canvas based on a JSON file.

## Description

This project renders a story from a JSON data source. The `StoryPage` component uses the HTML5 Canvas API to draw illustrations described in the `story.json` file. This includes painting backgrounds and characters at specified coordinates.

The current story illustrates a brave fox in a forest.

## Getting Started

### Prerequisites

- Node.js and npm (or yarn/pnpm)

### Installation and Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Story-Spark-AI/Frontend/storypage
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

The application is structured as follows:

-   **`app/page.tsx`**: The main entry point of the application, which renders the `StoryPage` component.
-   **`components/StoryPage.tsx`**: The core component that contains the canvas logic. It reads the `story.json` file and iterates through the `illustrations` array to draw each element on the canvas.
-   **`data/story.json`**: A JSON file that defines the story content, including the title, text, and a list of illustrations to be rendered. Each illustration object specifies an `action` (e.g., `paint_background`, `paint_character`) and other properties needed for rendering.

## Technologies Used

-   [Next.js](https://nextjs.org/) - React framework
-   [React](https://reactjs.org/) - JavaScript library for building user interfaces
-   [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
-   [Tailwind CSS](https://tailwindcss.com/) - CSS framework
-   [HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - for 2D drawing