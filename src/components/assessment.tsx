'use client';

import { assessmentService } from "@/services/assessment.service";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./auth-context";
import Loader from "./loader";
import { QuestionAndAnswer } from "../domain";

const Assessment = ({ assessment_guid }: { assessment_guid: string | string[] | undefined }) => {
  const hasRun = useRef(false);
  const { redirectToHomePage } = useAuth();
  const [questionAndAnswers, setQuestionAndAnswers] = useState<QuestionAndAnswer[]>([]);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoader] = useState(true);

  useEffect(() => {
    const getAssessmentData = async () => {
      setLoader(true);
      const response = await assessmentService.getAssessmentData(assessment_guid as string, redirectToHomePage);
      setLoader(false);
      if (response.success && response.data) {
        const qnas = response.data.map((q: string) => { return { question: q, answer: '' }; });
        setQuestionAndAnswers(qnas);
      }
    }
    if (!hasRun.current) {
      getAssessmentData();
      hasRun.current = true;
    }
  }, [assessment_guid, redirectToHomePage]);

  const handleChange = async (answer: string, index: number) => {

    const updatedQNAs = [...questionAndAnswers];

    if (updatedQNAs[index]) {
      updatedQNAs[index].answer = answer;
    }

    setQuestionAndAnswers(updatedQNAs);
  }

  const handleSave = async (isContinue = false) => {
    setErrMsg('');
    let isError = false;

    questionAndAnswers.forEach(qna => {
      if (qna.answer.trim() == '') {
        isError = true;
      }
      return;
    });

    if (isError) {
      setErrMsg('*Answer all');
      return;
    }
    setLoader(true);
    const response = await assessmentService.submitAssessData(assessment_guid as string, questionAndAnswers, isContinue, redirectToHomePage);
    setLoader(false);
    if (response.success && response.data) {
      const qnas = response.data.map((q: string) => { return { question: q, answer: '' }; });
      setQuestionAndAnswers(qnas);
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex items-center justify-center min-height bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        {questionAndAnswers.map((qna, index) => (
          <div key={index} className="mb-2">
            <h2 className="text-sm font-semibold text-gray-800">
              {qna.question}
            </h2>

            <div className="mt-1">
              <textarea
                rows={2}
                value={qna.answer}
                className="resize-none text-sm w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(event) => handleChange(event.target.value, index)}
              ></textarea>
            </div>
          </div>
        ))}

        <div className="mt-4 flex justify-end">
          {errMsg && <div className="m-auto text-center text-sm text-red-500">{errMsg}</div>}
          <button
            type="button"
            className="px-6 py-2 font-medium text-blue-500 mr-4 bg-white-600 border-2 border-blue-500 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={async () => await handleSave(true)}
          >
            Save & More
          </button>
          <button
            type="button"
            className="px-6 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={async () => await handleSave(false)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Assessment;