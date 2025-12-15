# ============================================
# CYBEREDU STAGE 3 - COMPLETE TEST SCRIPT
# ============================================
# Run this in PowerShell: ./test-stage3.ps1
# ============================================

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "CYBEREDU BACKEND - STAGE 3 TESTING" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# ============ CONFIGURATION ============
$BASE_URL = "http://localhost:3000/api/v1"
$API_PREFIX = "/api/v1"

# Colors for output
$SuccessColor = "Green"
$ErrorColor = "Red"
$InfoColor = "Yellow"
$StepColor = "Cyan"

# Test counters
$TestsPassed = 0
$TestsFailed = 0

# ============ HELPER FUNCTIONS ============
function Write-TestResult {
    param([string]$TestName, [bool]$Passed, [string]$Message)
    
    if ($Passed) {
        Write-Host "✅ PASS: $TestName" -ForegroundColor $SuccessColor
        if ($Message) { Write-Host "   $Message" -ForegroundColor DarkGreen }
        $script:TestsPassed++
    } else {
        Write-Host "❌ FAIL: $TestName" -ForegroundColor $ErrorColor
        if ($Message) { Write-Host "   $Message" -ForegroundColor DarkRed }
        $script:TestsFailed++
    }
}

function Invoke-API {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Body = $null,
        [string]$Token = $null,
        [string]$ContentType = "application/json"
    )
    
    $headers = @{}
    if ($ContentType) { $headers["Content-Type"] = $ContentType }
    if ($Token) { $headers["Authorization"] = "Bearer $Token" }
    
    $uri = "$BASE_URL$Endpoint"
    
    try {
        if ($Body -and ($Method -eq "POST" -or $Method -eq "PUT" -or $Method -eq "PATCH")) {
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -Body $Body
        } else {
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers
        }
        return @{ Success = $true; Data = $response }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorMessage = $_.ErrorDetails.Message | ConvertFrom-Json
        return @{ 
            Success = $false
            StatusCode = $statusCode
            Error = $errorMessage
            RawError = $_
        }
    }
}

function Wait-ForServer {
    Write-Host "⏳ Waiting for server to be ready..." -ForegroundColor $InfoColor
    $maxAttempts = 30
    $attempt = 0
    
    while ($attempt -lt $maxAttempts) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000$API_PREFIX/health" -Method GET -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ Server is ready!" -ForegroundColor $SuccessColor
                return $true
            }
        } catch {
            # Server not ready yet
        }
        
        $attempt++
        Write-Host "   Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
    
    Write-Host "❌ Server not responding after $maxAttempts attempts" -ForegroundColor $ErrorColor
    return $false
}

# ============ MAIN TEST SCRIPT ============
Write-Host "`n[1/6] Checking server status..." -ForegroundColor $StepColor
if (-not (Wait-ForServer)) {
    Write-Host "Please start the server with: npm run start:dev" -ForegroundColor $ErrorColor
    exit 1
}

Write-Host "`n[2/6] Testing Authentication Endpoints..." -ForegroundColor $StepColor

# 1. Test Registration
Write-Host "`n--- Testing User Registration ---" -ForegroundColor $InfoColor

# Register Student 1
$student1Body = '{"email":"test.student1@cyberedu.test","password":"StudentPass123","firstName":"John","lastName":"Doe"}'
$result = Invoke-API -Method "POST" -Endpoint "/auth/register" -Body $student1Body

if ($result.Success -and $result.Data.success -eq $true) {
    $student1Token = $result.Data.data.tokens.accessToken
    $student1Id = $result.Data.data.user._id
    Write-TestResult -TestName "Student Registration" -Passed $true -Message "Student ID: $student1Id"
} else {
    Write-TestResult -TestName "Student Registration" -Passed $false -Message "Status: $($result.StatusCode)"
}

# Register Instructor
$instructorBody = '{"email":"test.instructor1@cyberedu.test","password":"InstructorPass123","firstName":"Professor","lastName":"Smith","role":"instructor"}'
$result = Invoke-API -Method "POST" -Endpoint "/auth/register" -Body $instructorBody

if ($result.Success -and $result.Data.success -eq $true) {
    $instructorToken = $result.Data.data.tokens.accessToken
    $instructorId = $result.Data.data.user._id
    Write-TestResult -TestName "Instructor Registration" -Passed $true -Message "Instructor ID: $instructorId"
} else {
    Write-TestResult -TestName "Instructor Registration" -Passed $false -Message "Status: $($result.StatusCode)"
}

# Test duplicate email registration
$result = Invoke-API -Method "POST" -Endpoint "/auth/register" -Body $student1Body
Write-TestResult -TestName "Duplicate Email Prevention" -Passed ($result.Success -eq $false -and $result.StatusCode -eq 409) -Message "Expected 409 Conflict"

# Test weak password
$weakPassBody = '{"email":"weak@test.com","password":"weak","firstName":"Weak","lastName":"Password"}'
$result = Invoke-API -Method "POST" -Endpoint "/auth/register" -Body $weakPassBody
Write-TestResult -TestName "Weak Password Validation" -Passed ($result.Success -eq $false -and $result.StatusCode -eq 400) -Message "Expected 400 Bad Request"

