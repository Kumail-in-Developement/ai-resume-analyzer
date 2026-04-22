import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => {
  return [
    { title: "Resume Analyzer | Auth" },
    { name: "description", content: "Login or Sign up to access your dashboard" },
  ];
}

const auth = () => {

    const {isLoading, auth} = usePuterStore();

    const location=useLocation();// Get the current location to access query parameters
    const next=location.search.split('next=')[1] ?? '/';// Extract the next page from the query parameter, if available
    const navigate=useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);// Redirect to the next page after successful authentication
    }, [auth.isAuthenticated,next])
    
  return (
    <main className="bg-[url('/images/bg-auth.svg)] bg-cover min-h-screen flex items-center justify-center">
        <div className="gradient-border shadow-lg">
            <section className="flex flex-col gap-8 bg-white rounder-2xl p-10">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1>Welcome</h1>
                    <h2>Log In to Continue Your Job Journey</h2>
                </div>
                <div>{isLoading ?(
                    <button className="auth-button animate-pulse">
                        <p>
                            Signing you in...
                        </p>
                    </button>
                ): (
                    <>
                    {auth.isAuthenticated ? (
                        <button className="auth-button" onClick={auth.signOut}>
                            Log Out
                        </button>): (
                            <button className="auth-button" onClick={auth.signIn}>
                                <p>Log In</p>
                            </button>
                        )}
                    </>
                )}</div>
            </section>
        </div>
    </main>
  )
}

export default auth