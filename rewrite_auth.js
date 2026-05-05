const fs = require('fs');

let authCode = fs.readFileSync('pages/auth.html', 'utf8');

// Replace signup logic
const signUpStart = authCode.indexOf('window.signUp = async () => {');
const signUpEnd = authCode.indexOf('window.signIn = async () => {');

const newSignUpCode = `window.signUp = async () => {
  if (authBusy) return;

  const role = selectedRole;
  const userPayload = {
    name: document.getElementById('su-name').value.trim(),
    email: document.getElementById('su-email').value.trim().toLowerCase(),
    password: document.getElementById('su-pass').value,
    role,
    profile: {
      city: document.getElementById('su-city').value.trim(),
      college: role === 'student' ? document.getElementById('su-college').value.trim() : '',
      year: role === 'student' ? document.getElementById('su-year').value : '',
      area: role === 'student' ? document.getElementById('su-area').value : '',
      l_qual: role === 'lawyer' ? document.getElementById('su-l-qual').value.trim() : '',
      l_spec: role === 'lawyer' ? document.getElementById('su-l-spec').value.trim() : '',
      l_exp: role === 'lawyer' ? document.getElementById('su-l-exp').value.trim() : '',
      l_loc: role === 'lawyer' ? document.getElementById('su-l-loc').value.trim() : '',
      l_fees: role === 'lawyer' ? document.getElementById('su-l-fees').value.trim() : '',
      l_bio: role === 'lawyer' ? document.getElementById('su-l-bio').value.trim() : ''
    }
  };

  if (!userPayload.name || !userPayload.email || !userPayload.password || !userPayload.profile.city) {
    showToast('Please fill all required fields', '!');
    return;
  }
  if (!isValidEmail(userPayload.email)) {
    showToast('Please enter a valid email address', '!');
    return;
  }
  if (userPayload.password.length < 8) {
    showToast('Password must be at least 8 characters', '!');
    return;
  }
  if (role === 'student' && (!userPayload.profile.college || !userPayload.profile.year || !userPayload.profile.area)) {
    showToast('Please complete your student details', '!');
    return;
  }
  if (role === 'lawyer' && (!userPayload.profile.l_qual || !userPayload.profile.l_spec || !userPayload.profile.l_exp || !userPayload.profile.l_loc || !userPayload.profile.l_fees)) {
    showToast('Please complete your lawyer details', '!');
    return;
  }

  setAuthLoading('signup', true);
  
  try {
    const res = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userPayload)
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create account');
    
    saveCurrentUser(data.user);
    localStorage.setItem('nyaysetu_token', data.token);
    showToast('Account created successfully', 'OK');
    setTimeout(() => redirectAfterAuth(data.user), 450);
  } catch (err) {
    showToast(err.message, '!');
    setAuthLoading('signup', false);
  }
};

`;

authCode = authCode.slice(0, signUpStart) + newSignUpCode + authCode.slice(signUpEnd);

// Replace login logic
const signInStart = authCode.indexOf('window.signIn = async () => {');
const signInEnd = authCode.indexOf('window.resetPass = () => {');

const newSignInCode = `window.signIn = async () => {
  if (authBusy) return;

  const email = document.getElementById('si-email').value.trim().toLowerCase();
  const password = document.getElementById('si-pass').value;

  if (!email || !password) {
    showToast('Please fill in all fields', '!');
    return;
  }
  if (!isValidEmail(email)) {
    showToast('Please enter a valid email address', '!');
    return;
  }

  setAuthLoading('signin', true);
  
  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    
    saveCurrentUser(data.user);
    localStorage.setItem('nyaysetu_token', data.token);
    showToast('Signed in successfully', 'OK');
    setTimeout(() => redirectAfterAuth(data.user), 450);
  } catch (err) {
    showToast(err.message, '!');
    setAuthLoading('signin', false);
  }
};

`;

authCode = authCode.slice(0, signInStart) + newSignInCode + authCode.slice(signInEnd);

// Remove local storage user saving logic references except saveCurrentUser
authCode = authCode.replace('upsertSavedUser(user);', '');
authCode = authCode.replace('if (getSavedUsers().some(saved => saved.email.toLowerCase() === user.email)) {\n      showToast(\'An account with this email already exists\', \'!\');\n      return;\n    }', '');

fs.writeFileSync('pages/auth.html', authCode);
console.log('auth.html updated!');
