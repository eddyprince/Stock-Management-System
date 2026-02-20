# Stock Management System — Diagrams Reference

This file contains the same diagrams as in `SYSTEM_OVERVIEW.md`, for quick reference and rendering in diagram tools.

## Use Case Diagram (Mermaid)

```mermaid
flowchart LR
    subgraph Actors
        User([User])
        Admin([Admin])
        StockMgr([Stock Manager])
        Director([Director])
        Account([Account])
    end
    subgraph System["Stock Management System"]
        UC_Login(Login)
        UC_Logout(Logout)
        UC_ViewStock(View Stock Info)
        UC_ViewExpired(View Expired Stock)
        UC_ViewDamaged(View Damaged Qty)
        UC_ManageProducts(Manage Products)
        UC_RecordSupply(Record Supply / Supplier)
        UC_ViewReports(View Reports)
        UC_ManageUsers(Manage Users)
        UC_Account(Account Operations)
    end
    User --> UC_Login
    User --> UC_Logout
    Admin --> UC_Login
    Admin --> UC_ManageUsers
    Admin --> UC_ViewStock
    Admin --> UC_ViewReports
    StockMgr --> UC_Login
    StockMgr --> UC_ManageProducts
    StockMgr --> UC_RecordSupply
    StockMgr --> UC_ViewStock
    Director --> UC_Login
    Director --> UC_ViewReports
    Director --> UC_ViewStock
    Account --> UC_Login
    Account --> UC_Account
```

## Data Flow Diagram — Level 1

```mermaid
flowchart TB
    User([User])
    subgraph Frontend["Frontend (Vue SPA)"]
        P1[Login Form]
        P2[Dashboard / Stock]
        P3[Product/Supply Forms]
        P4[Reports View]
    end
    subgraph Backend["Backend API"]
        A1[Auth API]
        A2[Products/Stock API]
        A3[Reports API]
    end
    DB[(MongoDB)]
    User --> P1
    User --> P2
    User --> P3
    User --> P4
    P1 --> A1
    P2 --> A2
    P3 --> A2
    P4 --> A3
    A1 --> DB
    A2 --> DB
    A3 --> DB
```

## Class Diagram

```mermaid
classDiagram
    class User {
        +_id
        +username
        +passwordHash
        +role
        +email
        +createdAt
    }
    class Product {
        +_id
        +name
        +sku
        +quantityInStock
        +quantityDamaged
        +totalSupplied
        +supplierId
        +expiryDate
        +isExpired()
    }
    class Supplier {
        +_id
        +name
        +contact
    }
    class StockTransaction {
        +_id
        +productId
        +type
        +quantity
        +amount
        +userId
        +createdAt
    }
    Product --> Supplier : from
    Product --> StockTransaction : has
    User --> StockTransaction : creates
```

## Login + View Stock Sequence

```mermaid
sequenceDiagram
    User->>Vue: Open app
    Vue->>Router: Check route
    Router->>Vue: No token → Login
    User->>Vue: Enter credentials
    Vue->>API: POST /auth/login
    API->>MongoDB: Verify user
    MongoDB->>API: User
    API->>Vue: JWT
    Vue->>Vue: Store token, redirect
    Vue->>API: GET /products (JWT)
    API->>MongoDB: Query
    MongoDB->>Vue: Stock data
```
