# Permissions Manual Debug

In postman, I find two different queries available in the schema

1. userPermissions: requieres the user ID and returns:

```json
{
    "data": {
        "userPermissions": [
            "admin",
            "invite_users",
            "read",
            "system_admin",
            "project_invite",
            "task_write",
            "task_delete",
            "task_assign",
            "project_admin",
            "project_create",
            "user_management",
            "project_read",
            "write",
            "task_read",
            "task_create"
        ]
    }
}
```
2. allPermissions: this is a general quety that returns in general in the API.

```json
{
    "data": {
        "allPermissions": [
            {
                "id": "f58b3726-8677-4a02-9ee2-4d11d4a5fe9f",
                "action": "admin",
                "resourceId": "9f828b0b-a97a-4de1-a5f4-90237e05d3f1",
                "description": "Administrative access",
                "isActive": true,
                "createdAt": "2025-08-05T23:47:58.734926+00:00",
                "updatedAt": "2025-08-05T23:47:58.734928+00:00",
                "resourceName": "freshapi"
            },
            {
                "id": "10dd89cc-3a1d-4585-a266-30461de5817e",
                "action": "invite_users",
                "resourceId": "9f828b0b-a97a-4de1-a5f4-90237e05d3f1",
                "description": "Create user invitations",
                "isActive": true,
                "createdAt": "2025-08-05T23:47:58.736571+00:00",
                "updatedAt": "2025-08-05T23:47:58.736572+00:00",
                "resourceName": "freshapi"
            },
            {
                "id": "6e00cfe9-a12a-4c0b-916b-2c0dc57956ac",
                "action": "project_admin",
                "resourceId": "9187d33d-037b-47fb-a87c-daefbc4f4f5b",
                "description": "Full project administration",
                "isActive": true,
                "createdAt": "2025-08-05T23:47:59.314305+00:00",
                "updatedAt": "2025-08-05T23:47:59.314306+00:00",
                "resourceName": "task_system"
            },
            {
                "id": "3064ed3c-69ce-4bfa-b519-5036c89d56ef",
                "action": "project_create",
                "resourceId": "9187d33d-037b-47fb-a87c-daefbc4f4f5b",
                "description": "Create new projects",
                "isActive": true,
                "createdAt": "2025-08-05T23:47:59.313327+00:00",
                "updatedAt": "2025-08-05T23:47:59.313329+00:00",
                "resourceName": "task_system"
            },
            {
                "id": "25c33f7f-fe20-403b-bae9-5b94d1cd5a6d",
                "action": "project_invite",
                "resourceId": "9187d33d-037b-47fb-a87c-daefbc4f4f5b",
                "description": "Invite users to projects",
                "isActive": true,
                "createdAt": "2025-08-05T23:47:59.314705+00:00",
                "updatedAt": "2025-08-05T23:47:59.314706+00:00",
                "resourceName": "task_system"
            },
            {
                "id": "3ba18883-96a2-4d17-8416-653cefe478a6",
                "action": "project_read",
                "resourceId": "9187d33d-037b-47fb-a87c-daefbc4f4f5b",
                "description": "View projects and their details",
                "isActive": true,
                "createdAt": "2025-08-05T23:47:59.313830+00:00",
                "updatedAt": "2025-08-05T23:47:59.313831+00:00",
                "resourceName": "task_system"
            },
            {
                "id": "f2fba1d9-6220-4a9c-a923-4760d7518db7",
                "action": "read",
                "resourceId": "9f828b0b-a97a-4de1-a5f4-90237e05d3f1",
                "description": "Read access to basic data",
                "isActive": true,
                "createdAt": "2025-08-05T23:47:58.732983+00:00",
                "updatedAt": "2025-08-05T23:47:58.732984+00:00",
                "resourceName": "freshapi"
            },
            {
                "id": "f4461b80-c9a4-4cef-b1f6-ab3908cc5170",
                "action": "system_admin",
                "resourceId": "9f828b0b-a97a-4de1-a5f4-90237e05d3f1",
                "description": "Full system administration",
                "isActive": true,
                "createdAt": "2025-08-05T23:47:58.737289+00:00",
                "updatedAt": "2025-08-05T23:47:58.737290+00:00",
                "resourceName": "freshapi"
            },
            {
                "id": "a45d89db-c5a0-48f6-ab7b-745e1eb9870c",
                "action": "task_assign",
                "resourceId": "9187d33d-037b-47fb-a87c-daefbc4f4f5b",
                "description": "Assign tasks to users",
                "isActive": true,
                "createdAt": "2025-08-05T23:47:59.316220+00:00",
                "updatedAt": "2025-08-05T23:47:59.316221+00:00",
                "resourceName": "task_system"
            },
            {
                "id": "6eed8b94-58be-4980-8d3c-bf26be935877",
                "action": "task_create",
                "resourceId": "9187d33d-037b-47fb-a87c-daefbc4f4f5b",
                "description": "Create tasks in projects",
                "isActive": true,
                "createdAt": "2025-08-05T23:47:59.315065+00:00",
                "updatedAt": "2025-08-05T23:47:59.315066+00:00",
                "resourceName": "task_system"
            },
            {
                "id": "6c004fc8-1dec-47a0-8c5a-48c75f1e16be",
                "action": "task_delete",
                "resourceId": "9187d33d-037b-47fb-a87c-daefbc4f4f5b",
                "description": "Delete tasks",
                "isActive": true,
                "createdAt": "2025-08-05T23:47:59.316608+00:00",
                "updatedAt": "2025-08-05T23:47:59.316609+00:00",
                "resourceName": "task_system"
            },
            {
                "id": "038222ca-98c8-4549-9d6f-caac2c6918a2",
                "action": "task_read",
                "resourceId": "9187d33d-037b-47fb-a87c-daefbc4f4f5b",
                "description": "View tasks in projects",
                "isActive": true,
                "createdAt": "2025-08-05T23:47:59.315400+00:00",
                "updatedAt": "2025-08-05T23:47:59.315401+00:00",
                "resourceName": "task_system"
            },
            {
                "id": "b5301c72-af24-422f-be26-f11277b19472",
                "action": "task_write",
                "resourceId": "9187d33d-037b-47fb-a87c-daefbc4f4f5b",
                "description": "Edit and update tasks",
                "isActive": true,
                "createdAt": "2025-08-05T23:47:59.315783+00:00",
                "updatedAt": "2025-08-05T23:47:59.315784+00:00",
                "resourceName": "task_system"
            },
            {
                "id": "b2841ecd-792c-471b-860f-7abf75d36917",
                "action": "user_management",
                "resourceId": "9f828b0b-a97a-4de1-a5f4-90237e05d3f1",
                "description": "Manage users and roles",
                "isActive": true,
                "createdAt": "2025-08-05T23:47:58.735552+00:00",
                "updatedAt": "2025-08-05T23:47:58.735553+00:00",
                "resourceName": "freshapi"
            },
            {
                "id": "55000423-4418-493f-a919-b09d3d271294",
                "action": "write",
                "resourceId": "9f828b0b-a97a-4de1-a5f4-90237e05d3f1",
                "description": "Write access to own data",
                "isActive": true,
                "createdAt": "2025-08-05T23:47:58.734373+00:00",
                "updatedAt": "2025-08-05T23:47:58.734374+00:00",
                "resourceName": "freshapi"
            }
        ]
    }
}

```