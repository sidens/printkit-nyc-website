import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const addons = [
  { id: "prepaid-media", label: "Prepaid media kit ($150 — up to 400 prints)" },
  { id: "print-server", label: "WCMPlus Print Server ($35/day)" },
  { id: "spare-media", label: "Spare media backup kit ($25)" },
];

const RequestForm = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickupDate: "",
    returnDate: "",
    eventType: "",
    notes: "",
    addons: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Build mailto link as fallback
    const subject = encodeURIComponent("PrintKit Rental Request");
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `Pickup Date: ${formData.pickupDate}\n` +
        `Return Date: ${formData.returnDate}\n` +
        `Event Type: ${formData.eventType}\n` +
        `Add-ons: ${formData.addons.join(", ") || "None"}\n` +
        `Notes: ${formData.notes || "None"}`
    );

    window.location.href = `mailto:hello@printkitnyc.com?subject=${subject}&body=${body}`;

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast({
      title: "Request prepared!",
      description: "Your email client should open with your request details.",
    });
  };

  const handleAddonChange = (addonId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      addons: checked
        ? [...prev.addons, addonId]
        : prev.addons.filter((id) => id !== addonId),
    }));
  };

  if (isSubmitted) {
    return (
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">Request sent!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Check your email client — your rental request should be ready to send. 
              We'll respond within 24 hours with availability and next steps.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  pickupDate: "",
                  returnDate: "",
                  eventType: "",
                  notes: "",
                  addons: [],
                });
              }}
            >
              Submit another request
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <CalendarDays className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">Request your dates</h1>
            <p className="text-lg text-muted-foreground">
              Tell us when you need the PrintKit. We'll confirm availability within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card-elevated p-8 md:p-10 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pickupDate">Pickup date *</Label>
                <Input
                  id="pickupDate"
                  type="date"
                  required
                  value={formData.pickupDate}
                  onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="returnDate">Return date *</Label>
                <Input
                  id="returnDate"
                  type="date"
                  required
                  value={formData.returnDate}
                  onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventType">What's this for?</Label>
              <Input
                id="eventType"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                placeholder="e.g., Birthday party, corporate event, photo booth..."
              />
            </div>

            <div className="space-y-4">
              <Label>Optional add-ons</Label>
              <div className="space-y-3">
                {addons.map((addon) => (
                  <div key={addon.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={addon.id}
                      checked={formData.addons.includes(addon.id)}
                      onCheckedChange={(checked) =>
                        handleAddonChange(addon.id, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={addon.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {addon.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Anything else we should know?</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Questions, special requests, or setup details..."
                rows={4}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Preparing request..."
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send request
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center mt-4">
                No payment required now. We'll confirm availability first.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RequestForm;
