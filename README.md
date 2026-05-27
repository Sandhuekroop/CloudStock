# CloudStock – AWS Based Full Stack Inventory Management Dashboard

## Overview

**CloudStock** is a full-stack Inventory Management Dashboard application focused mainly on **AWS cloud deployment, networking, and infrastructure management**.
The project demonstrates how a scalable inventory management system can be built and deployed using modern frontend technologies, backend APIs, PostgreSQL database management, and multiple AWS cloud services.

The application allows users to:

* Manage products and inventory
* Track expenses
* Manage users
* View analytics dashboards
* Store and serve images using AWS S3
* Deploy a production-ready full stack application on AWS

---

# Tech Stack

## Frontend

* Next.js
* TypeScript
* Redux Toolkit
* RTK Query
* Tailwind CSS
* Material UI
* Recharts

## Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL

## AWS Services Used

* AWS VPC
* AWS EC2
* AWS RDS
* AWS Amplify
* AWS API Gateway
* AWS S3

---

# Features

* Inventory Management Dashboard
* Product Management
* Expense Tracking
* User Management
* Interactive Charts & Analytics
* Cloud Hosted Backend
* PostgreSQL Database Integration
* API Management using API Gateway
* Image Hosting with AWS S3
* Responsive Dashboard UI
* State Management using Redux Toolkit
* REST API Integration using RTK Query

---

# Project Architecture

## Frontend

The frontend is developed using **Next.js** and deployed on **AWS Amplify**.

### Frontend Technologies

* Next.js for routing and UI rendering
* Redux Toolkit for state management
* RTK Query for API communication
* Tailwind CSS for styling
* Material UI Data Grid for advanced tables
* Recharts for data visualization

---

## Backend

The backend is developed using **Node.js** and **Express.js**.

### Backend Technologies

* Express.js REST APIs
* Prisma ORM
* PostgreSQL Database
* PM2 Process Manager
* AWS EC2 Deployment

---

# AWS Infrastructure Setup

## 1. VPC Configuration

A custom VPC was created to isolate and manage the cloud environment securely.

### VPC Details

| Resource  | Value       |
| --------- | ----------- |
| VPC Name  | cl_oud      |
| IPv4 CIDR | 10.0.0.0/16 |

---

## 2. Subnet Configuration

### Public Subnet

| Setting           | Value         |
| ----------------- | ------------- |
| Name              | public_subnet |
| Availability Zone | ap-south-1a   |
| CIDR Block        | 10.0.1.0/24   |

### Private Subnet

| Setting           | Value          |
| ----------------- | -------------- |
| Name              | private_subnet |
| Availability Zone | ap-south-1b    |
| CIDR Block        | 10.0.2.0/24    |

### Additional Private Subnet

| Setting           | Value            |
| ----------------- | ---------------- |
| Name              | private_subnet_2 |
| Availability Zone | ap-south-1c      |
| CIDR Block        | 10.0.3.0/24      |

---

## 3. Internet Gateway

Created an Internet Gateway:

```bash id="x7k2s9"
vpc_internet_gateway
```

The gateway was attached to the VPC to provide internet access to the public subnet.

---

## 4. Route Tables

### Public Route Table

* Associated with `public_subnet`
* Added route:

```bash id="w3n5pt"
0.0.0.0/0 → Internet Gateway
```

### Private Route Table

* Associated with:

  * `private_subnet`
  * `private_subnet_2`

---

# EC2 Backend Deployment

## EC2 Configuration

| Setting         | Value                  |
| --------------- | ---------------------- |
| Instance Name   | ec2_cloudstock_backend |
| AMI             | Amazon Linux           |
| Security Groups | SSH, HTTP, HTTPS       |
| VPC             | cl_oud                 |
| Subnet          | public_subnet          |

---

## EC2 Setup Commands

```bash id="v4n2md"
sudo su -

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

. ~/.nvm/nvm.sh

nvm install node

sudo yum install libatomic -y

source ~/.bashrc

sudo yum update -y

sudo yum install git -y

git clone https://github.com/Sandhuekroop/CloudStock.git

cd CloudStock/server

npm install

echo "PORT=80" > .env

npm run dev
```

---

# PM2 Configuration

## Install PM2

```bash id="d8x4ls"
npm install pm2 -g
```

## ecosystem.config.js

```javascript id="m5v2tw"
module.exports = {
  apps: [
    {
      name: "inventory-management",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
```

## PM2 Commands

```bash id="k3r9vy"
pm2 start ecosystem.config.js

pm2 status

pm2 monit

pm2 delete all
```

## Enable PM2 Auto Restart

```bash id="f7h4zx"
sudo env PATH=$PATH:$(which node) $(which pm2) startup systemd -u $USER --hp $(eval echo ~$USER)
```

---

# AWS RDS Configuration

## Database Setup

