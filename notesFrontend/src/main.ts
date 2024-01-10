import { handleLogin } from "./user/login";
import { handleSignup } from "./user/signup";
import { createNote } from "./notes/notes";


handleLogin();
handleSignup();


document.getElementById('createNoteButton')?.addEventListener('click', createNote);
