import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";


const ResumeCard = ({resume : { id, companyName, jobTitle, feedback, imagePath }}:{resume : Resume}) => {
  return (
    <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
       
       <div className="flex flex-row justify-between items-center gap-2">
        <div className="flex flex-col gap-1">
            <h2 className="!text-black font-bold break-words">{companyName}</h2>
            <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
        </div>
        <div className="flex-shrink-0">
            <ScoreCircle score={feedback.overallScore}/>
        </div>
        </div>
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img src={imagePath}
            alt="resume"
            className="w-full h-full object-cover object-top rounded-xl">
            </img>
          </div>

        </div>
    </Link>
  )
}

export default ResumeCard