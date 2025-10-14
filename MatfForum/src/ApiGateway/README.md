# API Gateway

## Opis
YARP (Yet Another Reverse Proxy) API Gateway koji služi kao jedinstvena ulazna tačka za sve mikroservise u MatForum aplikaciji.

## Funkcionalnosti
- Reverse proxy za sve mikroservise
- JWT autentifikacija i autorizacija
- CORS konfiguracija
- Request routing i load balancing
- Header forwarding (User ID, Name, Email)

## Struktura
```
ApiGateway/
└── MatForum.ApiGateway/    # YARP konfiguracija i middleware
```

## Port
- **Development**: 5000
- **Docker**: 80

## Routing Konfiguracija
- **Questions**: `/api/questions/*` → Question Service (5002)
- **Answers**: `/api/answers/*` → Answer Service (5004)
- **Votes**: `/api/votes/*` → Voting Service (5003)
- **Users**: `/api/users/*` → User Service (5001)
- **Auth**: `/api/auth/*` → Identity Server (5005)

## Autentifikacija
- **JWT Bearer Token** validacija
- **Issuer**: "Webstore Identity"
- **Audience**: "Webstore"
- **Signing Key**: "MyVerySecretSecretMessage1"

## CORS
- **Origins**: `http://localhost:5173` (Vite dev server)
- **Methods**: All
- **Headers**: All
- **Credentials**: Enabled

## Header Forwarding
API Gateway automatski dodaje sledeće headere u downstream zahteve:
- `X-User-Id`: ID korisnika iz JWT tokena
- `X-User-Name`: Ime korisnika iz JWT tokena
- `X-User-Email`: Email korisnika iz JWT tokena

## Swagger
- **URL**: http://localhost:5000/swagger
- Dostupno u development modu

## Mikroservisi
Gateway rutira zahteve ka sledećim servisima:
- **user-service**: http://user-service/
- **question-service**: http://question-service/
- **answer-service**: http://answer-service/
- **voting-service**: http://voting-service/
- **identityserver-service**: http://identityserver-service/
