# WolfTix - A Microservices-Based Ticketing Platform

**WolfTix** is a highly scalable, cloud-native ticketing platform that allows users to purchase and manage event tickets in real time. Built with a microservices architecture, the platform ensures that each service is independently deployable and scalable. From secure payments to real-time order management, WolfTix delivers a robust and efficient user experience for event organizers and ticket buyers alike.

## Table of Contents
- [Features](#features)
- [Microservices Architecture](#microservices-architecture)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Microservices Architecture**: Independent services for users, tickets, orders, and payments.
- **Real-Time Ticket Reservations**: Ensure tickets are instantly marked as reserved to avoid double booking.
- **Secure Payments**: Integrated with Stripe for secure payments and transactions.
- **Order & Ticket Management**: Track your orders and tickets in real time, with live status updates.
- **Authentication & Authorization**: Secure login and session management using JWT and cookie sessions.
- **Event-Driven Architecture**: NATS Streaming handles inter-service communication for efficient message passing and real-time updates.
- **Cloud Deployment**: Built with Docker and Kubernetes, leveraging cloud scalability through DigitalOcean's Kubernetes engine.

## Microservices Architecture
WolfTix is designed with a modular microservices architecture. Each microservice is responsible for a specific business domain:

1. **Auth Service**: Manages user registration, authentication, and authorization.
2. **Ticket Service**: Allows users to create, edit, and view event tickets.
3. **Order Service**: Manages ticket orders and reservation statuses.
4. **Payment Service**: Processes payments via Stripe.
5. **Expiration Service**: Handles order expiration using a background worker service.
6. **NATS Streaming Server**: Used for event-based communication between services to maintain real-time consistency.

## Technologies Used
- **Frontend**: React, Next.js, Bootstrap
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, cookie-session
- **Payments**: Stripe API
- **Event Streaming**: NATS Streaming for inter-service messaging
- **DevOps**: Docker, Kubernetes, NGINX, Ingress
- **CI/CD**: GitHub Actions for continuous integration and deployment
- **Cloud**: DigitalOcean Kubernetes (DOKS)

## Setup and Installation

### Prerequisites
Before you begin, ensure you have the following installed:
- Docker
- Kubernetes (Minikube or DigitalOcean Kubernetes)
- Kubectl
- Helm
- Node.js and npm

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Harrytimbog/WolfTix.git
   cd WolfTix
