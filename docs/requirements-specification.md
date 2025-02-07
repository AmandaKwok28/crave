# Software Requirement Specification

## Problem Statement

Cooking feasible and nutritious meals in college is difficult—students have varying levels of budgets, resources, experience, and time. Existing recipe finders don’t holistically account for all relevant issues a student may face when trying to cook within their localized context. Furthermore, students may not know or have all the right ingredients near campus for the meals they want to make. 


## Proposed Solution

We propose HopCrave, a recipe crowdsourcing site where Hopkins students can upload, comment, and rate their own recipes. HopCrave is meant to facilitate localized and relevant communication with regards to food—students can rely on their peers’ experiences to quickly find the recipes that fit within their needs and preferences. Our emphasis on crowdsourcing means ingredients and resources are localized to the Baltimore community rather than generalized to the average consumer context. Thus, Hopkins’ students who may not have much experience with cooking or don’t know where to get ingredients can have a more relevant starting point than Google or other recipe aggregators.

After logging in with their Hopkins credentials, students will be able to upload and tag their recipes by budget, cook time, difficulty, price, number of ingredients, source of ingredients (grocery store, dining hall, CharMar, etc.), cuisine, and more. Further, students can like recipes and sort by popularity based on likes. Recipes can be bookmarked for later on a user’s profile. Students will be able to comment on recipes to provide support or additional information. Overall, HopCrave aims to liven the social and cultural strengths of the Hopkins community.


## Potential Clients

Hopkins Students (nice to have: Hopkins affiliates and staff)


## Functional Requirements

- Must haves:
    - As a JHU student, I want to register and log in using my Hopkins credentials to only access recipes within my college’s community context.
    - As a JHU student, I want to browse existing recipes in order to find things to cook that I like.
    - As a JHU student, I want to create and share my recipes so that other students can find them.
    - As a JHU student, I want to be able to delete my recipes in case somethings wrong with what I posted (typo, out-of-date, etc.)
    - As a JHU student, I want to have my own profile that displays all my recipes so I can refer back to my own recipes when I want to use them again.
    - As a JHU student, I want to be able to like recipes so that I can show appreciation for the recipe.
    - As a JHU student, I want to be able to bookmark recipes so that I can view them at a later time.
    - As a JHU student, I want to be able to view my likes and bookmarks so that I can see recipes that I enjoyed cooking and want to cook respectively.
    - As a JHU student, I want to search for recipes using keywords, so that I can easily find a specific recipe that relates to what I want to cook.
    - As a JHU student, I want to filter recipes by specific categories so that I can only see recipes that are relevant to the resources I have available to me.
    - As a JHU student, I want to to be able comment on recipes so that I can gain an overall impression of others’ experience and recommendations for these recipes.
- Nice to haves:
    - As a JHU student, I want to see automatically generated tags for common allergies so that I can avoid harming myself or others.
    - As a JHU student, I want to be able to mark my unfinished recipes as drafts before posting them so that I can save any unfinished ideas I might have.
    - As a JHU student, I want to be able to sort by prices per serving so that I can assess whether a recipe is worth the money.
    - As a JHU student, I want to be able to see trending recipes so that I can narrow my search to recipes that other students approve of.
    - As a JHU student, I want to be able to sort recipes by date so I can see recently added recipes more easily.
    - As a JHU student, I want to be able to see the calories associated with each recipe so that I can track my calorie intake.


## Software Architecture & Technology Stack

Frontend

- React + Vite
- Chakra UI

Backend:

- Express.js

Database

- PostgreSQL
- Prisma ORM

Server

- Node.js


## Similar Existing Apps

Big oven — mobile app only, more general scope, college kids not their target audience

using google to find recipes

America’s Test Kitchen Recipes - https://www.americastestkitchen.com/recipes

Allrecipes — https://www.allrecipes.com/
