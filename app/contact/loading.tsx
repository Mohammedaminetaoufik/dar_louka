import { Loader2 } from "lucide-react"

export default function ContactLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
