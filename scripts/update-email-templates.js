// This script updates the Supabase email templates
// Run with: node scripts/update-email-templates.js
// You need to set SUPABASE_ACCESS_TOKEN and PROJECT_REF environment variables

const fetch = require('node-fetch');

// Get your access token from https://supabase.com/dashboard/account/tokens
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
// Get your project ref from your Supabase project URL: https://<PROJECT_REF>.supabase.co
const PROJECT_REF = process.env.PROJECT_REF;

if (!SUPABASE_ACCESS_TOKEN || !PROJECT_REF) {
  console.error('Please set SUPABASE_ACCESS_TOKEN and PROJECT_REF environment variables');
  process.exit(1);
}

// Company name and branding
const COMPANY_NAME = 'Secretary AI';
const PRIMARY_COLOR = '#0f172a'; // Dark blue
const ACCENT_COLOR = '#4f46e5'; // Indigo
const LOGO_URL = 'https://yourdomain.com/logo.png'; // Replace with your actual logo URL

// Email templates
const templates = {
  // Confirmation email template (when user registers)
  confirmation: {
    subject: `Confirmă adresa de email pentru ${COMPANY_NAME}`,
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmă adresa de email</title>
  <style>
    body { 
      font-family: 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eaeaea;
    }
    .content {
      padding: 30px 0;
    }
    .footer {
      text-align: center;
      color: #888;
      font-size: 12px;
      padding: 20px 0;
      border-top: 1px solid #eaeaea;
    }
    .button {
      display: inline-block;
      background-color: ${ACCENT_COLOR};
      color: white !important;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 4px;
      font-weight: bold;
      margin: 20px 0;
    }
    .code {
      background-color: #f4f4f4;
      padding: 12px;
      font-family: monospace;
      font-size: 18px;
      letter-spacing: 2px;
      text-align: center;
      margin: 20px 0;
      border-radius: 4px;
    }
    h1 { color: ${PRIMARY_COLOR}; }
    a { color: ${ACCENT_COLOR}; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${COMPANY_NAME}</h1>
    </div>
    <div class="content">
      <h2>Confirmă adresa de email</h2>
      <p>Mulțumim pentru înregistrare! Pentru a activa contul tău, te rugăm să confirmi adresa de email folosind butonul de mai jos:</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Confirmă adresa de email</a>
      </div>
      
      <p>Alternativ, poți introduce acest cod de confirmare:</p>
      <div class="code">{{ .Token }}</div>
      
      <p>Dacă nu te-ai înregistrat pe ${COMPANY_NAME}, te rugăm să ignori acest email.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. Toate drepturile rezervate.</p>
      <p>Acest email a fost trimis către {{ .Email }}</p>
    </div>
  </div>
</body>
</html>
    `
  },
  
  // Magic link email template
  magic_link: {
    subject: `Link-ul tău magic pentru ${COMPANY_NAME}`,
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Link-ul tău magic</title>
  <style>
    body { 
      font-family: 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eaeaea;
    }
    .content {
      padding: 30px 0;
    }
    .footer {
      text-align: center;
      color: #888;
      font-size: 12px;
      padding: 20px 0;
      border-top: 1px solid #eaeaea;
    }
    .button {
      display: inline-block;
      background-color: ${ACCENT_COLOR};
      color: white !important;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 4px;
      font-weight: bold;
      margin: 20px 0;
    }
    .code {
      background-color: #f4f4f4;
      padding: 12px;
      font-family: monospace;
      font-size: 18px;
      letter-spacing: 2px;
      text-align: center;
      margin: 20px 0;
      border-radius: 4px;
    }
    h1 { color: ${PRIMARY_COLOR}; }
    a { color: ${ACCENT_COLOR}; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${COMPANY_NAME}</h1>
    </div>
    <div class="content">
      <h2>Link-ul tău magic de autentificare</h2>
      <p>Ai solicitat un link magic pentru a te autentifica în contul tău. Apasă pe butonul de mai jos pentru a te autentifica:</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Autentificare</a>
      </div>
      
      <p>Alternativ, poți folosi acest cod de unică folosință:</p>
      <div class="code">{{ .Token }}</div>
      
      <p>Dacă nu ai solicitat acest email, te rugăm să îl ignori.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. Toate drepturile rezervate.</p>
      <p>Acest email a fost trimis către {{ .Email }}</p>
    </div>
  </div>
</body>
</html>
    `
  },
  
  // Password recovery email template
  recovery: {
    subject: `Resetare parolă pentru ${COMPANY_NAME}`,
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resetare parolă</title>
  <style>
    body { 
      font-family: 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eaeaea;
    }
    .content {
      padding: 30px 0;
    }
    .footer {
      text-align: center;
      color: #888;
      font-size: 12px;
      padding: 20px 0;
      border-top: 1px solid #eaeaea;
    }
    .button {
      display: inline-block;
      background-color: ${ACCENT_COLOR};
      color: white !important;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 4px;
      font-weight: bold;
      margin: 20px 0;
    }
    .code {
      background-color: #f4f4f4;
      padding: 12px;
      font-family: monospace;
      font-size: 18px;
      letter-spacing: 2px;
      text-align: center;
      margin: 20px 0;
      border-radius: 4px;
    }
    h1 { color: ${PRIMARY_COLOR}; }
    a { color: ${ACCENT_COLOR}; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${COMPANY_NAME}</h1>
    </div>
    <div class="content">
      <h2>Resetare parolă</h2>
      <p>Ai solicitat resetarea parolei pentru contul tău. Apasă pe butonul de mai jos pentru a seta o nouă parolă:</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Resetează parola</a>
      </div>
      
      <p>Alternativ, poți folosi acest cod de unică folosință:</p>
      <div class="code">{{ .Token }}</div>
      
      <p>Dacă nu ai solicitat resetarea parolei, te rugăm să ignori acest email sau să contactezi echipa noastră de suport.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. Toate drepturile rezervate.</p>
      <p>Acest email a fost trimis către {{ .Email }}</p>
    </div>
  </div>
</body>
</html>
    `
  },
  
  // Invite email template
  invite: {
    subject: `Ai fost invitat să te alături la ${COMPANY_NAME}`,
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitație</title>
  <style>
    body { 
      font-family: 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eaeaea;
    }
    .content {
      padding: 30px 0;
    }
    .footer {
      text-align: center;
      color: #888;
      font-size: 12px;
      padding: 20px 0;
      border-top: 1px solid #eaeaea;
    }
    .button {
      display: inline-block;
      background-color: ${ACCENT_COLOR};
      color: white !important;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 4px;
      font-weight: bold;
      margin: 20px 0;
    }
    h1 { color: ${PRIMARY_COLOR}; }
    a { color: ${ACCENT_COLOR}; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${COMPANY_NAME}</h1>
    </div>
    <div class="content">
      <h2>Ai fost invitat!</h2>
      <p>Ai fost invitat să te alături la ${COMPANY_NAME}. Pentru a accepta invitația și a-ți crea contul, apasă pe butonul de mai jos:</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Acceptă invitația</a>
      </div>
      
      <p>Dacă nu te așteptai la această invitație, te rugăm să o ignori.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. Toate drepturile rezervate.</p>
      <p>Acest email a fost trimis către {{ .Email }}</p>
    </div>
  </div>
</body>
</html>
    `
  },
  
  // Email change template
  email_change: {
    subject: `Confirmă schimbarea adresei de email pentru ${COMPANY_NAME}`,
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmă schimbarea adresei de email</title>
  <style>
    body { 
      font-family: 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eaeaea;
    }
    .content {
      padding: 30px 0;
    }
    .footer {
      text-align: center;
      color: #888;
      font-size: 12px;
      padding: 20px 0;
      border-top: 1px solid #eaeaea;
    }
    .button {
      display: inline-block;
      background-color: ${ACCENT_COLOR};
      color: white !important;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 4px;
      font-weight: bold;
      margin: 20px 0;
    }
    .code {
      background-color: #f4f4f4;
      padding: 12px;
      font-family: monospace;
      font-size: 18px;
      letter-spacing: 2px;
      text-align: center;
      margin: 20px 0;
      border-radius: 4px;
    }
    h1 { color: ${PRIMARY_COLOR}; }
    a { color: ${ACCENT_COLOR}; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${COMPANY_NAME}</h1>
    </div>
    <div class="content">
      <h2>Confirmă schimbarea adresei de email</h2>
      <p>Ai solicitat schimbarea adresei de email de la <strong>{{ .Email }}</strong> la <strong>{{ .NewEmail }}</strong>.</p>
      <p>Pentru a confirma această schimbare, apasă pe butonul de mai jos:</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Confirmă schimbarea</a>
      </div>
      
      <p>Alternativ, poți folosi acest cod de unică folosință:</p>
      <div class="code">{{ .Token }}</div>
      
      <p>Dacă nu ai solicitat această schimbare, te rugăm să ignori acest email și să îți verifici contul.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. Toate drepturile rezervate.</p>
      <p>Acest email a fost trimis către {{ .Email }}</p>
    </div>
  </div>
</body>
</html>
    `
  }
};

// Update the email templates
async function updateEmailTemplates() {
  try {
    console.log('Updating email templates...');
    
    const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Confirmation email (signup)
        mailer_subjects_confirmation: templates.confirmation.subject,
        mailer_templates_confirmation_content: templates.confirmation.content,
        
        // Magic link email
        mailer_subjects_magic_link: templates.magic_link.subject,
        mailer_templates_magic_link_content: templates.magic_link.content,
        
        // Password recovery email
        mailer_subjects_recovery: templates.recovery.subject,
        mailer_templates_recovery_content: templates.recovery.content,
        
        // Invite email
        mailer_subjects_invite: templates.invite.subject,
        mailer_templates_invite_content: templates.invite.content,
        
        // Email change confirmation
        mailer_subjects_email_change: templates.email_change.subject,
        mailer_templates_email_change_content: templates.email_change.content
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to update email templates: ${JSON.stringify(error)}`);
    }
    
    console.log('Email templates updated successfully!');
  } catch (error) {
    console.error('Error updating email templates:', error);
    process.exit(1);
  }
}

updateEmailTemplates();
