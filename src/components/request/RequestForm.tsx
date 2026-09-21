import { useEffect, useMemo, useRef, useState } from "react";
import { testimonials } from "@/data/testimonials";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, CalendarDays, CheckCircle, Minus, Plus, RefreshCw, Send } from "lucide-react";
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

type ContactPreference = "email" | "text" | "call";
type MediaChoice = "kit" | "byo";

const CONTACT_OPTIONS: { value: ContactPreference; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "text", label: "Text" },
  { value: "call", label: "Call" },
];

const PRINT_METHODS = [
  { value: "computer", label: "From a computer (USB)" },
  { value: "devices", label: "From devices (wireless/ethernet)" },
  { value: "unsure", label: "Not sure yet" },
];

const rangeLabel = (from: Date, to: Date) =>
  from.getMonth() === to.getMonth()
    ? `${format(from, "MMM d")}–${format(to, "d")}`
    : `${format(from, "MMM d")}–${format(to, "MMM d")}`;

const RequestForm = () => {
  const { toast } = useToast();
  const availability = useAvailability();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [dateError, setDateError] = useState("");
  const [printMethodError, setPrintMethodError] = useState("");
  const [selectedRange, setSelectedRange] = useState<DateRange>();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    contactPreference: "email" as ContactPreference,
    bestTimeToCall: "",
    printMethod: "",
    pickupDate: "",
    returnDate: "",
    eventType: "",
    notes: "",
    printSize: "4x6" as PrintSize,
    mediaKits: 1,
    mediaChoice: "kit" as MediaChoice,
    printServer: false,
  });

  const phoneRequired = formData.contactPreference !== "email";

  const handlePrintMethodChange = (value: string) => {
    setPrintMethodError("");
    setFormData((current) => ({
      ...current,
      printMethod: value,
      printServer: value === "devices" && current.printMethod !== "devices" ? true : current.printServer,
    }));
  };

  const blockedDates = useMemo(() => new Set(availability.blocked), [availability.blocked]);
  const quote = calculateQuote({
    pickupDate: formData.pickupDate,
    returnDate: formData.returnDate,
    withServer: formData.printServer,
    size: formData.printSize,
    kits: formData.mediaChoice === "kit" ? formData.mediaKits : 0,
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

  const printMethodLabel = PRINT_METHODS.find((option) => option.value === formData.printMethod)?.label ?? "";

  const preferenceTag =
    formData.contactPreference === "text" ? "Text" : formData.contactPreference === "call" ? "Call" : "Email";

  const setupTag =
    formData.printMethod === "computer"
      ? " · Setup: computer"
      : formData.printMethod === "devices"
        ? " · Setup: devices"
        : " · Setup: not sure";

  const subjectLine =
    (selectedRange?.from && selectedRange.to
      ? `[${preferenceTag}] ${rangeLabel(selectedRange.from, selectedRange.to)} · ${quote.days} ${quote.days === 1 ? "day" : "days"} · ${money.format(quote.dueAtPickup)} · ${formData.name}`
      : `[${preferenceTag}] New PrintKit request · ${formData.name}`) + setupTag;

  const successCopy = () => {
    if (formData.contactPreference === "text") {
      return `We'll text you at ${formData.phone} within 24 hours. Your itemized quote will come by email to ${formData.email}.`;
    }
    if (formData.contactPreference === "call") {
      const when = formData.bestTimeToCall ? `, around ${formData.bestTimeToCall}` : "";
      return `We'll call you at ${formData.phone} within 24 hours${when}. Your itemized quote will come by email to ${formData.email}.`;
    }
    return `We'll email you at ${formData.email} within 24 hours with availability and your itemized quote.`;
  };



  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let hasError = false;
    if (!formData.pickupDate || !formData.returnDate) {
      setDateError("Please choose both a pickup and return date.");
      hasError = true;
    }
    if (!formData.printMethod) {
      setPrintMethodError("Pick one. 'Not sure yet' is fine.");
      hasError = true;
    }
    if (phoneRequired && !isValidPhone(formData.phone)) {
      setPhoneError("Please enter a valid phone number with at least 10 digits.");
      hasError = true;
    }
    if (hasError) return;

    setDateError("");
    setPhoneError("");
    setPrintMethodError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/mqeezrqr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _replyto: formData.email,
          _subject: subjectLine,
          Name: formData.name,
          Email: formData.email,
          Phone: formData.phone,
          contactPreference: formData.contactPreference,
          bestTimeToCall: formData.bestTimeToCall || "Not specified",
          printMethod: printMethodLabel,
          "Pickup date": formData.pickupDate,
          "Return date": formData.returnDate,
          "Event type": formData.eventType || "Not specified",
          Notes: formData.notes || "None",
          days: quote.days,
          mediaChoice: formData.mediaChoice,
          mediaSize: formData.mediaChoice === "kit" ? formData.printSize : "N/A",
          mediaKits: formData.mediaChoice === "kit" ? formData.mediaKits : 0,
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
    setPrintMethodError("");
    setDateError("");
    setSelectedRange(undefined);
    setFormData({
      name: "",
      email: "",
      phone: "",
      contactPreference: "email",
      bestTimeToCall: "",
      printMethod: "",
      pickupDate: "",
      returnDate: "",
      eventType: "",
      notes: "",
      printSize: "4x6",
      mediaKits: 1,
      mediaChoice: "kit",
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
              Request sent
            </h1>
            <p className="text-lg text-muted-foreground mb-4">{successCopy()}</p>
            {formData.printMethod === "unsure" && (
              <p className="text-lg text-muted-foreground mb-8">Not sure how you'll print? No problem. We'll walk through the options with you when we reply.</p>
            )}
            {formData.printMethod !== "unsure" && <div className="mb-4" />}
            <Button variant="outline" onClick={resetForm}>Submit another request</Button>
          </div>
        </div>
      </section>
    );
  }

  const hasFullRange = !!(selectedRange?.from && selectedRange.to);
  const pickupActive = !selectedRange?.from;
  const returnActive = !!selectedRange?.from && !selectedRange?.to;
  const pickupText = selectedRange?.from ? format(selectedRange.from, "EEE, MMM d") : "Select date";
  const returnText = selectedRange?.to ? format(selectedRange.to, "EEE, MMM d") : "Select date";

  const syncedTitle = availability.generated ? new Date(availability.generated).toLocaleString() : "";
  const syncedText = availability.generated ? `Synced ${relativeTime(availability.generated)}` : "";
  const isStale =
    availability.status === "ready" &&
    !!availability.generated &&
    Date.now() - new Date(availability.generated).getTime() > 24 * 60 * 60 * 1000;

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

            <fieldset className="space-y-4">
              <legend className="text-sm font-medium">Pickup and return dates *</legend>
              {availability.status === "unknown" && (
                <div className="highlight-box rounded-lg p-4 text-sm">
                  Can't load the live calendar right now. Pick your dates anyway and we'll confirm availability by email.
                </div>
              )}
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-3 px-3 pt-3 max-[399px]:flex-col max-[399px]:items-start">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`flex-1 ${pickupActive ? "border-b-2 border-primary" : ""}`}>
                      <p className="text-xs tracking-wide text-muted-foreground uppercase">Pickup</p>
                      <p className={`text-base font-medium ${selectedRange?.from ? "" : "text-muted-foreground"}`}>{pickupText}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
                    <div className={`flex-1 ${returnActive ? "border-b-2 border-primary" : ""}`}>
                      <p className="text-xs tracking-wide text-muted-foreground uppercase">Return</p>
                      <p className={`text-base font-medium ${selectedRange?.to ? "" : "text-muted-foreground"}`}>{returnText}</p>
                    </div>
                  </div>
                  {hasFullRange && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{quote.days} {quote.days === 1 ? "day" : "days"}</span>
                  )}
                </div>
                <div className="border-t border-border flex justify-center overflow-x-auto">
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
                <div className="border-t border-border pt-3 mt-2 px-3 pb-3 flex justify-between items-center text-xs text-muted-foreground gap-2 max-[399px]:flex-col max-[399px]:items-start">
                  <div className="inline-flex items-center gap-3" aria-label="Availability legend">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="inline-flex items-center justify-center h-9 w-9 rounded-md text-sm font-normal" aria-hidden="true">23</span>
                      Available
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="inline-flex items-center justify-center h-9 w-9 rounded-md text-sm font-normal text-muted-foreground opacity-50 line-through" aria-hidden="true">23</span>
                      Booked
                    </span>
                  </div>
                  {availability.status === "ready" && (
                    <span className="inline-flex items-center gap-1.5" title={syncedTitle}>
                      <RefreshCw className="w-3 h-3" aria-hidden="true" />
                      {isStale ? `${syncedText} · we'll confirm by email` : syncedText}
                    </span>
                  )}
                </div>
              </div>
              {dateError && <p className="text-sm text-destructive" role="alert">{dateError}</p>}
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-base font-semibold">How will you print? *</legend>
              <RadioGroup
                value={formData.printMethod}
                onValueChange={handlePrintMethodChange}
                className="grid gap-3 sm:grid-cols-3"
              >
                {PRINT_METHODS.map((option) => (
                  <Label key={option.value} htmlFor={`method-${option.value}`} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 font-normal">
                    <RadioGroupItem id={`method-${option.value}`} value={option.value} className="mt-0.5" />
                    <span>{option.label}</span>
                  </Label>
                ))}
              </RadioGroup>
              {printMethodError && <p className="text-sm text-destructive" role="alert">{printMethodError}</p>}
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-base font-semibold">Print media</legend>
              <p className="text-sm text-muted-foreground">Every rental needs one roll of DS40 media. Ours comes loaded in the printer and test-printed before pickup.</p>

              <RadioGroup
                value={formData.mediaChoice}
                onValueChange={(value) => setFormData({ ...formData, mediaChoice: value as MediaChoice })}
                className="grid gap-3"
              >
                <div className="rounded-lg border border-border p-3 space-y-4">
                  <Label htmlFor="media-kit" className="flex cursor-pointer items-start gap-3 font-normal">
                    <RadioGroupItem id="media-kit" value="kit" className="mt-0.5" />
                    <span className="flex-1 font-medium">PrintKit media kit</span>
                    <span className="tabular-nums font-medium">{money.format(selectedMedia.price * formData.mediaKits)}</span>
                  </Label>

                  {formData.mediaChoice === "kit" && (
                    <div className="space-y-4 pl-7">
                      <RadioGroup
                        value={formData.printSize}
                        onValueChange={(value) => setFormData({ ...formData, printSize: value as PrintSize })}
                        className="grid gap-3 sm:grid-cols-3"
                      >
                        {(Object.keys(MEDIA) as PrintSize[]).map((size) => (
                          <Label key={size} htmlFor={`size-${size}`} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 font-normal">
                            <RadioGroupItem id={`size-${size}`} value={size} className="mt-0.5" />
                            <span><span className="block font-medium">{sizeLabel(size)}</span><span className="text-sm text-muted-foreground">{MEDIA[size].prints} prints · ${MEDIA[size].price}</span></span>
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
                          <Label htmlFor="media-kits">Kits ({selectedMedia.prints} prints each)</Label>
                          <p className="text-sm text-muted-foreground">${selectedMedia.price} per kit</p>
                        </div>
                        <div className="flex h-10 items-center gap-1" id="media-kits">
                          <Button type="button" variant="outline" size="icon" onClick={() => setFormData({ ...formData, mediaKits: Math.max(1, formData.mediaKits - 1) })} disabled={formData.mediaKits === 1} aria-label="Remove one media kit"><Minus /></Button>
                          <output className="w-10 text-center font-medium" aria-live="polite">{formData.mediaKits}</output>
                          <Button type="button" variant="outline" size="icon" onClick={() => setFormData({ ...formData, mediaKits: Math.min(4, formData.mediaKits + 1) })} disabled={formData.mediaKits === 4} aria-label="Add one media kit"><Plus /></Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-border p-3 space-y-2">
                  <Label htmlFor="media-byo" className="flex cursor-pointer items-start gap-3 font-normal">
                    <RadioGroupItem id="media-byo" value="byo" className="mt-0.5" />
                    <span className="flex-1 font-medium">I'll bring my own DS40 media</span>
                    <span className="tabular-nums font-medium">—</span>
                  </Label>
                  {formData.mediaChoice === "byo" && (
                    <p className="text-xs text-muted-foreground pl-7">Must be DNP DS40 media, one size for the whole rental. You'll load it yourself before your event.</p>
                  )}
                </div>
              </RadioGroup>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-base font-semibold">Add-on</legend>
              <div className="flex items-center space-x-3">
                <Checkbox id="printServer" checked={formData.printServer} onCheckedChange={(checked) => setFormData({ ...formData, printServer: checked === true })} />
                <Label htmlFor="printServer" className="font-normal cursor-pointer">WCMPlus print server ($35/day)</Label>
              </div>
              {formData.printMethod === "devices" && !formData.printServer && (
                <p className="text-xs text-muted-foreground">Without the print server, you'll need your own computer connected by USB to receive and print photos.</p>
              )}
            </fieldset>

            <section className="card-elevated p-5 md:p-6 space-y-4" aria-labelledby="estimate-heading">
              <div>
                <h2 id="estimate-heading" className="text-xl font-semibold">Estimate</h2>
                {!quote.days && <p className="text-sm text-muted-foreground mt-1">Pick your dates to see an estimate.</p>}
              </div>
              {quote.days > 0 && (
                <>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{format(selectedRange!.from!, "EEE MMM d")} → {format(selectedRange!.to!, "EEE MMM d")} · {quote.days} {quote.days === 1 ? "day" : "days"}</p>
                    <p className="text-xs text-muted-foreground">Pickup and return days both count.</p>
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
                </>
              )}
            </section>

            <div className="space-y-6">
              <h2 className="text-base font-semibold">Your details</h2>

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
                <p className="text-sm font-medium" id="contact-preference-label">How should we reach you?</p>
                <div role="radiogroup" aria-labelledby="contact-preference-label" className="grid grid-cols-3 gap-2 rounded-lg border border-border p-1">
                  {CONTACT_OPTIONS.map((option) => {
                    const active = formData.contactPreference === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => {
                          setPhoneError("");
                          setFormData({ ...formData, contactPreference: option.value });
                        }}
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Your itemized quote always comes by email. This is for clarifying next steps and coordinating logistics.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  {formData.contactPreference === "text"
                    ? "Mobile number for texts *"
                    : formData.contactPreference === "call"
                      ? "Best number to call *"
                      : "Phone"}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required={phoneRequired}
                  aria-invalid={phoneError ? true : undefined}
                  aria-describedby={phoneError ? "phone-error" : undefined}
                  value={formData.phone}
                  onChange={(event) => {
                    setFormData({ ...formData, phone: event.target.value });
                    if (phoneError) setPhoneError("");
                  }}
                  placeholder="(555) 123-4567"
                />
                {formData.contactPreference === "text" && (
                  <p className="text-xs text-muted-foreground">We'll only text about this rental.</p>
                )}
                {phoneError && <p id="phone-error" className="text-sm text-destructive">{phoneError}</p>}
              </div>

              {formData.contactPreference === "call" && (
                <div className="space-y-2">
                  <Label htmlFor="bestTimeToCall">Best time to call</Label>
                  <Input id="bestTimeToCall" value={formData.bestTimeToCall} onChange={(event) => setFormData({ ...formData, bestTimeToCall: event.target.value })} placeholder="e.g. weekday evenings" />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="eventType">What's this for?</Label>
                <Input id="eventType" value={formData.eventType} onChange={(event) => setFormData({ ...formData, eventType: event.target.value })} placeholder="School fundraiser, ~150 guests, souvenir prints to take home" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Anything else we should know?</Label>
                <Textarea id="notes" value={formData.notes} onChange={(event) => setFormData({ ...formData, notes: event.target.value })} placeholder="Questions, special requests, or setup details..." rows={4} />
              </div>
            </div>

            <blockquote className="border-l-2 border-primary/40 pl-4 my-6">
              <p className="text-sm text-foreground">{testimonials[0].pullQuote}</p>
              <p className="text-xs text-muted-foreground mt-2">Sam K., Admiration</p>
            </blockquote>

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
