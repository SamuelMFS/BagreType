# Supabase Email Configuration Guide

## Configuring Email Bounce Handling

Email bounce handling in Supabase is configured through the **Supabase Dashboard**, not through code. Here's how to set it up:

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `owbdkaatwklgrdhsskco`

### Step 2: Configure Email Settings

Navigate to: **Authentication** → **Email Templates** or **Authentication** → **Settings**

#### Email Confirmation (Already enabled by default)
- ✅ **Enable email confirmations**: This requires users to verify their email before accessing your app
- This prevents fake emails from getting through because unverified accounts can't be used

#### Rate Limiting
Look for these settings:
- **Max number of emails sent per hour**: Set a limit (e.g., 5-10 emails per hour per email address)
- **SMTP rate limit**: Prevents abuse from a single IP

### Step 3: Configure SMTP Settings (Optional but Recommended)

If you're on a **paid plan**, you can configure custom SMTP:

1. Go to **Project Settings** → **Auth** → **SMTP Settings**
2. Configure your SMTP provider (SendGrid, Mailgun, etc.)
3. This gives you better bounce handling and email deliverability

### Step 4: Email Templates

Customize email templates in **Authentication** → **Email Templates**:
- **Confirm signup**: Email users receive when signing up
- **Magic Link**: For passwordless login
- **Change Email Address**: Email change verification
- **Reset Password**: Password reset emails

### Step 5: Configure Redirect URLs

In **Authentication** → **URL Configuration**:
- Add your production domain to **Redirect URLs**
- Add localhost for development: `http://localhost:5173/auth`

### Current Setup in Your App

Your app already has these protections:

✅ **Email Confirmation Enabled** (`src/contexts/AuthContext.tsx`):
```typescript
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: redirectUrl  // Redirects to confirmation URL
  }
});
```

✅ **Rate Limiting** (Client-side in `src/pages/Auth.tsx`):
- Max 3 signup attempts per email per hour
- Max 2 password reset attempts per email per hour

✅ **Disposable Email Blocking** (`src/lib/emailValidation.ts`):
- Blocks 40+ known disposable email services
- Validates email format and suspicious patterns

### Additional Recommendations

#### 1. Server-Side Rate Limiting (Recommended)
Supabase has built-in rate limiting, but you can also:
- Use Supabase Edge Functions with rate limiting
- Implement CAPTCHA (like Google reCAPTCHA)

#### 2. Email Verification API (Optional)
Consider integrating services like:
- [EmailListVerify](https://emaillistverify.com/)
- [ZeroBounce](https://www.zerobounce.net/)
- [Hunter.io](https://hunter.io/)

#### 3. Database Triggers
Create a database trigger to automatically delete unverified accounts after X days:

```sql
-- Run this in Supabase SQL Editor
CREATE OR REPLACE FUNCTION delete_unverified_users()
RETURNS void AS $$
BEGIN
  DELETE FROM auth.users
  WHERE created_at < NOW() - INTERVAL '7 days'
  AND email_confirmed_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule this function to run daily
```

### Important Notes

⚠️ **Free Tier Limitations**:
- Supabase free tier has limited email sending capacity
- Custom SMTP is only available on paid plans
- Consider upgrading if you expect high volume

⚠️ **Bounce Handling**:
- Supabase automatically handles bounces when emails fail to deliver
- Repeated bounces to the same email will be blocked automatically
- You can monitor bounced emails in the Supabase Dashboard

### Testing Your Setup

1. Try signing up with a fake email (like `fake@example.com`)
2. Check Supabase Dashboard → **Authentication** → **Users**
3. You should see the user marked as "Unconfirmed"
4. The fake email won't be able to confirm, so it's effectively blocked

### Need Help?

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Email Configuration](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase SMTP Configuration](https://supabase.com/docs/guides/auth/auth-smtp)

