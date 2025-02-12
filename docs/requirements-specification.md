# Software Requirement Specification

## Problem Statement

Cooking feasible and nutritious meals in college is difficult—students have varying levels of budgets, resources, experience, and time. Existing recipe finders don’t holistically account for all relevant issues a student may face when trying to cook within their localized context. Furthermore, students may not know or have all the right ingredients near campus for the meals they want to make. 


## Proposed Solution

We propose [NAME TBD], a recipe crowdsourcing site where college students can upload, comment, and rate their own recipes. [NAME TBD] is meant to facilitate localized and relevant communication with regards to food—students can rely on their peers’ experiences to quickly find the recipes that fit within their needs and preferences. Our emphasis on crowdsourcing means ingredients and resources are localized to a college’s geographical community rather than generalized to the average consumer context. Thus, college students who may not have much experience with cooking or don’t know where to get ingredients can have a more relevant starting point than Google or other recipe aggregators.

After logging in and creating their comprehensive taste profile, students will be able to create, share, and tag their recipes by budget, cook time, difficulty, price, number of ingredients, source of ingredients (grocery store, dining hall, etc.), cuisine, and more. Further, students can like recipes and sort by popularity based on likes. Recipes can be bookmarked for later on a user’s profile. Students will be able to comment on recipes to provide support or additional information. Overall, [NAME TBD] aims to liven the social and cultural strengths of college communities.


## Potential Clients

College Students


## Functional Requirements

- Must haves:
    - As a college student, I want to register a profile using my .edu email and input my personal preferences to only access recipes catered to me within my college’s community context.
    - As a college student, I want to browse existing recipes in order to find things to cook that I like.
    - As a college student, I want to create, share, and delete my recipes so that other students can find them.
    - As a college student, I want to be able to like and bookmark recipes so that I can show appreciation for the recipe and view them later.
    - As a college student, I want to see automatically generated tags for common allergies so that I can avoid harming myself or others.
    - As a college student, I want to filter recipes by specific categories so that I can only see recipes that are relevant to the resources I have available to me.
    - As a college student, I want to search for recipes using keywords, so that I can easily find a specific recipe that relates to what I want to cook.
    - As a college student, I want to be able to mark my unfinished recipes as drafts before posting them so that I can save any unfinished ideas I might have.
    - As a college student, I want to have my own profile that displays all my created, liked, and bookmarked recipes so I can refer back to my own recipes when I want to use them again.
    - As a college student, I want to be able to see recommended recipes based on my account history on the site (likes, bookmarks, searches, etc.).
    - As a college student, I want to be able to sort recipes by date or trending (likes valued by time of like) so that I can narrow my search to recipes that other students approve of.
    - As a college student, I want to be able to follow different creators whose recipes I like, and only see their recipes on a specific feed.
    
- Nice to haves:
    - As a college student, I want to be able to be able to invite friends to collaboratively create meals through a unique link that recommends us recipes based on our combined ingredients, time, and ability.
    - As a college student, I want to be able to direct message my friends on the app so that I can send them both recipe cards and text.


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
