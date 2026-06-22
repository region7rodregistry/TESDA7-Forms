"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SiteCredit } from "@/components/site/SiteCredit";

export default function InstructionsPage() {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col bg-tesda-panel">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.175, 0.885, 0.32, 1.275] }}
        className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[rgba(10,36,99,0.85)] p-8 text-sky-50 shadow-2xl backdrop-blur sm:p-10"
      >
        <div className="mb-8 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-sky-400">
            User Agreement
          </span>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">NTTC Form User Agreement</h1>
        </div>

        <div className="flex gap-5">
          <div className="hidden size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-800 text-white sm:flex">
            <FileText className="size-6" />
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-sky-100/90">
            <div>
              <p className="font-semibold text-white">Accuracy of Information</p>
              <p>
                I certify that all information and documents I provide through this form are true,
                correct, and complete to the best of my knowledge. I understand that I am solely
                responsible for the accuracy and authenticity of what I submit.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">Liability for Falsified Documents</p>
              <p>
                I acknowledge that submitting falsified, tampered, or fraudulent documents is
                strictly prohibited and may result in:
              </p>
              <ul className="ml-5 mt-1 list-disc space-y-1">
                <li>Immediate rejection of my application;</li>
                <li>Administrative and/or legal action under existing laws and regulations;</li>
                <li>Possible disqualification from future applications with TESDA.</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white">Submission to the Provincial Office</p>
              <p>
                I understand that the information I submit will be forwarded to the concerned TESDA
                Provincial Office for verification and processing, and I consent to its use for
                official NTTC evaluation, validation, and monitoring.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">Agreement to Terms</p>
              <p>
                By ticking the checkbox below and proceeding, I signify that I have read, understood,
                and voluntarily agreed to be bound by this User Agreement.
              </p>
            </div>

            <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg bg-white/5 p-3">
              <Checkbox
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
                className="border-sky-300 data-[checked]:bg-sky-500"
              />
              <span>I have read and agree to the NTTC Form User Agreement.</span>
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            disabled={!agreed}
            onClick={() => router.push("/form")}
            size="lg"
            className="rounded-full px-7"
          >
            Proceed to Form <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>
        </motion.div>
      </div>

      <SiteCredit />
    </main>
  );
}
