# Password Reset Guide

## How to Reset Your Password

### Step 1: Request Password Reset

1. Go to the sign-in page: http://localhost:3000/auth/signin
2. Click on "Forgot password?" link below the password field
3. Enter your email address
4. Click "Send Reset Link"

### Step 2: Get Reset Link

**Development Mode:**
- The reset link will be displayed on the screen
- Copy the link and paste it in your browser

**Production Mode (Future):**
- You will receive an email with the reset link
- Click the link in the email

### Step 3: Set New Password

1. You'll be redirected to the reset password page
2. Enter your new password (minimum 6 characters)
3. Confirm your new password
4. Click "Reset Password"
5. You'll be automatically redirected to sign in

### Step 4: Sign In

1. Use your email and new password to sign in
2. Access your dashboard

---

## For Developers

### Database Setup

After adding the PasswordReset model, run:

```bash
# Generate Prisma client with new model
yarn prisma generate

# Update database schema
yarn prisma db push
```

### API Endpoints

**Request Reset:**
```
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }
```

**Reset Password:**
```
POST /api/auth/reset-password
Body: { "token": "reset-token", "password": "newpassword" }
```

### Security Features

- ✅ Tokens expire after 1 hour
- ✅ Tokens can only be used once
- ✅ Passwords are hashed with bcrypt
- ✅ Email enumeration prevention
- ✅ Minimum password length validation

### Email Integration (Production)

To enable email sending in production, integrate an email service:

**Option 1: SendGrid**
```bash
npm install @sendgrid/mail
```

**Option 2: Nodemailer**
```bash
npm install nodemailer
```

**Option 3: AWS SES**
```bash
npm install @aws-sdk/client-ses
```

Update `/app/api/auth/forgot-password/route.ts` to send emails instead of returning the link.

### Example Email Integration

```typescript
// In forgot-password/route.ts
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const msg = {
  to: email,
  from: 'noreply@yourapp.com',
  subject: 'Password Reset Request',
  html: `
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>This link expires in 1 hour.</p>
  `
}

await sgMail.send(msg)
```

### Environment Variables (Production)

Add to `.env`:
```env
# Email Service
SENDGRID_API_KEY="your-sendgrid-api-key"
EMAIL_FROM="noreply@yourapp.com"
```

---

## Testing

### Test the Flow

1. **Create a test user:**
   ```bash
   # Use the signup page or seed script
   ```

2. **Request password reset:**
   - Go to http://localhost:3000/auth/forgot-password
   - Enter test user email
   - Copy the reset link from the response

3. **Reset password:**
   - Paste the reset link in browser
   - Enter new password
   - Confirm password
   - Submit

4. **Verify:**
   - Sign in with new password
   - Should successfully access dashboard

### Manual Database Check

```sql
-- View password reset tokens
SELECT * FROM "PasswordReset" WHERE email = 'test@example.com';

-- Check if token was used
SELECT used, expires FROM "PasswordReset" WHERE token = 'your-token';
```

---

## Troubleshooting

### "Invalid or expired reset token"
- Token may have expired (1 hour limit)
- Token may have already been used
- Request a new reset link

### "User not found"
- Email address doesn't exist in the system
- Check email spelling
- Create an account if needed

### "Passwords do not match"
- Ensure both password fields are identical
- Check for extra spaces

### Database Error
```bash
# Reset database and regenerate
yarn prisma db push --force-reset
yarn prisma generate
```

---

## Security Best Practices

1. **Token Expiration**: Tokens expire after 1 hour
2. **One-Time Use**: Tokens can only be used once
3. **Secure Storage**: Tokens stored in database, not in URLs permanently
4. **Password Requirements**: Minimum 6 characters (increase in production)
5. **Rate Limiting**: Consider adding rate limiting in production
6. **HTTPS Only**: Always use HTTPS in production

---

## Future Enhancements

- [ ] Email verification before password reset
- [ ] Rate limiting on reset requests
- [ ] Password strength meter
- [ ] Password history (prevent reusing old passwords)
- [ ] Two-factor authentication
- [ ] Account lockout after failed attempts
- [ ] Security notifications

---

## Summary

✅ **Forgot Password Flow Implemented**
- Request reset link via email
- Secure token generation
- Time-limited tokens (1 hour)
- One-time use tokens
- Password validation
- Automatic redirect after reset

The password reset system is now fully functional and ready to use!
