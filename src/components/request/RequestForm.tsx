import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarDays, CheckCircle, Minus, Plus, RefreshCw, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackGenerateLead, trackFormError } from "@/lib/analytics";
import { useAvailability } from "@/lib/availability";
import { calculateQuote, MEDIA, type PrintSize } from "@/lib/quote";

const toYmd = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const todayYmd = () => toYmd(new Date());

const relativeTime = (value: string) => {
  const generated = new Date(value).getTime();
  if (Number.isNaN(generated)) return "recently";

  const seconds = Math.round((generated - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (Math.abs(seconds) < 60) return formatter.format(seconds, "second");
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return formatter.format(hours, "hour");
  return formatter.format(Math.round(hours / 24), "day");
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const sizeLabel = (size: PrintSize) => size.replace("x", "×");

const RequestForm = () => {
  const { toast } = useToast();
  const availability = useAvailability();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [dateError, setDateError] = useState("");
  const [selectedRange, setSelectedRange] = useState<DateRange>();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    smsOk: false,
    pickupDate: "",
    returnDate: "",
    eventType: "",
    notes: "",
    printSize: "4x6" as PrintSize,
    mediaKits: 0,
    mediaKitOptIn: false,
    printServer: false,
  });

  const blockedDates = useMemo(() => new Set(availability.blocked), [availability.blocked]);
  const quote = calculateQuote({
    pickupDate: formData.pickupDate,
    returnDate: formData.returnDate,
    withServer: formData.printServer,
    size: formData.printSize,
    kits: formData.mediaKits,
  });

  const isValidPhone = (value: string) => value.replace(/\D/g, "").length >= 10;

  useEffect(() => {
    if (isSubmitted) successHeadingRef.current?.focus();
  }, [isSubmitted]);

  const isDisabledDate = (date: Date) => {
    if (availability.status !== "ready") return false;
    const value = toYmd(date);
    return value < todayYmd() || value > availability.horizonEnd || blockedDates.has(value);
  };

  const rangeCrossesBlockedDate = (from: string, to: string) =>
    availability.status === "ready" &&
    availability.blocked.some((blockedDate) => blockedDate >= from && blockedDate <= to);

  const handleRangeSelect = (range: DateRange | undefined) => {
    setDateError("");

    if (!range?.from) {
      setSelectedRange(undefined);
      setFormData((current) => ({ ...current, pickupDate: "", returnDate: "" }));
      return;
    }

    const pickupDate = toYmd(range.from);
    const returnDate = range.to ? toYmd(range.to) : "";

    if (returnDate && rangeCrossesBlockedDate(pickupDate, returnDate)) {
      setSelectedRange(undefined);
      setFormData((current) => ({ ...current, pickupDate: "", returnDate: "" }));
      setDateError("Those dates cross a booked day — pick a range that doesn't.");
      return;
    }

    setSelectedRange(range);
    setFormData((current) => ({ ...current, pickupDate, returnDate }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let hasError = false;
    if (!formData.pickupDate || !formData.returnDate) {
      setDateError("Please choose both a pickup and return date.");
      hasError = true;
    }
    if (!isValidPhone(formData.phone)) {
      setPhoneError("Please enter a valid phone number with at least 10 digits.");
      hasError = true;
    }
    if (hasError) return;

    setDateError("");
    setPhoneError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/mqeezrqr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _replyto: formData.email,
          _subject: `New PrintKit request — ${formData.name}`,
          Name: formData.name,
          Email: formData.email,
          Phone: formData.phone,
          "OK to text": formData.smsOk ? "Yes" : "No",
          "Pickup date": formData.pickupDate,
          "Return date": formData.returnDate,
          "Event type": formData.eventType || "Not specified",
          Notes: formData.notes || "None",
          days: quote.days,
          printSize: formData.printSize,
          mediaKits: formData.mediaKits,
          printServer: formData.printServer,
          subtotal: quote.subtotal,
          tax: quote.tax,
          total: quote.total,
          dueAtPickup: quote.dueAtPickup,
          availabilityStatus: availability.status,
        }),
      });

      if (!response.ok) throw new Error("Form submission failed");

      setIsSubmitted(true);
      trackGenerateLead();
      toast({
        title: "Request sent!",
        description: "We'll confirm availability, then send the agreement and payment details.",
      });
    } catch {
      trackFormError();
      toast({
        title: "Something went wrong",
        description: "Please try again or email us directly at hello@printkitnyc.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setPhoneError("");
    setDateError("");
    setSelectedRange(undefined);
    setFormData({
      name: "",
      email: "",
      phone: "",
      smsOk: false,
      pickupDate: "",
      returnDate: "",
      eventType: "",
      notes: "",
      printSize: "4x6",
      mediaKits: 0,
      mediaKitOptIn: false,
      printServer: false,
    });
  };

  if (isSubmitted) {
    return (
      <section className="section-padding bg-background" role="status" aria-live="polite">
        <div className="container-narrow">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6" aria-hidden="true">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 ref={successHeadingRef} tabIndex={-1} className="text-3xl md:text-4xl font-semibold mb-4 focus:outline-none">
              Request sent!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Request received! We'll review your dates and reply by text message (or email) within 1–2 business days. If available, we'll send the rental agreement, followed by payment details. Payment is due before pickup.
            </p>
            <Button variant="outline" onClick={resetForm}>Submit another request</Button>
          </div>
        </div>
      </section>
    );
  }

  const selectedRangeText = selectedRange?.from && selectedRange.to
    ? `${format(selectedRange.from, "EEE MMM d")} to ${format(selectedRange.to, "EEE MMM d")} · ${quote.days} ${quote.days === 1 ? "day" : "days"}`
    : "Choose a pickup date, then a return date.";

  const selectedMedia = MEDIA[formData.printSize];

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
              Tell us when you need the PrintKit. We'll confirm availability within 1–2 business days.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card-elevated p-6 md:p-10 space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name *</Label>
                <Input id="name" required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="you@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number *</Label>
              <Input
                id="phone"
                type="tel"
                required
                aria-invalid={phoneError ? true : undefined}
                aria-describedby={phoneError ? "phone-error" : undefined}
                value={formData.phone}
                onChange={(event) => {
                  setFormData({ ...formData, phone: event.target.value });
                  if (phoneError) setPhoneError("");
                }}
                placeholder="(555) 123-4567"
              />
              {phoneError && <p id="phone-error" className="text-sm text-destructive">{phoneError}</p>}
              <div className="flex items-center space-x-3 pt-1">
                <Checkbox id="smsOk" checked={formData.smsOk} onCheckedChange={(checked) => setFormData({ ...formData, smsOk: checked === true })} />
                <Label htmlFor="smsOk" className="text-sm font-normal cursor-pointer">It's okay to text me at this number about my rental</Label>
              </div>
            </div>

            <fieldset className="space-y-4">
              <legend className="text-sm font-medium">Pickup and return dates *</legend>
              {availability.status === "unknown" && (
                <div className="highlight-box rounded-lg p-4 text-sm">
                  Can't load the live calendar right now. Pick your dates anyway and we'll confirm availability by email.
                </div>
              )}
              <div className="flex justify-center overflow-x-auto rounded-lg border border-border bg-card">
                <Calendar
                  mode="range"
                  selected={selectedRange}
                  onSelect={handleRangeSelect}
                  disabled={isDisabledDate}
                  numberOfMonths={1}
                  className="p-3 pointer-events-auto"
                  modifiers={{ booked: availability.status === "ready" ? availability.blocked.map((date) => {
                    const [year, month, day] = date.split("-").map(Number);
                    return new Date(year, month - 1, day);
                  }) : [] }}
                  modifiersClassNames={{ booked: "line-through" }}
                />
              </div>
              <p className="text-sm font-medium" aria-live="polite">{selectedRangeText}</p>
              {dateError && <p className="text-sm text-destructive" role="alert">{dateError}</p>}
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground" aria-label="Availability legend">
                <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full border border-border bg-background" aria-hidden="true" />Available</span>
                <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-muted-foreground" aria-hidden="true" />Already booked</span>
              </div>
              {availability.status === "ready" && (
                <p className="text-sm text-muted-foreground">Availability updated {relativeTime(availability.generated)}</p>
              )}
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-base font-semibold">Add-ons (optional)</legend>
              <p className="text-sm text-muted-foreground">Both are optional. Bring your own DNP DS40-compatible media and skip the print server, or add either below.</p>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="mediaKitOptIn"
                  checked={formData.mediaKitOptIn}
                  onCheckedChange={(checked) => {
                    const optingIn = checked === true;
                    setFormData({
                      ...formData,
                      mediaKitOptIn: optingIn,
                      mediaKits: optingIn ? Math.max(1, formData.mediaKits) : 0,
                    });
                  }}
                />
                <Label htmlFor="mediaKitOptIn" className="font-normal cursor-pointer">Add a prepaid media kit</Label>
              </div>

              {formData.mediaKitOptIn && (
                <div className="space-y-4 border-l-2 border-border pl-4 ml-6">
                  <RadioGroup
                    value={formData.printSize}
                    onValueChange={(value) => setFormData({ ...formData, printSize: value as PrintSize })}
                    className="grid gap-3 sm:grid-cols-3"
                  >
                    {(Object.keys(MEDIA) as PrintSize[]).map((size) => (
                      <Label key={size} htmlFor={`size-${size}`} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 font-normal">
                        <RadioGroupItem id={`size-${size}`} value={size} className="mt-0.5" />
                        <span><span className="block font-medium">{sizeLabel(size)}</span><span className="text-sm text-muted-foreground">{MEDIA[size].prints} prints, ${MEDIA[size].price}</span></span>
                      </Label>
                    ))}
                  </RadioGroup>
                  <p className="text-sm text-muted-foreground">One size per rental. The print size is set by the media loaded in the printer, so it can't be changed mid-event.</p>
                  {formData.printSize === "5x7" && (
                    <div className="highlight-box rounded-lg p-4 text-sm">
                      5x7 is a special order. It's prepaid, non-refundable, and has to be confirmed at least 7 days before pickup. 6x8 gives you the same 200 prints for $40 less on a larger print — the reason to choose 5x7 is that it fits a standard off-the-shelf frame.
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <Label htmlFor="media-kits">Media kits ({selectedMedia.prints} prints each)</Label>
                      <p className="text-sm text-muted-foreground">${selectedMedia.price} per prepaid kit</p>
                    </div>
                    <div className="flex h-10 items-center gap-1" id="media-kits">
                      <Button type="button" variant="outline" size="icon" onClick={() => setFormData({ ...formData, mediaKits: Math.max(0, formData.mediaKits - 1) })} disabled={formData.mediaKits === 0} aria-label="Remove one media kit"><Minus /></Button>
                      <output className="w-10 text-center font-medium" aria-live="polite">{formData.mediaKits}</output>
                      <Button type="button" variant="outline" size="icon" onClick={() => setFormData({ ...formData, mediaKits: Math.min(4, formData.mediaKits + 1) })} disabled={formData.mediaKits === 4} aria-label="Add one media kit"><Plus /></Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 border-t border-border pt-4">
                <Checkbox id="printServer" checked={formData.printServer} onCheckedChange={(checked) => setFormData({ ...formData, printServer: checked === true })} />
                <Label htmlFor="printServer" className="font-normal cursor-pointer">WCMPlus print server ($35/day)</Label>
              </div>
            </fieldset>

            <section className="card-elevated p-5 md:p-6 space-y-4" aria-labelledby="estimate-heading">
              <div>
                <h2 id="estimate-heading" className="text-xl font-semibold">Estimate</h2>
                {!quote.days && <p className="text-sm text-muted-foreground mt-1">Choose your dates to calculate the rental.</p>}
              </div>
              <div className="space-y-3 text-sm">
                {quote.printer > 0 && <div className="grid grid-cols-[1fr_auto] gap-4"><span>Printer rental <span className="text-muted-foreground">· {quote.days} days × $100</span></span><span className="tabular-nums">{money.format(quote.printer)}</span></div>}
                {quote.server > 0 && <div className="grid grid-cols-[1fr_auto] gap-4"><span>Print server <span className="text-muted-foreground">· {quote.days} days × $35</span></span><span className="tabular-nums">{money.format(quote.server)}</span></div>}
                {quote.media > 0 && <div className="grid grid-cols-[1fr_auto] gap-4"><span>Media kit <span className="text-muted-foreground">· {formData.mediaKits} × {sizeLabel(formData.printSize)}</span></span><span className="tabular-nums">{money.format(quote.media)}</span></div>}
                <div className="border-t border-border pt-3 space-y-3">
                  <div className="flex justify-between gap-4"><span>Subtotal</span><span className="tabular-nums">{money.format(quote.subtotal)}</span></div>
                  <div className="flex justify-between gap-4"><span>NY sales tax (8.875%)</span><span className="tabular-nums">{money.format(quote.tax)}</span></div>
                </div>
                <div className="border-t border-border pt-3 space-y-3 font-medium">
                  <div className="flex justify-between gap-4"><span>Total</span><span className="tabular-nums">{money.format(quote.total)}</span></div>
                  <div className="flex justify-between gap-4 font-normal"><span>Refundable deposit</span><span className="tabular-nums">{money.format(quote.deposit)}</span></div>
                  <div className="flex justify-between gap-4 text-base"><span>Due before pickup</span><span className="tabular-nums">{money.format(quote.dueAtPickup)}</span></div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">An estimate, not a confirmed booking. We'll confirm your dates and send a final quote within 1–2 business days. The $200 deposit comes back to you after return. No card or processing fees — the total is what you pay, whichever way you pay.</p>
            </section>

            <div className="space-y-2">
              <Label htmlFor="eventType">What's this for?</Label>
              <Input id="eventType" value={formData.eventType} onChange={(event) => setFormData({ ...formData, eventType: event.target.value })} placeholder="e.g., Birthday party, corporate event, photo booth..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Anything else we should know?</Label>
              <Textarea id="notes" value={formData.notes} onChange={(event) => setFormData({ ...formData, notes: event.target.value })} placeholder="Questions, special requests, or setup details..." rows={4} />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Preparing request..." : <><Send className="w-5 h-5 mr-2" />Request these dates</>}
              </Button>
              <p className="text-sm text-muted-foreground text-center mt-4">No payment required now.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RequestForm;
