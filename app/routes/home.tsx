import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import resume from "./resume";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Analyzer" },
    { name: "description", content: "Smart feed back for your career!" },
  ];
}

export default function Home() {


    const { auth} = usePuterStore();

    const navigate=useNavigate();

    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/');// Redirect to the auth page if the user is not authenticated
    }, [auth.isAuthenticated])

    useEffect(() => {
      const loadResume: () => Promise<void> = async () => {
        const blob : Blob = await fs.read(resume.imagePath);
        if(!blob) return;
        let url = URL.createObjectURL(blob);
      }

    }, [])

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
<Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track your Applications and Resume Ratings</h1>
        <h2>Review submissions and check AI-powered feedback</h2>
      </div>

  

  {resumes.length>0 &&(

  <div className="resumes-section">
  {resumes.map( (resume) => (
    <ResumeCard key={resume.id} resume={resume}/>
  ))}
  </div>

  )}

 </section>
  </main>
}
