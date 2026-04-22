import { prepareInstructions, AIResponseFormat } from 'constants';
import {useState, type FormEvent} from 'react'
import { useNavigate } from 'react-router';
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar'
import { convertPdfToImage } from '~/lib/pdf2img';
import { usePuterStore } from '~/lib/puter';
import { generateUUID } from '~/lib/utils';

const upload = () => {

    const{auth, isLoading, fs, ai, kv}=usePuterStore();
    const navigate=useNavigate();
    const[isProcessing, setIsProcessing] = useState(false);
    const[statusText, setStatusText] = useState("");
    const[file,setFile]=useState<File | null>(null);

    const handleFileSelect=(file:File | null) => {
        setFile(file);
    }

    const handleAnalyze=async({companyName, jobTitle, jobDescription, file}:{companyName:string, jobTitle:string, jobDescription:string, file:File})=>{
        setIsProcessing(true);
        setStatusText("Uploading Resume...");

        const uploadedFile=await fs.upload([file]);

        if(!uploadedFile) return setStatusText("Error: Failed to upload file");

        setStatusText("Converting to image...");
        const imageFile=await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText("Error: Failed to convert PDF to image");

        setStatusText("Uploading image...");
        const uploadedImage=await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText("Error: Failed to upload image");

        setStatusText("Analyzing resume...");

        const uuid=generateUUID();
        const data = {
            id:uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback: "",
        }
        await kv.set("resume:${uuid}", JSON.stringify(data));

        setStatusText("Generating feedback...");

        let resumeText = "";
        try {
            resumeText = await ai.img2txt(uploadedImage.path) || "";
        } catch (err) {
            console.error("Failed to extract text from resume image:", err);
        }

        let feedback;
        try {
            const feedbackPrompt = `${prepareInstructions({jobTitle, jobDescription, AIResponseFormat})}

RESUME CONTENT:
${resumeText || "Unable to extract text from image. Please refer to the attached resume image above."}`;

            feedback = await ai.feedback(
                uploadedFile.path,
                feedbackPrompt
            );
        } catch (err: any) {
            if (err && typeof err === 'object' && err.success === false) {
                return setStatusText(`Error: Failed to analyze resume - ${err.error}`);
            }
            return setStatusText("Error: Failed to analyze resume");
        }

        if(!feedback) return setStatusText("Error: Failed to analyze resume");

        let feedbackData;
        try {
            const feedbackText = typeof feedback.message?.content === 'string'
                ? feedback.message.content
                : feedback.message?.content?.[0]?.text || JSON.stringify(feedback.message?.content);

            feedbackData = typeof feedbackText === 'string' ? JSON.parse(feedbackText) : feedbackText;
        } catch {
            feedbackData = feedback.message?.content || feedback;
        }

        data.feedback = feedbackData;
        await kv.set("resume:${uuid}", JSON.stringify(data));
        setStatusText("Analysis complete!");
        console.log(data);
        navigate(`/resume/${uuid}`);
        
    }

    const handleSubmit=(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const form=e.currentTarget.closest('form');
    if(!form) return;
    const formData=new FormData(form);
    

    const companyName=formData.get('company-name');
    const jobTitle=formData.get('job-title');
    const jonDescription=formData.get('job-description');

    if(!file){
        return;
    }

    handleAnalyze({companyName: companyName as string, jobTitle: jobTitle as string, jobDescription: jonDescription as string, file});

    }
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
<Navbar />

    <section className="main-section">
        <div className="page-heading py-16">
            <h1>Smart Feedback for fullfilling your dreams</h1>
            {isProcessing ? (
                <>
                <h2>{statusText}</h2>
                <img src="/images/resume-scan.gif" className="w-full"></img>
                </>
            ) : (<h2>Drop your resume for an ATS score and some improvement tips </h2>)}
            {!isProcessing && (
                <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                    <div className="form-div">
                        <label htmlFor="company-name">Company Name</label>
                        <input type="text" name="company-name" placeholder="Company Name here" id="company-name"></input>
                    </div>
                    <div className="form-div">
                        <label htmlFor="job-title">Job Title</label>
                        <input type="text" name="job-title" placeholder="Job Title here" id="job-title"></input>
                    </div>
                    <div className="form-div">
                        <label htmlFor="job-description">Job Description</label>
                        <textarea rows={5} name="job-description" placeholder="Job Description here" id="job-description"></textarea>
                    </div>
                          <div className="form-div">
                        <label htmlFor="uploader">Upload Resume</label>
                      <FileUploader onFileSelect={handleFileSelect}/>
                    </div>
                    <button className="primary-button" type="submit">
                        Analyze Resume
                    </button>
                </form>
            )}
        </div>

    </section>
    </main>
  )
}

export default upload
