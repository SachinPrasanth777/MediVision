import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function SimpleFeaturedContent() {
  return (
    <div className="space-y-24">
      {/* Main featured item */}
      <Card className="overflow-hidden border-gray-800/40 bg-gray-900/30 shadow-lg">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="p-10">
            <h3 className="mb-5 text-2xl font-bold">Privacy-Compliant Detection</h3>
            <p className="mb-8 text-gray-300">
              Our system uses GAN-generated X-rays to overcome dataset limitations while maintaining strict privacy
              standards for medical imaging analysis.
            </p>

            <div className="mb-10 space-y-5">
              <div className="flex items-center">
                <div className="mr-3 h-2 w-2 rounded-full bg-blue-400"></div>
                <span className="text-gray-300">Privacy-preserving technology</span>
              </div>
              <div className="flex items-center">
                <div className="mr-3 h-2 w-2 rounded-full bg-blue-400"></div>
                <span className="text-gray-300">Secure data handling</span>
              </div>
              <div className="flex items-center">
                <div className="mr-3 h-2 w-2 rounded-full bg-blue-400"></div>
                <span className="text-gray-300">Advanced image processing</span>
              </div>
            </div>

            <Link href="/upload">
              <Button className="bg-blue-600 px-5 py-2 hover:bg-blue-700">Learn More</Button>
            </Link>
          </div>

          <div className="relative min-h-[350px] bg-gray-900">
            {/* New X-ray image */}
            <div className="absolute inset-0">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-s2.0-S0263931909001811-gr4.jpg-FPdRtyQX2iuJMTk5eowG2K1WoG4Ipy.jpeg"
                alt="X-ray analysis"
                fill
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 to-gray-900/80"></div>
            </div>

            {/* Blue circle overlay on top of the X-ray */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-blue-500/20 p-6 backdrop-blur-sm">
                <div className="rounded-full bg-blue-500 p-10"></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* How it works section */}
      <div>
        <h2 className="mb-10 text-center text-2xl font-bold">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="border-gray-800/40 bg-gray-900/30 p-8 text-center shadow-md">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
              <span className="text-xl font-bold text-blue-400">1</span>
            </div>
            <h3 className="mb-3 text-lg font-medium">Upload</h3>
            <p className="text-gray-400">Upload your X-ray image securely to our platform.</p>
          </Card>

          <Card className="border-gray-800/40 bg-gray-900/30 p-8 text-center shadow-md">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
              <span className="text-xl font-bold text-blue-400">2</span>
            </div>
            <h3 className="mb-3 text-lg font-medium">Process</h3>
            <p className="text-gray-400">Our AI system analyzes the image securely.</p>
          </Card>

          <Card className="border-gray-800/40 bg-gray-900/30 p-8 text-center shadow-md">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
              <span className="text-xl font-bold text-blue-400">3</span>
            </div>
            <h3 className="mb-3 text-lg font-medium">Results</h3>
            <p className="text-gray-400">Receive detailed analysis results.</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

