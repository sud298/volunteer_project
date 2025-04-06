# Project Setup Guide
## 🐘 PostgreSQL Installation

### Windows
1. Download installer from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Run installer (remember your admin password)
3. Add PostgreSQL to PATH during installation

### macOS
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

## 🔐 Environment Setup

Create `.env` file in project root:
```env
# Database
DATABASE_URL="postgresql://dbuser:dbpassword@localhost:5432/dbname?schema=public"

# Authentication
JWT_SECRET="your-strong-secret-here"

# Python
PYTHON_PATH="/path/to/python"
```

## 🗄️ Database Tables Setup

1. Initialize Prisma:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

2. Verify tables:
```bash
npx prisma studio
```

## 📊 Python Data Import

### 1. Install dependencies
```bash
cd data-scripts
```
Run the individual cell of the python script - insert_in_postgres.ipynb 

## 👤 Create Test User

### Via API:
```bash
curl -X POST 'http://localhost:3000/api/auth/signup' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "name": "Test User"
  }'
```

### Expected Response:
```json
{
  "id": "clxyz...",
  "email": "test@example.com",
  "createdAt": "2024-06-20T12:00:00.000Z"
}
```

## 🚦 Verification Steps

1. Check database connection:
```bash
npx prisma validate
```

2. Test authentication:
```bash
curl -X POST 'http://localhost:3000/api/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"SecurePassword123!"}'
```

3. Verify data import:
```bash
npx prisma studio
```

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Check PostgreSQL service status |
| Authentication failed | Verify credentials in `.env` |
| Python import errors | Check CSV file permissions |
| Prisma migration conflicts | Run `npx prisma migrate reset` |

## 🔗 Helpful Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Migration Guide](https://www.prisma.io/docs/guides/migrate)
- [Next.js Auth Documentation](https://next-auth.js.org/)
