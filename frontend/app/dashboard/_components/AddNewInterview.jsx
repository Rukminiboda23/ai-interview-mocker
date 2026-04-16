"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobExperience, setJobExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  // UPDATED: This is the new onSubmit function
  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // Fetch questions from your ML API proxy
    const res = await fetch("/api/ml/get-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobrole: jobPosition,
        jobdesc: jobDesc,
        years: jobExperience
      }),
    });
    const data = await res.json();

// Check for backend error message first
if (data.error) {
  alert(data.error); // This will show "Experience cannot be negative" if that's the error
  setLoading(false);
  return;
}

  const questions = data.questions; 

    if (questions && questions.length > 0) {
      // Save to DB as before
      const resp = await db.insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(questions),
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-yyyy')
        })
        .returning({ mockId: MockInterview.mockId });

      if (resp) {
        setOpenDialog(false);
        router.push('/dashboard/interview/' + resp[0]?.mockId);
      }
    } else {
      alert("No questions found for this role/experience.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div
        className="min-h-[150px] p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer flex items-center justify-center"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          className="max-w-[600px] min-h-[450px] rounded-lg border bg-white shadow-xl p-6 z-50"
          style={{ backgroundColor: "white" }}
        >
          <DialogHeader className="flex flex-col gap-2 text-left sm:text-left">
            <DialogTitle className="text-xl font-semibold" style={{ marginLeft: "20px", marginBottom: "2px", marginTop: "20px" }}>
              Tell us more about your job interviewing
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-700 " style={{ marginLeft: "25px", marginBottom: "40px", marginTop: "3px", fontSize: "14px" }}>
              Add Details about your job position/role, job description and years of experience
            </DialogDescription>
          </DialogHeader>

          {/* Form Inputs */}
          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ marginLeft: "20px", marginBottom: "5px" }}>Job Role/Job Position</label>
              <Input
                placeholder="Ex. Full Stack Developer"
                className="w-6/7 px-3 text-sm border rounded-md"
                style={{ height: "40px", marginLeft: "25px", marginBottom: "20px" }}
                value={jobPosition || ''}
                onChange={e => setJobPosition(e.target.value)}
                required
              />
            </div> */}

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              style={{ marginLeft: "20px", marginBottom: "5px" }}
            >
              Job Role/Job Position
            </label>
            <select
              className="w-6/7 px-3 text-sm border rounded-md"
              style={{ height: "40px", marginLeft: "25px", marginBottom: "20px" }}
              value={jobPosition}
              onChange={e => setJobPosition(e.target.value)}
              required
            >
              <option value="" disabled>Select a job role</option>
              <option value="Full-Stack Development">Full-Stack Development</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Software Testing & QA">Software Testing & QA</option>
              <option value="Networking & System Administration">Networking & System Administration</option>
              <option value="Mobile App Development">Mobile App Development</option>
              <option value="Database Administration">Database Administration</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Embedded Systems & IoT">Embedded Systems & IoT</option>
              <option value="DevOps">DevOps</option>
              <option value="Data Science">Data Science</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="Blockchain Development">Blockchain Development</option>
              <option value="Backend Development">Backend Development</option>
            </select>
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ marginLeft: "20px", marginBottom: "5px" }}>Job Description/ Tech Stack (in Short)</label>
              <Textarea
                placeholder="Ex. React, Angular, NodeJs, MySql etc"
                className="w-6/7 px-3 text-sm border rounded-md"
                style={{ minHeight: "80px", marginLeft: "25px", marginBottom: "20px" }}
                value={jobDesc || ''}
                onChange={e => setJobDesc(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ marginLeft: "20px", marginBottom: "5px" }}>Years of experience</label>
              <Input
                placeholder="Ex. 5"
                type="number"
                className="w-6/7 px-3 text-sm border rounded-md"
                style={{ height: "40px", marginLeft: "25px", marginBottom: "20px" }}
                value={jobExperience || ''}
                onChange={e => setJobExperience(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-4" style={{ margin: "5px", padding: "5px" }}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog(false)}
                className="text-sm px-4 py-2"
                style={{ margin: "5px 5px", padding: "8px 20px" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="text-sm px-4 py-2 bg-[#5c4bff] text-white hover:bg-[#4438cae0]"
                style={{ margin: "5px 5px", padding: "8px 25px" }}
              >
                {loading ?
                  <>
                    <svg
                      className="animate-spin inline-block mr-2"
                      width="20"
                      height="20"
                      viewBox="0 0 50 50"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="#ffffff"
                    >
                      <circle
                        cx="25"
                        cy="25"
                        r="20"
                        strokeWidth="5"
                        strokeLinecap="round"
                        opacity="0.2"
                      />
                      <circle
                        cx="25"
                        cy="25"
                        r="20"
                        strokeWidth="5"
                        strokeLinecap="round"
                        stroke="#ffffff"
                        strokeDasharray="31.4 31.4"
                        strokeDashoffset="31.4"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="31.4"
                          to="0"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </svg>
                    <span style={{ color: "black", fontWeight: "600" }}>Generating questions</span>
                  </> : 'Start Interview'
                }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;

