import { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { usePuterStore } from "~/lib/puter";


const ResumeCard = ({resume : { id, companyName, jobTitle, feedback, imagePath }}:{resume : Resume}) => {


      const [resumeUrl,setResumeUrl] = useState('');
      const { fs } = usePuterStore();

  useEffect(() => {
      const loadResume: () => Promise<void> = async () => {
        const blob = await fs.read(imagePath);
        if(!blob) return;
        let url = URL.createObjectURL(blob);
        setResumeUrl(url);
      }

      loadResume();

    }, [imagePath]);

  return (
    <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
       
       <div className="flex flex-row justify-between items-center gap-2">
        <div className="flex flex-col gap-1">
            {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
            {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
            {!companyName && !jobTitle && <h2 className="!text-black font-bold break-words">Resume</h2>}
        </div>
        <div className="flex-shrink-0">
            <ScoreCircle score={feedback.overallScore}/>
        </div>
        </div>
        {resumeUrl && 
        (<div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img 
            src={resumeUrl}
            alt="resume"
            className="w-full h-full object-cover object-top rounded-xl">
            </img>
          </div>

        </div>
        )}
    </Link>
  )
}

export default ResumeCard
