import axios from 'axios';


//----------------------------------- SIGN UP FORM ---------------------------------------------//

export function handleSignup(){
    
document.getElementById('signupForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);


  const userData = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  try{
    const response = await axios.post('http://localhost:8000/signup', userData);
    console.log('Signup successful', response.data);
  }
  catch(error: any){
    console.log('Error during Signup', error.response.data);
  }
});

} 

