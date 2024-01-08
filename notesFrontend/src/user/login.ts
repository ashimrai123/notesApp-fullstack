import axios from 'axios';

//----------------------------------- LOGIN FORM ---------------------------------------------//


export function handleLogin(){
    
document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
  
    const loginData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };
  
  
    try{
      const response = await axios.post('http://localhost:8000/login',loginData);
      console.log('login successful', response.data);
      // Redirect to the notes page
    window.location.href = '../notes.html';
    }
    catch( error: any) {
      console.error('Error during login ', error.response.data);
  
    }
  });
  

}
  