## Description and Features

This **Nest.js project** is a fully functional backend template for a **news agency website**, designed to efficiently manage articles, users, and categories. The project is divided into three parts:

- **Admin Panel:** Admins can manage articles, users, and categories. They have the authority to publish articles and oversee content submitted by publishers.
  
- **Publisher Section:** Publishers can create articles, attach images, categorize them, and submit content for publication.

- **CMS (Content Management System):** Regular users can view and filter articles, explore categories, and see the most popular articles. The CMS offers features like searching for articles using **OpenSearch** and retrieving individual article details by ID.

The project integrates several technologies for efficiency. **OpenSearch** is used for powerful article search functionality in both the CMS article list and individual article pages. **Redis** enhances performance on the CMS side by caching relevant data, optimizing API performance. It also supports attaching images to articles via **S3** for storage.

The project uses **Docker** for streamlined setup and deployment. With the help of **Docker Compose**, we launch and manage containers for Redis, OpenSearch, and MariaDB. During the initial Docker Compose launch, the service automatically migrates database tables and seeds data for articles, users, and categories, making setup for development and testing easy.

### Features

:white_check_mark: Database support using [Sequelize](https://www.npmjs.com/package/sequelize).
:white_check_mark: Data seeding for easy setup.
:white_check_mark: Config service using [@nestjs/config](https://www.npmjs.com/package/@nestjs/config).
:white_check_mark: Sign-in and sign-up functionality via email.
:white_check_mark: Separate Swagger documentation for Admin, Publishers, and CMS sections.
:white_check_mark: Image uploads for articles via S3 using [nestjs-s3](https://www.npmjs.com/package/nestjs-s3).
:white_check_mark: Full E2E test coverage and partial unit tests.
:white_check_mark: Docker support for containerized deployment.
:white_check_mark: Redis caching using [redis](https://www.npmjs.com/package/redis) and [cache-manager-redis-store](https://www.npmjs.com/package/cache-manager-redis-store).
:white_check_mark: OpenSearch integration using [@opensearch-project/opensearch](https://www.npmjs.com/package/@opensearch-project/opensearch).

---

## Prerequisites:

- Docker
- Docker Compose

---

## Clone the Repository

```bash
git clone https://github.com/l1e/nest-js-news-template.git

cd nest-js-news-template
```

---

## Running the app :running:


### Fill in your Environment Variables (.env)

First, create a `.env` file. Copy the contents of the .`env.example` file (or from the bottom section) into your `.env` file and update variables according to your configuration.

```bash
# General environment settings
NODE_ENV=development
NEST_APP_PORT=3003
SECRET_KEY=sadsaAdsadsa12AsaV


# AWS S3 keys for image uploads (NEED TO BE CHANGED TO YOURS)
AWS_S3_ACCESS_KEY=AKIA43V4dsaAadAd3
AWS_S3_SECRET_ACCESS_KEY=7bgkXyr8q+awYz/AdgAfsMBxSL3ocyGwgQY199+cal
AWS_S3_ENDPOINT=https://s3.eu-central-1.amazonaws.com
AWS_S3_REGION=eu-central-1
AWS_S3_BUCKET=nest-js-news
AWS_S3_BUCKET_URL= https://s3.eu-central-1.amazonaws.com/nest-js-news-v0.1/


# MySQL database configuration
MYSQL_PORT=3306
MYSQL_HOST=mariadb
MYSQL_USERNAME=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=nest_js_news_template


# Redis configuration
REDIS_SERVER_NODE_URL=redis://redis
REDIS_PORT=6379


# Temporary folder for storing photos
TEMPORARY_FOLDER=./temporary


# OpenSearch configuration
OPENSERACH_NODE=https://localhost:9200
OPENSEARCH_INITIAL_ADMIN_USERNAME=admin
OPENSEARCH_INITIAL_ADMIN_PASSWORD=daavqaSAdwqwdq
OPENSEARCH_ARTICLE_INDEX_NAME=articles
```

---

### Then, run the following commands:

```bash

# Install project dependencies
$ npm install

# Start OpenSearch, Opensearch Dashboards, Redis, Redis-commander, phpMyAdmin, and MariaDB with database seeding
$ docker-compose up


```

---

### Running the Tests :factory:

```bash
# Run unit tests with file watching
npm run test:watch 

# Run E2E tests, which fully cover the template's functionality
npm run teste2e:watch


```


----


### APi's sections :airplane:

#### Admin 
http://localhost:3009/api/admin
![](/images/admin_1.png)
![](/images/admin_2.png)

#### Publisher 
http://localhost:3003/api/publisher
![](/images/publisher_1.png)
![](/images/publisher_2_3.png)

#### CMS 
http://localhost:3009/api/cms 
![](/images/cms_1.png)

----

## Contributing :question:

We welcome your feedback! Whether you want to suggest improvements, report a bug, or ask a question, feel free to do so here: [https://github.com/l1e/nest-js-news-template/issues](https://github.com/l1e/nest-js-news-template/issues)
