import { Card } from "@/components/ui/card"
import UploadForm from "@/components/upload-form"
import DashboardNav from "@/components/dashboard-nav"

export default function UploadPage() {
  return (
    <div className="relative min-h-screen bg-[#0d1117] text-white">
      {/* Blue sunshine effect at the top */}
      <div className="absolute left-0 right-0 top-0 h-64 w-full overflow-hidden">
        <div className="absolute -top-20 left-1/2 h-40 w-[800px] -translate-x-1/2 transform rounded-[100%] bg-blue-600/10 blur-3xl"></div>
      </div>

      {/* Navigation */}
      <DashboardNav />

      {/* Upload content - with padding-top to prevent overlap with fixed nav */}
      <div className="mx-auto max-w-xl px-4 py-16 pt-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Upload X-ray Image</h1>
          <p className="mt-2 text-sm text-gray-400">Upload your X-ray image for secure, privacy-compliant analysis</p>
        </div>

        <Card className="border-gray-800/40 bg-gray-900/30 p-6 shadow-lg">
          <UploadForm />
        </Card>

        <div className="mt-8 rounded-lg bg-blue-950/30 p-4 text-sm text-blue-200">
          <p className="font-medium">Privacy Notice</p>
          <p className="mt-2">
            All uploaded X-ray images are processed securely using our privacy-compliant AI system. Your data is
            encrypted and automatically deleted after analysis.
          </p>
        </div>
      </div>
    </div>
  )
}

