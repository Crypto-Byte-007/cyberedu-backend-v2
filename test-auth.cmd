@echo off
echo ============================================
echo Testing CyberEdu Authentication - Stage 2
echo ============================================
echo.

echo 1. Testing Registration...
curl -X POST http://localhost:3000/api/v1/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"Password123\",\"firstName\":\"Test\",\"lastName\":\"User\"}"
echo.

echo 2. Testing Login...
curl -X POST http://localhost:3000/api/v1/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"Password123\"}"
echo.

echo 3. Testing Protected Route (will fail without token)...
curl -X GET http://localhost:3000/api/v1/auth/me
echo.

echo Test Complete!
pause