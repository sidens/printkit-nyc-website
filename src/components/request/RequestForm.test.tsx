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
  const days = within(grid).getAllByRole("gridcell").filter((cell) => {
    if (!cell.textContent?.trim()) return false;
    const btn = cell.querySelector("button");
    const isDisabled = btn ? btn.disabled : (cell as HTMLButtonElement).disabled;
    return !isDisabled;
  });
  await user.click(days[0]);
  await user.click(days[2]);
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

  it("defaults to the PrintKit media kit with sizes and a 1-4 stepper", async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    expect(screen.getByRole("radio", { name: /PrintKit media kit/ })).toBeChecked();
    expect(screen.getByText("4×6")).toBeInTheDocument();
    expect(screen.getByText("6×8")).toBeInTheDocument();

    const counter = screen.getByRole("status");
    expect(counter.tagName.toLowerCase()).toBe("output");
    expect(counter).toHaveTextContent("1");
    expect(screen.getByLabelText("Remove one media kit")).toBeDisabled();

    const add = screen.getByLabelText("Add one media kit");
    await user.click(add);
    await user.click(add);
    await user.click(add);
    expect(add).toBeDisabled();
    expect(counter).toHaveTextContent("4");
  });

  it("drops the media controls when bringing your own media", async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.click(screen.getByRole("radio", { name: /bring my own DS40 media/ }));
    expect(screen.queryByLabelText("Add one media kit")).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "Must be DNP DS40 media, one size for the whole rental. You'll load it yourself before your event.",
      ),
    ).toBeInTheDocument();
  });

  it("auto-checks the print server for device printing but respects unchecking", async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    const server = screen.getByLabelText("WCMPlus print server ($35/day)");
    expect(server).not.toBeChecked();

    await user.click(screen.getByLabelText("From devices (wireless/ethernet)"));
    expect(server).toBeChecked();

    await user.click(server);
    expect(server).not.toBeChecked();
    expect(
      screen.getByText(
        "Without the print server, you'll need your own computer connected by USB to receive and print photos.",
      ),
    ).toBeInTheDocument();
  });

  it("requires a print method before submitting", async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await pickRange(user);
    await user.type(screen.getByLabelText("Full name *"), "Sam K.");
    await user.type(screen.getByLabelText("Email *"), "sam@example.com");
    await user.click(screen.getByRole("button", { name: /Request these dates/ }));

    expect(await screen.findByText("Pick one. 'Not sure yet' is fine.")).toBeInTheDocument();
    expect(submitCalls()).toHaveLength(0);
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
    await user.click(screen.getByLabelText("Not sure yet"));
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
    await user.click(screen.getByLabelText("From a computer (USB)"));
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
        "mediaChoice",
        "mediaSize",
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
    expect(body.mediaChoice).toBe("kit");
    expect(body.mediaSize).toBe("4x6");
    expect(body.mediaKits).toBe(1);
    expect(body._subject).toContain("[Email]");
    expect(body._subject).toContain(" · Setup: computer");

    expect(await screen.findByRole("heading", { name: "Request sent" })).toBeInTheDocument();
    expect(
      screen.getByText(/We'll email you at sam@example.com within 24 hours/),
    ).toBeInTheDocument();
  });
});