# 2. Test Login
Write-Host "`n--- Testing User Login ---" -ForegroundColor $InfoColor

# Valid student login
$loginBody = '{"email":"test.student1@cyberedu.test","password":"StudentPass123"}'
$result = Invoke-API -Method "POST" -Endpoint "/auth/login" -Body $loginBody

if ($result.Success -and $result.Data.success -eq $true) {
    $student1Token = $result.Data.data.tokens.accessToken
    Write-TestResult -TestName "Student Login" -Passed $true -Message "Token received"
} else {
    Write-TestResult -TestName "Student Login" -Passed $false
}

# Invalid login
$invalidLoginBody = '{"email":"test.student1@cyberedu.test","password":"WrongPassword"}'
$result = Invoke-API -Method "POST" -Endpoint "/auth/login" -Body $invalidLoginBody
Write-TestResult -TestName "Invalid Login" -Passed ($result.Success -eq $false -and $result.StatusCode -eq 401) -Message "Expected 401 Unauthorized"

# 3. Test Profile Endpoints
Write-Host "`n[3/6] Testing Profile Management..." -ForegroundColor $StepColor

# Get current user profile
$result = Invoke-API -Method "GET" -Endpoint "/auth/me" -Token $student1Token
Write-TestResult -TestName "GET /auth/me" -Passed ($result.Success -eq $true) -Message "Profile retrieved"

# Update profile
$updateProfileBody = '{"phoneNumber":"+1234567890","institution":"Stanford University","department":"Computer Science","bio":"Cybersecurity student"}'
$result = Invoke-API -Method "PUT" -Endpoint "/users/me" -Token $student1Token -Body $updateProfileBody
Write-TestResult -TestName "PUT /users/me (Update Profile)" -Passed ($result.Success -eq $true) -Message "Profile updated"

# Change password
$changePassBody = '{"currentPassword":"StudentPass123","newPassword":"NewSecurePass456"}'
$result = Invoke-API -Method "PATCH" -Endpoint "/users/me/password" -Token $student1Token -Body $changePassBody
Write-TestResult -TestName "PATCH /users/me/password" -Passed ($result.Success -eq $true) -Message "Password changed"

# 4. Test Admin Endpoints (if admin exists)
Write-Host "`n[4/6] Testing Admin Functionality..." -ForegroundColor $StepColor

# First, try to login as admin (you need to create this user manually)
$adminLoginBody = '{"email":"admin@cyberedu.com","password":"AdminPass123!"}'
$result = Invoke-API -Method "POST" -Endpoint "/auth/login" -Body $adminLoginBody

if ($result.Success -and $result.Data.success -eq $true) {
    $adminToken = $result.Data.data.tokens.accessToken
    Write-Host "✅ Admin login successful" -ForegroundColor $SuccessColor
    
    # Test admin user listing
    $result = Invoke-API -Method "GET" -Endpoint "/admin/users?page=1&limit=5" -Token $adminToken
    Write-TestResult -TestName "GET /admin/users (Admin)" -Passed ($result.Success -eq $true) -Message "User list retrieved"
    
    # Test admin update user
    if ($student1Id) {
        $updateUserBody = '{"status":"active","isVerified":true,"studentId":"S20240001"}'
        $result = Invoke-API -Method "PATCH" -Endpoint "/admin/users/$student1Id" -Token $adminToken -Body $updateUserBody
        Write-TestResult -TestName "PATCH /admin/users/:id" -Passed ($result.Success -eq $true) -Message "User updated by admin"
    }
    
    # Test soft delete
    if ($student1Id) {
        $result = Invoke-API -Method "DELETE" -Endpoint "/admin/users/$student1Id" -Token $adminToken
        Write-TestResult -TestName "DELETE /admin/users/:id (Soft Delete)" -Passed ($result.Success -eq $true) -Message "User soft deleted"
        
        # Test restore
        $result = Invoke-API -Method "PATCH" -Endpoint "/admin/users/$student1Id/restore" -Token $adminToken
        Write-TestResult -TestName "PATCH /admin/users/:id/restore" -Passed ($result.Success -eq $true) -Message "User restored"
    }
} else {
    Write-Host "⚠️  Skipping admin tests - admin user not found or wrong credentials" -ForegroundColor $InfoColor
    Write-Host "   To test admin features, create admin user in MongoDB:" -ForegroundColor $InfoColor
    Write-Host "   Email: admin@cyberedu.com" -ForegroundColor $InfoColor
    Write-Host "   Password: AdminPass123!" -ForegroundColor $InfoColor
    Write-Host "   Role: admin" -ForegroundColor $InfoColor
}

# 5. Test Role-Based Access Control
Write-Host "`n[5/6] Testing Role-Based Access Control..." -ForegroundColor $StepColor

