'use client';

import Assessment from "@/components/assessment";
import { useParams } from "next/navigation";

export default function AssessmentForm() {
  const { assessment_id } = useParams();

  return (
    <Assessment assessment_guid={assessment_id} />
  );
}