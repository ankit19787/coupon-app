# .env File Configuration

## Using Custom .env File Names

If you're using custom .env file names like `.env.12`, `.env.13`, etc., you can specify which file to use.

### Option 1: Using ENV_FILE Environment Variable

Set the `ENV_FILE` environment variable before running your commands:

**Windows (CMD):**
```cmd
set ENV_FILE=.env.12
npm run dev
```

**Windows (PowerShell):**
```powershell
$env:ENV_FILE=".env.12"
npm run dev
```

**Linux/macOS:**
```bash
ENV_FILE=.env.12 npm run dev
```

### Option 2: Using Cross-Env Package (Recommended)

Install cross-env for cross-platform compatibility:
```bash
npm install --save-dev cross-env
```

Then update your package.json scripts:
```json
{
  "scripts": {
    "dev": "cross-env ENV_FILE=.env.12 nodemon server.js",
    "start": "cross-env ENV_FILE=.env.12 node server.js"
  }
}
```

### Option 3: Rename Your .env File

Simply rename your custom .env file to `.env`:
```bash
# If you have .env.12
mv .env.12 .env

# Or copy it
cp .env.12 .env
```

## Default Behavior

By default, the application looks for `.env` in the project root.

If `ENV_FILE` is not set, it will use `.env`.

## Example .env File Structure

Your `.env` or `.env.12` file should contain:

```env
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coupon_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false

# Or use POSTGRES_URL
# POSTGRES_URL=postgresql://user:password@host:port/database

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

## Troubleshooting

### File Not Found
If you get an error that the .env file is not found:
1. Check the file name matches what you specified in `ENV_FILE`
2. Ensure the file is in the `backend1` directory (same level as `package.json`)
3. Check file permissions

### Variables Not Loading
1. Verify the file exists in the correct location
2. Check for syntax errors in the .env file
3. Ensure no spaces around the `=` sign: `KEY=value` not `KEY = value`
4. Restart the server after changing .env file

### Quick Test
To test which .env file is being loaded, you can add a debug line:

```javascript
console.log('Loading .env from:', envFile);
console.log('DB_HOST:', process.env.DB_HOST);
```

