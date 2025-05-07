import { useEffect, useState } from "react";
import api from "../api";

function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const Check = async () => {
    setError(null);
    setResult("")
    setLoading(true);
    if (resume === "" || jobDescription === "") {
      setError("Both fields must be filled");
      setLoading(false);
      return;
    }
    try {
      const response = await api.post("/check", {
        resume,
        job_description: jobDescription,
      });
      if (response.status === 200) {
        setResult(response.data.result);
      }
    } catch (error: any) {
      console.error(error);
      setError("Error: Couldn’t check");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resume !== "" || jobDescription !== "") {
      setError(null);
    }
  }, [resume, jobDescription]);

  const Reset = () => {
    setError(null)
    setResult("")
    setResume("")
    setJobDescription("")
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <h1 className="text-center pt-10 font-bold text-4xl text-blue-400">
        AI Resume Analyzer
      </h1>

      <div className="flex justify-between bg-gray-800 shadow-lg my-10 mx-10 px-5 py-5 rounded-lg border border-gray-700">
        <div className="w-[50%] flex flex-col pr-5 border-r border-gray-600">
          <p className="text-center font-semibold text-lg my-2 text-blue-300">
            Resume
          </p>
          <p className="text-sm text-gray-400">Paste your resume:</p>
          <textarea
            rows={25}
            cols={100}
            placeholder="Paste your resume here..."
            className="px-3 py-2 my-5 border border-gray-600 bg-gray-700 text-white rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          ></textarea>
        </div>
        <div className="w-[50%] flex flex-col pl-5">
          <p className="text-center font-semibold text-lg my-2 text-blue-300">
            Job Description
          </p>
          <p className="text-sm text-gray-400">Paste the job description:</p>
          <textarea
            rows={25}
            cols={100}
            placeholder="Paste the job description here..."
            className="px-3 py-2 my-5 border border-gray-600 bg-gray-700 text-white rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
          onClick={Check}
          disabled={loading}
        >
          {loading ? "Checking..." : "CHECK"}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-center mt-4 font-medium">{error}</p>
      )}

      {loading && (
        <div className="flex flex-col items-center mt-5 pb-5">
          <p className="text-blue-300 mb-2">Analyzing, please wait...</p>
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {result && (
        <div>
            <div className="mt-10 pb-10 mx-10 bg-gray-800 shadow-md border border-gray-700 rounded p-5 whitespace-pre-wrap break-words">
                <p className="text-gray-100">{result}</p>
            </div>
            <div className="flex justify-center mt-10 pb-10">
                <button
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                onClick={Reset}
                >
                RESET
                </button>
            </div>
        </div>
      )}
    </div>
  );
}

export default Home;
