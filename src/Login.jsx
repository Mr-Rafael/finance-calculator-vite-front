import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputLabel from './components/InputLabel'
import TextInput from './components/TextInput'

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/app/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password
      })
    });

    if (res.ok) {
      console.log("Login was successful. Navigating to savigs.")
      localStorage.setItem("loggedIn", "true");
      navigate("/savings");
    } else {
      alert("Login failed");
    }
  }

  return (
    <main className='w-full'>
              <section className='max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800'>
                <h2 className='text-2xl font-bold text-gray-800 mb-4'>
                  Welcome to Finance Calculator!
                </h2>
                <form>
                  <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-1'>
                    <div>
                      <InputLabel>Email:</InputLabel>
                      <TextInput
                        type='text'
                        placeholder='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <InputLabel>
                        Password:
                      </InputLabel>
                      <TextInput
                        type='text'
                        placeholder='Password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='mt-6'>
                    <button
                      type='button'
                      onClick={handleSubmit}
                      className='w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50'
                    >
                      Login
                    </button>
                  </div>
                </form>
              </section>
            </main>
  );
}