| Setting             | Value                         |
| ------------------- | ----------------------------- |
| Engine              | PostgreSQL                    |
| Instance Identifier | rds_inventory_management      |
| Database Name       | rdsinventorymanagementinitial |
| Security Group      | sg_private_rds                |

---

## DB Subnet Group

Created:

```bash id="p8q4na"
rds_subnet_group
```

Selected subnets:

* private_subnet
* private_subnet_2

---

## Security Group Configuration

Inbound Rule:

* Type: PostgreSQL
* Source: `sg_public_ec2`

This allowed the EC2 backend server to connect securely with the private RDS database.

---

# Prisma Database Setup

## Environment Variables

```env id="s4m7qn"
PORT=80

DATABASE_URL="postgresql://postgres:password@rdsinventorymanagement.ap-south-1.rds.amazonaws.com:5432/rdsinventorymanagementinitial?schema=public"
```

---

## Prisma Commands

```bash id="n6w1qe"
npx prisma generate

npx prisma migrate dev --name init

npm run seed
```

---

# AWS Amplify Deployment

## Amplify Configuration

### Repository

```bash id="q2x5du"
Sandhuekroop/CloudStock
```

### Monorepo Root Directory

```bash id="a8t1ks"
client
```

### Build Configuration

| Setting       | Value         |
| ------------- | ------------- |
| Build Command | npm run build |
| Build Output  | .next         |

---

## Environment Variable

```env id="c9z2vm"
NEXT_PUBLIC_API_BASE_URL=http://EC2_PUBLIC_IP
```

After API Gateway setup:

```env id="j4u8ne"
NEXT_PUBLIC_API_BASE_URL=API_GATEWAY_INVOKE_URL
```

Then redeployed the application.

---

# AWS API Gateway

## API Integrations

| Route      | Method |
| ---------- | ------ |
| /dashboard | GET    |
| /users     | GET    |
| /expenses  | GET    |
| /products  | ANY    |

### API Name

```bash id="y6f3ln"
apiinventorymanagement1
```

### Stages

* Default
* prod

---

# AWS S3 Configuration

## Bucket Setup

| Setting     | Value         |
| ----------- | ------------- |
| Bucket Name | s3_cloudstock |

### Configuration

* Disabled Block Public Access
* Disabled Bucket Versioning

---

## Bucket Policy

```json id="r3n6jk"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::s3cloudstock/*"
    }
  ]
}
```

---

# Next.js S3 Image Configuration

## next.config.ts

```javascript id="h8m5qw"
/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3cloudstock.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
```

---

# Challenges Faced During Development

During development and deployment, several practical issues were encountered and resolved.

## Frontend Challenges

* Dark mode styling conflicts
* Tailwind hover issues
* Material UI integration issues
* Redux state synchronization problems
* API rendering delays

---

## Backend Challenges

* Prisma migration issues
* Database synchronization problems
* Environment variable configuration issues
* PM2 deployment failures
* API route debugging

---

## AWS & Deployment Challenges

* Amplify deployment failures
* Monorepo build configuration issues
* EC2 setup and Node.js installation issues
* RDS connectivity problems
* Security group configuration
* Route table association errors
* API Gateway integration issues
* S3 bucket permission setup
* Automatic redeployment handling

---

# Project Structure

```bash id="z4r7mv"
project-root/
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── expenses/
│   │   │   ├── inventory/
│   │   │   ├── products/
│   │   │   ├── settings/
│   │   │   ├── users/
│   │   │   ├── layout.tsx
│   │   │   └── redux.tsx
│   │   │
│   │   └── state/
│   │       ├── api.ts
│   │       └── index.ts
│   │
│   └── package.json
│
├── server/
│   ├── assets/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── seedData/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── index.ts
│   │
│   ├── ecosystem.config.js
│   └── package.json
│
└── README.md
```

---

# Running the Project Locally

## Frontend

```bash id="v7t2op"
cd client

npm install

npm run dev
```

---

## Backend

```bash id="u5n9qw"
cd server

npm install

npm run dev
```

---

# Learning Outcomes

This project provided practical experience with:

* AWS Cloud Infrastructure
* VPC Networking
* EC2 Deployment
* RDS Database Management
* API Gateway Configuration
* Amplify Hosting
* S3 Bucket Policies
* Prisma ORM
* Redux Toolkit & RTK Query
* PM2 Process Management
* Full Stack Deployment
* Real-world Debugging & Troubleshooting

---

# Future Improvements

* Authentication & Authorization
* Docker Deployment
* CI/CD Pipeline
* HTTPS with Load Balancer
* Role-Based Access Control
* CloudWatch Monitoring
* Auto Scaling

---

# Author

**Ekroop Kaur Sandhu**

GitHub Repository:
[CloudStock Repository](https://github.com/Sandhuekroop/CloudStock?utm_source=chatgpt.com)
