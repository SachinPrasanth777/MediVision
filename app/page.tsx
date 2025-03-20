import { Upload } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import DashboardNav from "@/components/dashboard-nav"
import SimpleFeaturedContent from "@/components/simple-featured-content"

export default function Dashboard() {
  return (
    <div className="relative min-h-screen bg-[#0d1117] text-white">
      {/* Blue sunshine effect at the top */}
      <div className="absolute left-0 right-0 top-0 h-64 w-full overflow-hidden">
        <div className="absolute -top-20 left-1/2 h-40 w-[800px] -translate-x-1/2 transform rounded-[100%] bg-blue-600/10 blur-3xl"></div>
      </div>

      {/* Navigation */}
      <DashboardNav />

      {/* Hero section - with padding-top to prevent overlap with fixed nav */}
      <div className="relative w-full pt-16">
        {/* Content positioned with proper padding */}
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
          <h1 className="mb-8 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">MedVision AI</h1>
          <p className="mx-auto max-w-2xl text-base text-gray-300 sm:text-lg">
            Leverage privacy-compliant GAN-generated X-rays to overcome dataset limitations and enhance AI pneumonia
            detection accuracy.
          </p>
          <div className="mt-12">
            <Link href="/upload">
              <Button className="bg-blue-600 px-6 py-6 text-base hover:bg-blue-700">
                <Upload className="mr-2 h-5 w-5" />
                Upload X-ray Image
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Empty spacer to push content down */}
      <div className="h-24"></div>

      {/* Dashboard content - moved much lower on the page */}
      <div className="mx-auto max-w-6xl px-4 pb-24">
        {/* Featured content section */}
        <SimpleFeaturedContent />
      </div>
    </div>
  )
}

