import { FormEvent, useEffect, useState } from "react";

import { api } from "../lib/api";
import type { ComplaintCreateResponse, ComplaintTicket, Ministry } from "../types";

const formatDate = (value?: string): string => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const titleCase = (value: string): string => value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export default function GetInvolved(): JSX.Element {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [complaintResult, setComplaintResult] = useState<ComplaintCreateResponse | null>(null);
  const [complaintError, setComplaintError] = useState<string>("");
  const [submittingComplaint, setSubmittingComplaint] = useState<boolean>(false);

  const [ticketId, setTicketId] = useState<string>("");
  const [ticketResult, setTicketResult] = useState<ComplaintTicket | null>(null);
  const [ticketError, setTicketError] = useState<string>("");
  const [trackingTicket, setTrackingTicket] = useState<boolean>(false);

  useEffect(() => {
    void (async () => {
      try {
        const data = await api.getMinistries();
        setMinistries(data);
      } catch (error) {
        // Silently handle error
      }
    })();
  }, []);

  const handleSubmitComplaint = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const ministry = String(formData.get("ministry") ?? "");
    const category = String(formData.get("category") ?? "");
    const message = String(formData.get("message") ?? "");
    const isAnonymous = String(formData.get("isAnonymous") ?? "true") === "true";
    const contactEmail = String(formData.get("contactEmail") ?? "").trim();

    setComplaintError("");
    setComplaintResult(null);

    try {
      setSubmittingComplaint(true);
      const data = await api.submitComplaint({
        ministry: ministry || undefined,
        category,
        message,
        isAnonymous,
        contactEmail: contactEmail || undefined
      });
      setComplaintResult(data);
      event.currentTarget.reset();
    } catch (submitError) {
      setComplaintError(submitError instanceof Error ? submitError.message : "Complaint submission failed");
    } finally {
      setSubmittingComplaint(false);
    }
  };

  const handleTrackTicket = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    setTicketError("");
    setTicketResult(null);

    if (!ticketId.trim()) {
      setTicketError("Please enter a valid ticket ID.");
      return;
    }

    try {
      setTrackingTicket(true);
      const data = await api.trackComplaint(ticketId.trim());
      setTicketResult(data);
    } catch (trackError) {
      setTicketError(trackError instanceof Error ? trackError.message : "Unable to track ticket");
    } finally {
      setTrackingTicket(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Get Involved</h1>
        <p className="page-description">
          Participate in government transparency and civic engagement
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Submit a Complaint</h2>
            <p className="card-description">Your feedback helps improve government services</p>
          </div>
          <div className="card-content">
            <p className="text-gray-700 mb-4">
              Submit anonymously or with contact information for follow-up.
            </p>
            <form onSubmit={(event) => void handleSubmitComplaint(event)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Ministry</label>
                  <select name="ministry" className="form-select">
                    <option value="">General</option>
                    {ministries.map((ministry) => (
                      <option key={ministry.id} value={ministry.slug}>
                        {ministry.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input name="category" className="form-input" defaultValue="Service Delivery" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea name="message" className="form-textarea" placeholder="Describe your complaint..." required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Submission Type</label>
                  <select name="isAnonymous" className="form-select">
                    <option value="true">Anonymous</option>
                    <option value="false">Named</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Email (Optional)</label>
                  <input name="contactEmail" type="email" className="form-input" placeholder="name@example.com" />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={submittingComplaint}>
                {submittingComplaint ? "Submitting..." : "Submit Complaint"}
              </button>
            </form>

            {complaintError && <div className="alert alert-error mt-4">{complaintError}</div>}
            {complaintResult && (
              <div className="alert alert-success mt-4">
                <strong>Ticket Created:</strong> {complaintResult.ticketId}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Track Your Complaint</h2>
            <p className="card-description">Check the current status of your submitted complaint</p>
          </div>
          <div className="card-content">
            <p className="text-gray-700 mb-4">
              Use your ticket ID to check processing status.
            </p>
            <form onSubmit={(event) => void handleTrackTicket(event)} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Ticket ID</label>
                <input
                  value={ticketId}
                  onChange={(event) => setTicketId(event.target.value)}
                  className="form-input"
                  placeholder="NPL-1234567"
                  required
                />
              </div>

              <button type="submit" className="btn btn-secondary w-full" disabled={trackingTicket}>
                {trackingTicket ? "Checking..." : "Track Ticket"}
              </button>
            </form>

            {ticketError && <div className="alert alert-error mt-4">{ticketError}</div>}
            {ticketResult && (
              <div className="alert alert-success mt-4">
                <div className="font-medium">{ticketResult.ticketId}</div>
                <div className="text-sm mt-1">
                  Status: <span className="font-medium">{titleCase(ticketResult.status)}</span>
                </div>
                <div className="text-sm">Created: {formatDate(ticketResult.createdAt)}</div>
                <div className="text-sm">Updated: {formatDate(ticketResult.updatedAt)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Other Ways to Get Involved</h2>
          <p className="card-description">Participate in government transparency initiatives</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-primary mr-3 mt-1">•</span>
              <div>
                <strong className="text-gray-900">Stay Informed:</strong>
                <p className="text-gray-600 text-sm">Follow government announcements and project updates</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-primary mr-3 mt-1">•</span>
              <div>
                <strong className="text-gray-900">Provide Feedback:</strong>
                <p className="text-gray-600 text-sm">Use our complaint system to report issues</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-primary mr-3 mt-1">•</span>
              <div>
                <strong className="text-gray-900">Access Services:</strong>
                <p className="text-gray-600 text-sm">Find ministry contact information and services</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-primary mr-3 mt-1">•</span>
              <div>
                <strong className="text-gray-900">Monitor Progress:</strong>
                <p className="text-gray-600 text-sm">Track government project implementation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
