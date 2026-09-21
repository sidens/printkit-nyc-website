import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RequestForm from "./RequestForm";

vi.mock("@/lib/analytics", () => ({
  trackGenerateLead: vi.fn(),
  trackFormError: vi.fn(),
}));

const formspree = "https://formspree.io/f/mqeezrqr";

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("availability.json")) {
      return { ok: false, json: async () => null } as unknown as Response;
    }
    return { ok: true, json: async () => ({}) } as unknown as Response;
  });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

const submitCalls = () => fetchMock.mock.calls.filter(([url]) => String(url) === formspree);

const pickRange = async (user: ReturnType<typeof userEvent.setup>) => {
  const grid = screen.getByRole("grid");
  const days = within(grid).getAllByRole("gridcell").filter((cell) => !!cell.textContent?.trim());
  await user.click(days[9]);
  await user.click(days[11]);
};

describe("RequestForm", () => {
  it("renders the empty estimate state without dollar lines", async () => {
    render(<RequestForm />);
    expect(await screen.findByRole("heading", { name: "Estimate" })).toBeInTheDocument();
    expect(screen.getByText("Pick your dates to see an estimate.")).toBeInTheDocument();
    expect(screen.queryByText("Subtotal")).not.toBeInTheDocument();
    expect(screen.queryByText("Due before pickup")).not.toBeInTheDocument();
  });

  it("shows an itemized estimate once a range is selected", async () => {
    const user = userEvent.setup();
    render(<RequestForm />);
    await pickRange(user);

    expect(screen.getByText("Pickup and return days both count.")).toBeInTheDocument();
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    expect(screen.getByText("NY sales tax (8.875%)")).toBeInTheDocument();
    expect(screen.getByText("Due before pickup")).toBeInTheDocument();
    expect(screen.getByText("Refundable deposit")).toBeInTheDocument();
  });

  it("keeps the media kit opt-in off until checked, then reveals sizes and the counter", async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    expect(screen.queryByLabelText("Add one media kit")).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Add a prepaid media kit"));

    expect(screen.getByText("4×6")).toBeInTheDocument();
    expect(screen.getByText("6×8")).toBeInTheDocument();
    const output = screen.getByText("1");
    expect(output.tagName.toLowerCase()).toBe("output");

    const add = screen.getByLabelText("Add one media kit");
    await user.click(add);
    await user.click(add);
    await user.click(add);
    expect(add).toBeDisabled();
    expect(screen.getByText("4").tagName.toLowerCase()).toBe("output");
  });

  it("hints at the print server for device printing without checking it", async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.click(screen.getByLabelText("From devices (wireless/ethernet)"));
    expect(
      screen.getByText("Printing from devices needs the WCMPlus print server — add it below."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("WCMPlus print server ($35/day)")).not.toBeChecked();
  });

  it("switches the phone label with the contact preference", async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Text" }));
    expect(screen.getByLabelText("Mobile number for texts *")).toBeRequired();

    await user.click(screen.getByRole("radio", { name: "Call" }));
    expect(screen.getByLabelText("Best number to call *")).toBeRequired();
    expect(screen.getByLabelText("Best time to call")).toBeInTheDocument();
  });

  it("blocks submission when a required phone number is invalid", async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await pickRange(user);
    await user.type(screen.getByLabelText("Full name *"), "Sam K.");
    await user.type(screen.getByLabelText("Email *"), "sam@example.com");
    await user.click(screen.getByRole("radio", { name: "Text" }));
    await user.type(screen.getByLabelText("Mobile number for texts *"), "555123");
    await user.click(screen.getByRole("button", { name: /Request these dates/ }));

    expect(
      await screen.findByText("Please enter a valid phone number with at least 10 digits."),
    ).toBeInTheDocument();
    expect(submitCalls()).toHaveLength(0);
  });

  it("requires dates before submitting", async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText("Full name *"), "Sam K.");
    await user.type(screen.getByLabelText("Email *"), "sam@example.com");
    await user.click(screen.getByRole("button", { name: /Request these dates/ }));

    expect(await screen.findByText("Please choose both a pickup and return date.")).toBeInTheDocument();
    expect(submitCalls()).toHaveLength(0);
  });

  it("sends the expected payload and shows the success screen", async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await pickRange(user);
    await user.type(screen.getByLabelText("Full name *"), "Sam K.");
    await user.type(screen.getByLabelText("Email *"), "sam@example.com");
    await user.click(screen.getByLabelText("WCMPlus print server ($35/day)"));
    await user.click(screen.getByRole("button", { name: /Request these dates/ }));

    await waitFor(() => expect(submitCalls()).toHaveLength(1));
    const body = JSON.parse(String(submitCalls()[0][1]?.body));

    expect(Object.keys(body)).toEqual(
      expect.arrayContaining([
        "_replyto",
        "_subject",
        "Name",
        "Email",
        "Phone",
        "contactPreference",
        "bestTimeToCall",
        "printMethod",
        "Pickup date",
        "Return date",
        "Event type",
        "Notes",
        "days",
        "printSize",
        "mediaKits",
        "printServer",
        "subtotal",
        "tax",
        "total",
        "dueAtPickup",
        "availabilityStatus",
      ]),
    );
    expect(body.contactPreference).toBe("email");
    expect(body.days).toBe(3);
    expect(body.printServer).toBe(true);
    expect(body.mediaKits).toBe(0);
    expect(body._subject).toContain("[Email]");

    expect(await screen.findByRole("heading", { name: "Request sent" })).toBeInTheDocument();
    expect(
      screen.getByText(/We'll email you at sam@example.com within 24 hours/),
    ).toBeInTheDocument();
  });
});