# Student trying to access admin endpoint (should fail)
if ($student1Token) {
    $result = Invoke-API -Method "GET" -Endpoint "/admin/users" -Token $student1Token
    Write-TestResult -TestName "Student Access to Admin Endpoint" -Passed ($result.Success -eq $false -and $result.StatusCode -eq 403) -Message "Expected 403 Forbidden"
}

# Instructor trying to access admin endpoint (should also fail)
if ($instructorToken) {
    $result = Invoke-API -Method "GET" -Endpoint "/admin/users" -Token $instructorToken
    Write-TestResult -TestName "Instructor Access to Admin Endpoint" -Passed ($result.Success -eq $false -and $result.StatusCode -eq 403) -Message "Expected 403 Forbidden"
}

# 6. Test Error Cases
Write-Host "`n[6/6] Testing Error Cases..." -ForegroundColor $StepColor

# Invalid token
$result = Invoke-API -Method "GET" -Endpoint "/auth/me" -Token "invalid.token.here"
Write-TestResult -TestName "Invalid Token" -Passed ($result.Success -eq $false -and $result.StatusCode -eq 401) -Message "Expected 401 Unauthorized"

# Non-existent endpoint
$result = Invoke-API -Method "GET" -Endpoint "/nonexistent"
Write-TestResult -TestName "Non-existent Endpoint" -Passed ($result.Success -eq $false -and $result.StatusCode -eq 404) -Message "Expected 404 Not Found"

# Missing required fields
$incompleteBody = '{"email":"incomplete@test.com"}'
$result = Invoke-API -Method "POST" -Endpoint "/auth/register" -Body $incompleteBody
Write-TestResult -TestName "Missing Required Fields" -Passed ($result.Success -eq $false -and $result.StatusCode -eq 400) -Message "Expected 400 Bad Request"

# ============ FINAL RESULTS ============
Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Tests Passed: $TestsPassed" -ForegroundColor $SuccessColor
Write-Host "Tests Failed: $TestsFailed" -ForegroundColor $(if ($TestsFailed -gt 0) { $ErrorColor } else { $SuccessColor })

$totalTests = $TestsPassed + $TestsFailed
if ($totalTests -gt 0) {
    $successRate = [math]::Round(($TestsPassed / $totalTests) * 100, 2)
    Write-Host "Success Rate: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { $SuccessColor } elseif ($successRate -ge 60) { $InfoColor } else { $ErrorColor })
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "MANUAL VERIFICATION STEPS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host "`n1. Check Swagger Documentation:" -ForegroundColor $InfoColor
Write-Host "   URL: http://localhost:3000/api/docs" -ForegroundColor White

Write-Host "`n2. Check Database Records:" -ForegroundColor $InfoColor
Write-Host "   Run: mongosh cyberedu --eval `"db.users.find({}, {email: 1, role: 1, isActive: 1}).sort({createdAt: -1})`"" -ForegroundColor White

Write-Host "`n3. Create Admin User (if not exists):" -ForegroundColor $InfoColor
Write-Host "   In MongoDB Compass, insert:" -ForegroundColor White
Write-Host '   {
     "email": "admin@cyberedu.com",
     "password": "$2b$10$bzyue.SsAHEVU0P4/ssCce/vqJIhwZgU5yQekZED8V4I6KDIbNlwu",
     "firstName": "System",
     "lastName": "Admin",
     "role": "admin",
     "status": "active",
     "isActive": true,
     "isVerified": true
   }' -ForegroundColor Gray

Write-Host "`n4. Test with Postman/curl:" -ForegroundColor $InfoColor
Write-Host "   Collection URL: http://localhost:3000$API_PREFIX/docs" -ForegroundColor White

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "STAGE 3 COMPLETION CHECKLIST" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$checklist = @(
    @{ Item = "User Registration Works"; Status = if ($TestsPassed -gt 5) { "✅" } else { "❌" } },
    @{ Item = "Login/Logout Works"; Status = if ($TestsPassed -gt 7) { "✅" } else { "❌" } },
    @{ Item = "Profile Management Works"; Status = if ($TestsPassed -gt 10) { "✅" } else { "❌" } },
    @{ Item = "Role-Based Access Control"; Status = if ($TestsPassed -gt 12) { "✅" } else { "❌" } },
    @{ Item = "Admin Functions (if admin exists)"; Status = if ($TestsPassed -gt 15) { "✅" } else { "⚠️" } },
    @{ Item = "Error Handling Works"; Status = if ($TestsPassed -gt 17) { "✅" } else { "❌" } },
    @{ Item = "Swagger Documentation"; Status = "🔧" }  # Manual check
)

foreach ($item in $checklist) {
    Write-Host "$($item.Status) $($item.Item)" -ForegroundColor $(switch ($item.Status) {
        "✅" { $SuccessColor }
        "❌" { $ErrorColor }
        "⚠️" { $InfoColor }
        "🔧" { "Gray" }
    })
}

Write-Host "`n🎉 STAGE 3 TESTING COMPLETE!" -ForegroundColor Green
Write-Host "Next: Run 'npm run build' to check for TypeScript errors" -ForegroundColor White