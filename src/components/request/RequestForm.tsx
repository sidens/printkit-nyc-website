import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const addons = [
  { id: "prepaid-media", label: "Prepaid media kit ($75 — up to 400 prints)" },
  { id: "print-server", label: "WCMPlus Print Server ($35/day)" },
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

    try {
      const response = await fetch("https://formspree.io/f/mqeezrqr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          pickupDate: formData.pickupDate,
          returnDate: formData.returnDate,
          eventType: formData.eventType,
          addons: formData.addons.join(", ") || "None",
          notes: formData.notes || "None",
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Request sent!",
          description: "We'll reply within 1–2 business days with availability.",
        });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or email us directly at hello@printkitnyc.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              Request received! We'll review your dates and reply by text message
              (or email) within 1–2 business days with availability and next steps.
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
