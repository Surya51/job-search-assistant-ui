'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';
import { uploadService } from '@/services/upload.service';
import Loader from './loader';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJD] = useState('');
  const [message, setErrorMessage] = useState('');
  const [selected, setSelected] = useState('');
  const [previousAssessment, setPreviousAssessment] = useState({ guid: '', file_path: '' });
  const router = useRouter();
  const { redirectToHomePage } = useAuth();

  const allowedExtensions = ["pdf"]; // remaining extensions like docx and all can be handled too.

  useEffect(() => {
    const getData = async () => {
      const response = await uploadService.getPreviousData(redirectToHomePage);
      if (response.success && response.hasData) {
        setPreviousAssessment(response.data);
      }
      else {
        setSelected('NewResume');
      }
    }
    getData();
  }, [redirectToHomePage]); // this is on component load

  const handleSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files ? event.target.files[0] : null;
    if (newFile) {
      const fileExtension = newFile.name.split('.').pop()?.toLowerCase() ?? '';
      if (allowedExtensions.includes(fileExtension)) {
        setFile(newFile);
        setErrorMessage("");
      } else {
        setFile(null);
        setErrorMessage(`Invalid file type. Only ${allowedExtensions.join(", ")} are allowed.`);
      }
    }
  };

  const handleJDChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJD(event.target.value);
  };

  const handleUpload = async (event: React.MouseEvent) => {
    event.preventDefault();
    setErrorMessage('');

    if (!selected) {
      setErrorMessage("Please select an option.");
    }

    if (selected == 'PrevResumeAndJD') {
      router.push(`/assessment/${previousAssessment.guid}`);
      return;
    }

    const formData = new FormData();
    if (selected == 'NewResume' && !file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    if (selected != 'PrevResumeAndJD' && !jd) {
      setErrorMessage('Please add the job description.');
    }

    if (selected == 'NewResume' && file) {
      formData.append('file', file);
    }
    if (selected == 'PrevResume' && previousAssessment.file_path) {
      formData.append('prev_file_path', previousAssessment.file_path);
    }
    formData.append('jd', jd);

    try {
      const response = await uploadService.uploadResumeJD(formData, redirectToHomePage);
      if (response.success) {
        router.push(`/assessment/${response.data.assessment_guid}`);
      }
    } catch (error) {
      setErrorMessage(`Error uploading file: ${error}}`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newFile = e.dataTransfer.files[0];
    if (newFile.type === "application/pdf") {
      setFile(newFile);
      setErrorMessage('');
    }
    else {
      setErrorMessage('Only PDF files are allowed.');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const isAssessEnabled = () => {
    return selected === "PrevResumeAndJD" ||
      (selected === "NewResume" && file && jd)
      || (selected === "PrevResume" && jd);
  };

  if (!previousAssessment.file_path || !previousAssessment.file_path) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-height bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-2/5">
        <h2 className="text-lg text-center font-bold mb-4">Upload Resume</h2>
        {previousAssessment.guid &&
          <div className='mb-4'>
            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="options"
                value="PrevResumeAndJD"
                checked={selected === "PrevResumeAndJD"}
                onChange={handleSelectionChange}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Assess with previous uploaded resume and job description.</span>
            </label>
            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="options"
                value="PrevResume"
                checked={selected === "PrevResume"}
                onChange={handleSelectionChange}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Use previous uploaded resume.</span>
            </label>
            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="options"
                value="NewResume"
                checked={selected === "NewResume"}
                onChange={handleSelectionChange}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Upload new resume</span>
            </label>
          </div>}
        {selected === "NewResume" &&
          <div
            className="w-full max-w-lg mb-2 p-6 border-2 border-dashed rounded-lg shadow-sm bg-white text-center hover:shadow-md transition-all cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              multiple={false}
              accept='.pdf'
              id="fileInput"
            />
            <label htmlFor="fileInput" className="flex flex-col items-center">
              <p className="text-gray-500">Drag & drop file here or click to browse</p>
              <p className="text-sm text-gray-400 mt-1">Supported formats: .pdf</p>
            </label>
          </div>
        }

        {selected === "NewResume" && file &&
          <div className="mb-4 w-full max-w-lg bg-white rounded-lg shadow-md p-4">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Selected File</h4>
            <ul className="space-y-2">
              <li className="flex items-center justify-between text-sm text-gray-600 border-b pb-2"
              >
                <span>{file?.name}</span>
                <span className="text-xs text-gray-400">{((file?.size ?? 0) / 1024).toFixed(2)} KB</span>
              </li>
            </ul>
          </div>
        }

        {selected && selected !== "PrevResumeAndJD" && <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description:
          </label>
          <textarea
            value={jd}
            onChange={handleJDChange}
            rows={6}
            placeholder="Enter Job Description"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
          ></textarea>
        </div>}
        <button
          disabled={!isAssessEnabled()}
          onClick={handleUpload}
          className={`w-full bg-blue-500 text-white py-2 px-4 mb-4 rounded transition
            ${isAssessEnabled()
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Assess
        </button>
        {message && <div className="-mt-1 -mb-4 text-center text-sm text-red-500">{message}</div>}
      </div>
    </div>
  );
};

export default FileUpload;