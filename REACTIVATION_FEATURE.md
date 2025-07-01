# Service/Product Reactivation Feature

## Overview
This feature allows users to reactivate their previously deactivated or sold services and products by updating them with an ACTIVE status.

## How it Works

### Before the Update
Previously, users could not update services/products that were in the following states:
- `DEACTIVATED` - User manually deactivated the service/product
- `SOLD` - User marked the service/product as sold
- `EXPIRED` - Service/product expired based on business logic

### After the Update
Users can now:
1. **Reactivate deactivated services/products** by setting `status: "ACTIVE"` in the update request
2. **Reactivate sold services/products** by setting `status: "ACTIVE"` in the update request
3. **Still cannot reactivate expired services/products** - these require creating a new service/product

## API Usage

### Reactivating a Deactivated/Sold Service/Product

```http
PUT /service-providers/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 150,
  "status": "ACTIVE"  // This will reactivate the service/product
}
```

### Regular Update (No Status Change)

```http
PUT /service-providers/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 150
  // No status field - keeps current status
}
```

## Business Rules

1. **Only the owner** of the service/product can update it
2. **Expired services/products** cannot be reactivated (must create new ones)
3. **Deactivated and sold services/products** can be reactivated by setting status to "ACTIVE"
4. **Active services/products** can be updated normally
5. If no status is provided in the update request, the current status is preserved

## Error Messages

- `"Service or product not found"` - Invalid ID or not owned by user
- `"Cannot update expired service or product. Please create a new one."` - Attempting to update expired service/product

## Implementation Details

The feature is implemented in the `updateServiceOrProduct` method in `ServiceProvidersService` with the following logic:

1. Validate the service/product exists and belongs to the user
2. Check if the service/product is expired (block updates)
3. Handle reactivation logic for deactivated/sold items
4. Update the service/product in the database

## Status Values

- `ACTIVE` - Service/product is available and visible
- `DEACTIVATED` - User manually deactivated (can be reactivated)
- `SOLD` - User marked as sold (can be reactivated)
- `EXPIRED` - System expired (cannot be reactivated) 