@echo off
echo ===============================================
echo     PBL6 Database Setup Instructions
echo ===============================================
echo.
echo 1. PostgreSQL Installation Status:
echo    - PostgreSQL was not found on this system
echo    - Please install PostgreSQL first
echo.
echo 2. Download PostgreSQL:
echo    - Go to: https://www.postgresql.org/download/windows/
echo    - Download and install PostgreSQL
echo    - During installation, remember the password for 'postgres' user
echo.
echo 3. After PostgreSQL is installed, you can create the database by:
echo    Option A: Using pgAdmin (GUI)
echo    - Open pgAdmin
echo    - Right-click on 'Databases'
echo    - Select 'Create' -> 'Database'
echo    - Name: ql_htqt
echo    - Owner: postgres
echo    - Click 'Save'
echo.
echo    Option B: Using SQL commands
echo    - Open Command Prompt as Administrator
echo    - Run: "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres
echo    - Enter password when prompted
echo    - Run: CREATE DATABASE ql_htqt;
echo    - Run: \q to quit
echo.  
echo 4. Update your .env file with correct database connection:
echo    DB_HOST=localhost
echo    DB_PORT=5432
echo    DB_USERNAME=postgres
echo    DB_PASSWORD=your_password_here
echo    DB_DATABASE=ql_htqt
echo.
echo 5. Once database is created, run: npm run start:dev
echo.
echo ===============================================
pause